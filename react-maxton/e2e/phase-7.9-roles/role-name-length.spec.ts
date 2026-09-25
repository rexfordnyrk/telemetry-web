import { test, expect } from '@playwright/test';

// §7.9 phase-4 — role-name-length.
//
// Pure API-level test: the client form's `max=50` intent aside, the real
// contract under test is the *server's* response shape for an over-length
// name, so this hits POST /api/v1/roles directly rather than going through
// the UI (which additionally makes it independent of whatever the modal's
// client-side validation does or doesn't enforce).
//
// Backend contract (after commit 98b7c34 — validator.ValidationErrors branch
// added to errormap.Translate): a Gin binding tag failure (`max=50` on a
// 60-char name) resolves to HTTP 400 with `code:"role_field_too_long"`,
// `field:"name"`, and no raw pq/SQLSTATE text anywhere in the response.
test.describe('§7.9 role name length overflow', () => {
  test('server rejects 60-char name with role_field_too_long, no SQL leak', async ({ playwright }) => {
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

    // Intended contract: 400 with role_field_too_long.
    expect(res.status()).toBe(400);

    const rawText = await res.text();
    const lower = rawText.toLowerCase();
    expect(lower).not.toContain('sqlstate');
    expect(lower).not.toContain('pq:');
    expect(lower).not.toContain('duplicate key');
    expect(lower).not.toContain('violates');
    expect(lower).not.toContain('character varying');

    const body = JSON.parse(rawText);
    expect(body.code).toBe('role_field_too_long');
    expect(body.field).toBe('name');
    expect(typeof body.message).toBe('string');
    expect(body.message.toLowerCase()).toContain('too long');

    await ctx.dispose();
  });
});
