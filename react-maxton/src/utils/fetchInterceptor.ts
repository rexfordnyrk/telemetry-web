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
import { handleSessionExpired, handlePermissionsStale } from "./apiUtils";

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

let installed = false;
// Cooldown to avoid stacking redirects when several requests fail in
// parallel (e.g. dashboard widgets) — the first one wins, subsequent
// 401s pass through silently until the page actually navigates.
let redirectInFlight = false;

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

    // Don't redirect on the auth endpoints themselves — login / refresh
    // legitimately return 401 when the user mistypes a password, and
    // ForgotPassword can return 401 if the route gate fails. Detecting
    // by URL keeps the logic local and avoids whitelist drift.
    const url = typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;
    if (
      url.includes("/api/v1/auth/login") ||
      url.includes("/api/v1/auth/refresh") ||
      url.includes("/api/v1/auth/forgot-password") ||
      url.includes("/api/v1/auth/reset-password") ||
      url.includes("/api/v1/auth/mfa/verify")
    ) {
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

    const errorCode = payload?.error ?? "";
    const isStaleVersion = errorCode === "token_version_stale";
    const isAuthError = AUTH_ERROR_CODES.has(errorCode);

    if (isStaleVersion || isAuthError) {
      redirectInFlight = true;
      try {
        if (isStaleVersion) {
          handlePermissionsStale(store.dispatch);
        } else {
          handleSessionExpired(store.dispatch);
        }
      } catch {
        // handleSessionExpired triggers a hard nav via
        // window.location.href; the unreachable code path after that
        // doesn't matter for the user experience.
      }
    }

    return response;
  };
}
