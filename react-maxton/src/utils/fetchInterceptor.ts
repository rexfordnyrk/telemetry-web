/**
 * Global fetch interceptor — fail-closed handling of 401 responses.
 *
 * Many callers (page components, slice thunks added before the central
 * apiUtils helper existed) call window.fetch directly and discard the
 * response body, so a 401 from a disabled-account / stale token-version
 * check used to surface only as an inline error with no logout or
 * redirect. The interceptor wraps window.fetch once at app boot:
 *
 *   - Pass-through for non-401 responses.
 *   - On 401, peek at the JSON body (or fall back to a tee of the
 *     stream) and decide if this is a session-ending signal:
 *       * token_version_stale          → permissions/account changed
 *       * any AUTH_ERROR_CODES match    → session expired
 *     If so, dispatch sessionExpired() and redirect to /login. The
 *     toast comes from the existing handleSessionExpired helper so
 *     behaviour stays consistent with the thunk-level path.
 *   - The original Response object is returned UNCHANGED so callers
 *     can still inspect / parse it; we re-attach a fresh body clone
 *     so `await response.json()` keeps working.
 *
 * The interceptor is registered once from `src/index.tsx` after the
 * store is created — see installFetchInterceptor(store).
 */

import type { Store } from "@reduxjs/toolkit";
import { refreshSession } from "../store/slices/authSlice";
import { getAuthHeaders } from "../config/api";
import { handleSessionExpired, handlePermissionsStale } from "./apiUtils";

// Stable error codes the backend returns for auth failure. The
// middleware normalizes wrapped jwt-go errors to one of these strings
// (see backend internal/middleware/jwt.go::normalizeJWTError).
const AUTH_ERROR_CODES = new Set([
  "Authorization header is required",
  "Invalid authorization header format",
  "Token has been revoked",
  "Invalid token",
  "Token has expired",
  "Invalid token claims",
  "invalid_refresh_token",
  "missing_token",
  "account_disabled",
  "invalid token",
]);

// Defensive: backend wasn't always normalizing this — older deployments
// or callers we haven't migrated yet can still surface verbose wrapped
// strings like "failed to parse token: token has invalid claims: token
// is expired". A pattern-match catches anything we'd otherwise miss.
const AUTH_ERROR_PATTERNS: RegExp[] = [
  /token (is|has) expired/i,
  /invalid token/i,
  /invalid token claims/i,
  /token has been revoked/i,
  /missing token/i,
  /invalid_refresh_token/i,
  /account_disabled/i,
  /authorization header (is required|format)/i,
];

function isAuthErrorString(s: string): boolean {
  if (!s) return false;
  if (AUTH_ERROR_CODES.has(s)) return true;
  return AUTH_ERROR_PATTERNS.some((re) => re.test(s));
}

let installed = false;
// Cooldown to avoid stacking redirects when several requests fail in
// parallel (e.g. dashboard widgets) — the first one wins, subsequent
// 401s pass through silently until the page actually navigates.
let redirectInFlight = false;
// In-flight refresh promise — multiple 401s during the same window
// share the same refresh attempt so we don't burn the refresh token.
let refreshInFlight: Promise<boolean> | null = null;

function isAuthEndpoint(url: string): boolean {
  return (
    url.includes("/api/v1/auth/login") ||
    url.includes("/api/v1/auth/refresh") ||
    url.includes("/api/v1/auth/forgot-password") ||
    url.includes("/api/v1/auth/reset-password") ||
    url.includes("/api/v1/auth/mfa/verify")
  );
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

// Reapply auth headers using the freshly-refreshed token. Build from
// scratch via getAuthHeaders so a stale Authorization in init.headers
// (the caller embedded the expired token) gets overwritten.
function withFreshAuth(init: RequestInit | undefined, token: string): RequestInit {
  const merged: Record<string, string> = {};
  const incoming = (init?.headers ?? {}) as Record<string, string> | Headers;
  if (incoming instanceof Headers) {
    incoming.forEach((value, key) => {
      merged[key] = value;
    });
  } else {
    Object.assign(merged, incoming);
  }
  // Drop any stale auth header before layering the fresh one.
  delete merged.Authorization;
  delete merged.authorization;
  Object.assign(merged, getAuthHeaders(token));
  return { ...init, headers: merged };
}

export function installFetchInterceptor(store: Store): void {
  if (installed || typeof window === "undefined" || !window.fetch) {
    return;
  }
  installed = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const response = await originalFetch(input, init);

    if (response.status !== 401 || redirectInFlight) {
      return response;
    }

    // Don't intercept on the auth endpoints themselves — login / refresh
    // legitimately return 401 when the user mistypes a password, and
    // ForgotPassword can return 401 if the route gate fails.
    const url = requestUrl(input);
    if (isAuthEndpoint(url)) {
      return response;
    }

    // Try to read the body without consuming it for the caller.
    const cloned = response.clone();
    let payload: any = null;
    try {
      payload = await cloned.json();
    } catch {
      payload = null;
    }

    const errorCode = String(payload?.error ?? "");
    const isStaleVersion = errorCode === "token_version_stale";
    const isAuthError = !isStaleVersion && isAuthErrorString(errorCode);

    if (!isStaleVersion && !isAuthError) {
      return response;
    }

    // Stale token_version — admin changed roles or disabled the
    // account. No point trying to refresh; force re-login.
    if (isStaleVersion) {
      redirectInFlight = true;
      try { handlePermissionsStale(store.dispatch); } catch { /* nav fires */ }
      return response;
    }

    // Generic auth-error 401: attempt refresh first so a routinely
    // expired access token doesn't kick the user back to the login
    // screen. If the refresh succeeds, re-issue the original request
    // with the new access token and return the retried response —
    // callers transparently see a 2xx instead of the original 401.
    const state = (store.getState() as any) || {};
    const hasRefreshToken = !!state.auth?.refreshToken;
    if (hasRefreshToken) {
      if (!refreshInFlight) {
        refreshInFlight = (async () => {
          try {
            const action = await store.dispatch(refreshSession() as any);
            return refreshSession.fulfilled.match(action);
          } catch {
            return false;
          } finally {
            // Release for the next 401 cycle once this one resolves.
            setTimeout(() => { refreshInFlight = null; }, 0);
          }
        })();
      }
      const refreshed = await refreshInFlight;
      if (refreshed) {
        const newToken = (store.getState() as any)?.auth?.token as string | undefined;
        if (newToken) {
          // Re-issue the original request with the fresh token.
          return originalFetch(input, withFreshAuth(init, newToken));
        }
      }
    }

    // Refresh wasn't possible or didn't succeed — log out for real.
    redirectInFlight = true;
    try { handleSessionExpired(store.dispatch); } catch { /* nav fires */ }
    return response;
  };
}
