/**
 * Global API error handler for authenticated API calls
 * Handles common API errors like 401 session expired with refresh-then-retry
 */

import { toast } from 'react-toastify';
import { ServerError, sessionExpired, refreshSession } from '../store/slices/authSlice';
import { getAuthHeaders } from '../config/api';

/**
 * The JSON shape produced by backend/internal/errormap.AppError.
 * All new/updated Role and Permission handlers return this shape on
 * error responses (see docs/fixes/web/7.9-roles-permissions/designs/
 * phase-2-validation-errormap.md §"Response shape").
 */
export type AppErrorBody = {
  code: string;
  message: string;
  field?: string;
  // Extra keys such as assigned_count for role_has_active_users
  [k: string]: unknown;
};

/**
 * Narrow type guard for the new structured error envelope.
 * Consumers may narrow `unknown` from a caught `axios` error's
 * `response?.data` to AppErrorBody with this guard.
 */
export function isStructuredError(x: unknown): x is AppErrorBody {
  return (
    typeof x === "object" &&
    x !== null &&
    "code" in x &&
    "message" in x &&
    typeof (x as { code: unknown }).code === "string" &&
    typeof (x as { message: unknown }).message === "string"
  );
}

const AUTH_ERROR_CODES = [
  'Authorization header is required',
  'Invalid authorization header format',
  'Token has been revoked',
  'Invalid token',
  'Token has expired',
  'Invalid token claims',
  'invalid_refresh_token',
  'missing_token',
];

const SESSION_EXPIRED_MESSAGE = 'Your session has expired. Please log in again.';
const PERMISSIONS_CHANGED_MESSAGE = 'Your permissions have changed. Please log in again.';

export const handleSessionExpired = (dispatch?: any): void => {
  if (!dispatch) return;

  dispatch(sessionExpired());
  toast.warning(SESSION_EXPIRED_MESSAGE);
  window.location.href = '/login?reason=session_expired';
};

export const handlePermissionsStale = (dispatch?: any): void => {
  if (!dispatch) return;

  dispatch(sessionExpired());
  toast.warning(PERMISSIONS_CHANGED_MESSAGE);
  window.location.href = '/login?reason=permissions_changed';
};

export const attemptTokenRefresh = async (
  dispatch: any,
  getState: () => { auth: { refreshToken: string | null } }
): Promise<boolean> => {
  const refreshToken = getState().auth.refreshToken;
  if (!refreshToken) {
    return false;
  }

  const result = await dispatch(refreshSession());
  return refreshSession.fulfilled.match(result);
};

const isAuthError = (errorData: ServerError): boolean => {
  return AUTH_ERROR_CODES.includes(errorData.error);
};

const SENSITIVE_ERROR_SUBSTRINGS = [
  "sqlstate",
  "pq:",
  "duplicate key",
  "violates",
];

/**
 * Defense in depth: any legacy string that looks like it came from a
 * pq driver or postgres SQLSTATE gets replaced with a generic user-safe
 * message. Only applied to the string-return branch of handleApiError —
 * structured AppErrorBody responses are never subjected to this filter
 * because they are already sanitized upstream by backend/internal/errormap.
 */
function sanitizeLegacyErrorText(raw: string, fallback: string): string {
  if (raw.length > 120) return fallback;
  const lc = raw.toLowerCase();
  for (const needle of SENSITIVE_ERROR_SUBSTRINGS) {
    if (lc.includes(needle)) return fallback;
  }
  return raw;
}

export const handleApiError = async (
  response: Response,
  errorMessage: string,
  dispatch?: any,
  getState?: () => { auth: { refreshToken: string | null; token: string | null } },
  alreadyRetried = false
): Promise<string> => {
  try {
    const errorData: ServerError = await response.json();

    // Short-circuit for structured error envelope (already sanitized upstream)
    if (isStructuredError(errorData)) {
      return errorData.message;
    }

    if (response.status === 401 && errorData.error === 'token_version_stale') {
      if (dispatch) {
        handlePermissionsStale(dispatch);
      }
      return PERMISSIONS_CHANGED_MESSAGE;
    }

    if (response.status === 401 && isAuthError(errorData)) {
      if (
        dispatch &&
        getState &&
        !alreadyRetried &&
        getState().auth.refreshToken
      ) {
        const refreshed = await attemptTokenRefresh(dispatch, getState);
        if (refreshed) {
          return '__RETRY__';
        }
      }

      if (dispatch) {
        handleSessionExpired(dispatch);
      }

      return SESSION_EXPIRED_MESSAGE;
    }

    if (errorData.error === 'role_in_use') {
      if (errorData.description) {
        return errorData.description;
      }
      if (typeof errorData.user_count === 'number') {
        return `Cannot delete role: ${errorData.user_count} user(s) assigned. Reassign users first.`;
      }
    }

    const candidate = (
      errorData.error_description ||
      errorData.Description ||
      errorData.description ||
      errorData.error ||
      errorMessage
    );
    return sanitizeLegacyErrorText(String(candidate), "Something went wrong. Please try again.");
  } catch {
    if (response.status === 401) {
      if (dispatch) {
        handleSessionExpired(dispatch);
      }
      return SESSION_EXPIRED_MESSAGE;
    }

    switch (response.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return SESSION_EXPIRED_MESSAGE;
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found. Please check the URL and try again.';
      case 500:
        return 'Server error occurred. Please try again later.';
      default:
        return `Request failed (${response.status}). Please try again.`;
    }
  }
};

export const apiFetch = async (
  url: string,
  options: RequestInit = {},
  dispatch?: any,
  getState?: () => { auth: { refreshToken: string | null; token: string | null } }
): Promise<any> => {
  const makeRequest = async (token?: string | null) => {
    const authHeaders = token ? getAuthHeaders(token) : {};
    const mergedHeaders = {
      ...authHeaders,
      ...(options.headers as Record<string, string> | undefined),
    };

    return fetch(url, {
      ...options,
      headers: mergedHeaders,
    });
  };

  const token = getState?.().auth.token;
  let response = await makeRequest(token);

  if (!response.ok) {
    const errorMessage = await handleApiError(
      response,
      'API request failed',
      dispatch,
      getState,
      false
    );

    if (errorMessage === '__RETRY__' && getState) {
      response = await makeRequest(getState().auth.token);
      if (response.ok) {
        return await response.json();
      }

      const retryError = await handleApiError(
        response,
        'API request failed',
        dispatch,
        getState,
        true
      );
      throw new Error(retryError);
    }

    throw new Error(errorMessage);
  }

  return await response.json();
};
