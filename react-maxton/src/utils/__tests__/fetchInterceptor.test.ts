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
    const store = { dispatch: jest.fn() } as any;
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
});
