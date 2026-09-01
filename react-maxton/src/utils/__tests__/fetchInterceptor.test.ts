/**
 * @jest-environment jsdom
 */

// Capture handler calls from apiUtils so the interceptor's redirect path
// is observable without actually navigating the test runner.
const mockHandleSessionExpired = jest.fn();
const mockHandlePermissionsStale = jest.fn();

jest.mock('../apiUtils', () => ({
  handleSessionExpired: (...args: any[]) => mockHandleSessionExpired(...args),
  handlePermissionsStale: (...args: any[]) => mockHandlePermissionsStale(...args),
}));

import { installFetchInterceptor } from '../fetchInterceptor';

describe('installFetchInterceptor', () => {
  let originalFetch: typeof window.fetch | undefined;
  let lastUpstreamCall: { url: string; init?: RequestInit } | null = null;

  beforeEach(() => {
    mockHandleSessionExpired.mockReset();
    mockHandlePermissionsStale.mockReset();
    lastUpstreamCall = null;

    originalFetch = window.fetch;
    // Re-arm the interceptor each test — installed-once guard inside the
    // module is reset by re-importing via jest.resetModules below.
    jest.resetModules();
  });

  afterEach(() => {
    if (originalFetch) window.fetch = originalFetch;
  });

  function arm(upstream: (url: string, init?: RequestInit) => Promise<Response>) {
    window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      lastUpstreamCall = { url, init };
      return upstream(url, init);
    }) as typeof window.fetch;

    // Force re-import so the module-level "installed" guard is fresh.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../fetchInterceptor');
    // Provide a real-store-shaped mock — the interceptor's refresh path
    // calls store.getState() to check for a refreshToken before deciding
    // whether to attempt refresh-then-retry. Without a refreshToken the
    // interceptor falls back to its previous "redirect immediately"
    // behaviour, which is what these baseline tests assert.
    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(() => ({ auth: { refreshToken: null, token: null } })),
    } as any;
    mod.installFetchInterceptor(store);
    return store;
  }

  function jsonResponse(status: number, body: Record<string, unknown>): Response {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  it('passes 2xx responses through unchanged', async () => {
    arm(async () => jsonResponse(200, { ok: true }));
    const res = await window.fetch('http://example.com/api/v1/users');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(mockHandleSessionExpired).not.toHaveBeenCalled();
    expect(mockHandlePermissionsStale).not.toHaveBeenCalled();
  });

  it('dispatches handlePermissionsStale on token_version_stale 401', async () => {
    arm(async () => jsonResponse(401, { error: 'token_version_stale' }));
    await window.fetch('http://example.com/api/v1/users');
    expect(mockHandlePermissionsStale).toHaveBeenCalledTimes(1);
    expect(mockHandleSessionExpired).not.toHaveBeenCalled();
  });

  it('dispatches handleSessionExpired on a generic auth-error 401', async () => {
    arm(async () => jsonResponse(401, { error: 'Token has been revoked' }));
    await window.fetch('http://example.com/api/v1/users');
    expect(mockHandleSessionExpired).toHaveBeenCalledTimes(1);
    expect(mockHandlePermissionsStale).not.toHaveBeenCalled();
  });

  it('dispatches handleSessionExpired when the account is disabled', async () => {
    arm(async () => jsonResponse(401, { error: 'account_disabled' }));
    await window.fetch('http://example.com/api/v1/users');
    expect(mockHandleSessionExpired).toHaveBeenCalledTimes(1);
  });

  it('does NOT redirect on 401 from /api/v1/auth/login', async () => {
    arm(async () => jsonResponse(401, { error: 'invalid_credentials' }));
    const res = await window.fetch('http://example.com/api/v1/auth/login');
    expect(res.status).toBe(401);
    expect(mockHandleSessionExpired).not.toHaveBeenCalled();
    expect(mockHandlePermissionsStale).not.toHaveBeenCalled();
  });

  it('does NOT redirect on a non-401 error', async () => {
    arm(async () => jsonResponse(500, { error: 'server_error' }));
    const res = await window.fetch('http://example.com/api/v1/users');
    expect(res.status).toBe(500);
    expect(mockHandleSessionExpired).not.toHaveBeenCalled();
  });

  it('preserves the response body for the caller to consume', async () => {
    arm(async () => jsonResponse(401, { error: 'token_version_stale', extra: 'data' }));
    const res = await window.fetch('http://example.com/api/v1/users');
    // Caller can still parse the body — the interceptor reads a clone.
    const body = await res.json();
    expect(body.error).toBe('token_version_stale');
    expect(body.extra).toBe('data');
  });

  it('only redirects once even when multiple 401s come in', async () => {
    arm(async () => jsonResponse(401, { error: 'token_version_stale' }));
    await window.fetch('http://example.com/api/v1/users');
    await window.fetch('http://example.com/api/v1/beneficiaries');
    await window.fetch('http://example.com/api/v1/devices');
    expect(mockHandlePermissionsStale).toHaveBeenCalledTimes(1);
  });

  // UAT bug 3 regression — older deployments and any code path that
  // wasn't passed through the new normalizeJWTError helper can still
  // surface the verbose wrapped error string. The interceptor must
  // recognize the substring and route the 401 to the session-expired
  // logout path instead of silently passing through.
  it('treats verbose wrapped "token is expired" string as a session-expired 401', async () => {
    arm(async () =>
      jsonResponse(401, {
        error: 'failed to parse token: token has invalid claims: token is expired',
      })
    );
    await window.fetch('http://example.com/api/v1/users');
    expect(mockHandleSessionExpired).toHaveBeenCalledTimes(1);
    expect(mockHandlePermissionsStale).not.toHaveBeenCalled();
  });
});

