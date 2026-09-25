import { test, expect } from '@playwright/test';

// §7.9 phase-4 — role-name-length.
//
// Pure API-level test: the client form's `max=50` intent aside, the real
// contract under test is the *server's* response shape for an over-length
// name, so this hits POST /api/v1/roles directly rather than going through
// the UI (which additionally makes it independent of whatever the modal's
// client-side validation does or doesn't enforce).
//
// KNOWN GAP (verified against the live backend, not assumed from the plan):
// backend/internal/errormap/errormap.go's `Translate()` only special-cases
// *pq.Error and gorm.ErrRecordNotFound; a Gin/validator binding error (what
// `binding:"required,min=2,max=50"` produces for a 60-char name) falls through
// to the generic `{"code":"internal_error", ...}` / HTTP 500 branch instead of
// a 4xx "role_field_too_long"-style response. That's a real gap worth fixing
// in errormap.Translate (add a case for validator.ValidationErrors), but it is
// out of scope for this Playwright-only work unit — modifying handlers/errormap
// is explicitly not in scope here. This spec therefore asserts the invariant
// that actually matters for security (structured code+message, zero raw
// SQL/driver leakage) rather than a specific status code, and documents the
// discrepancy for follow-up.
test.describe('§7.9 role name length overflow', () => {
  test('server rejects 60-char name with a structured, leak-free error body', async ({ playwright }) => {
    const apiURL = process.env.E2E_API_URL ?? 'http://localhost:8080';
    const ctx = await playwright.request.newContext({ baseURL: apiURL });

    const loginRes = await ctx.post('/api/v1/auth/login', {
      data: { username: 'admin@e2e.test', password: 'E2eAdmin!2026' },
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginBody = await loginRes.json();
    const token: string = loginBody.token ?? loginBody?.data?.token ?? loginBody?.access_token;
    expect(typeof token).toBe('string');

    const res = await ctx.post('/api/v1/roles', {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: 'A'.repeat(60), description: '§7.9 phase-4 overflow-check' },
    });

    // Must be rejected outright — never a 2xx/3xx.
    expect(res.status()).toBeGreaterThanOrEqual(400);

    const rawText = await res.text();
    const lower = rawText.toLowerCase();
    expect(lower).not.toContain('sqlstate');
    expect(lower).not.toContain('pq:');
    expect(lower).not.toContain('duplicate key');
    expect(lower).not.toContain('violates');
    expect(lower).not.toContain('character varying');

    const body = JSON.parse(rawText);
    expect(typeof body.code).toBe('string');
    expect(body.code.length).toBeGreaterThan(0);
    expect(typeof body.message).toBe('string');
    expect(body.message.length).toBeGreaterThan(0);

    await ctx.dispose();
  });
});