// Refresh-then-retry: when the store has a refresh token, the
// interceptor should NOT redirect on a 401 it can recover from —
// it should dispatch refreshSession and re-issue the original
// request with the fresh access token instead. These tests need
// their own jest.isolateModules / mock arrangement so the
// authSlice module mock can swap in a stub refreshSession.
describe('installFetchInterceptor — refresh-then-retry', () => {
  const mockHandleSessionExpired = jest.fn();
  const mockHandlePermissionsStale = jest.fn();
  const mockRefreshSession = jest.fn();
  let originalFetch: typeof window.fetch | undefined;

  beforeEach(() => {
    jest.resetModules();
    mockHandleSessionExpired.mockReset();
    mockHandlePermissionsStale.mockReset();
    mockRefreshSession.mockReset();
    originalFetch = window.fetch;

    jest.doMock('../apiUtils', () => ({
      handleSessionExpired: (...args: any[]) => mockHandleSessionExpired(...args),
      handlePermissionsStale: (...args: any[]) => mockHandlePermissionsStale(...args),
    }));
    // Build a refreshSession action-creator-shaped stub so the
    // interceptor's `refreshSession.fulfilled.match(action)` check
    // resolves cleanly.
    const FULFILLED = 'auth/refreshSession/fulfilled';
    const refreshSessionStub: any = (...args: any[]) => mockRefreshSession(...args);
    refreshSessionStub.fulfilled = {
      match: (action: any) => action?.type === FULFILLED,
      type: FULFILLED,
    };
    jest.doMock('../../store/slices/authSlice', () => ({
      refreshSession: refreshSessionStub,
    }));
    jest.doMock('../../config/api', () => ({
      getAuthHeaders: (token: string) => ({ Authorization: `Bearer ${token}` }),
    }));
  });

  afterEach(() => {
    if (originalFetch) window.fetch = originalFetch;
    jest.dontMock('../apiUtils');
    jest.dontMock('../../store/slices/authSlice');
    jest.dontMock('../../config/api');
  });

  function arm(handler: (url: string, init?: RequestInit) => Promise<Response>) {
    window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      return handler(url, init);
    }) as typeof window.fetch;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../fetchInterceptor');
    let currentToken = 'expired-access-token';
    const dispatch = jest.fn(async () => {
      // Simulate refreshSession's success: the slice would replace the
      // access token on fulfilled. We mutate the closure here so a
      // subsequent getState() sees the new token.
      currentToken = 'fresh-access-token';
      return { type: 'auth/refreshSession/fulfilled' };
    });
    const store = {
      dispatch,
      getState: () => ({ auth: { refreshToken: 'refresh-abc', token: currentToken } }),
    } as any;
    mod.installFetchInterceptor(store);
    return { store };
  }

  function jsonResponse(status: number, body: Record<string, unknown>): Response {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  it('refreshes the access token and re-issues the original request on token-expired 401', async () => {
    let callCount = 0;
    arm(async (url, init) => {
      callCount += 1;
      // First call (with expired token) returns 401; the retry should
      // carry the fresh token and succeed.
      if (callCount === 1) {
        return jsonResponse(401, { error: 'Token has expired' });
      }
      const authHeader =
        (init?.headers as Record<string, string> | undefined)?.Authorization ?? '';
      expect(authHeader).toBe('Bearer fresh-access-token');
      return jsonResponse(200, { ok: true });
    });

    const res = await window.fetch('http://example.com/api/v1/users');
    expect(res.status).toBe(200);
    expect(mockHandleSessionExpired).not.toHaveBeenCalled();
    expect(callCount).toBe(2);
  });

  it('falls back to session-expired logout if refresh itself fails', async () => {
    // Re-arm fetch but override dispatch to simulate refresh failure.
    window.fetch = (async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : (input as Request).url;
      if (url.includes('/users')) {
        return jsonResponse(401, { error: 'Token has expired' });
      }
      return jsonResponse(500, { error: 'unreachable' });
    }) as typeof window.fetch;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../fetchInterceptor');
    const dispatch = jest.fn(async () => ({ type: 'auth/refreshSession/rejected' }));
    const store = {
      dispatch,
      getState: () => ({ auth: { refreshToken: 'refresh-abc', token: 'expired' } }),
    } as any;
    mod.installFetchInterceptor(store);

    await window.fetch('http://example.com/api/v1/users');
    expect(mockHandleSessionExpired).toHaveBeenCalledTimes(1);
  });
});
