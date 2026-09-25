import { test, expect } from '@playwright/test';

// §7.9 phase-4 — role-duplicate-name-casing.
//
// NOTE on auth: the shared `authedPage` fixture (e2e/fixtures/auth.ts) seeds
// localStorage.auth_state with `user: null` via a context-level init script.
// That script re-runs on every navigation/reload in the context (Playwright
// init-script semantics), so `user` can never be hydrated afterwards from
// inside a test — and this page is wrapped in
// `<PermissionRoute requiredPermissions={["list_roles"]}>`, which reads
// `state.auth.user.permissions` (always `[]` when `user` is null) and renders
// an "Access Denied" screen instead of the page. This was previously
// unobserved because no other e2e spec navigates to a PermissionRoute-gated
// page. Logging in through the real UI form populates `user` correctly via
// the app's own `loginUser` thunk, so this spec (and the two other
// page-navigating §7.9 specs) do a real login instead of using the fixture.
async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.locator('#inputEmailAddress').fill('admin@e2e.test');
  await page.locator('#inputChoosePassword').fill('E2eAdmin!2026');
  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 20000 }),
    page.getByRole('button', { name: /^login$/i }).click(),
  ]);
}

test.describe('§7.9 role duplicate name (case-insensitive)', () => {
  test('lowercase variant of existing "Manager" is rejected with friendly message', async ({ page }) => {
    // Wide viewport: DataTables' "responsive" extension collapses the
    // Actions column behind a "+" toggle below ~1400px, which would hide
    // the row action buttons other §7.9 specs need. Keep this consistent
    // across the suite.
    await page.setViewportSize({ width: 1600, height: 1000 });

    await loginAsAdmin(page);
    await page.goto('/user-management/roles-permissions');

    // Guard: "Manager" fixture present (seeded by backend/internal/seed/e2e.go).
    // Use the `link` role (the role name renders as an <a>), not `cell` —
    // DataTables sets role="grid" on the table once it finishes initializing,
    // which flips native <td> mapping from "cell" to "gridcell" and would
    // make a `cell`-role locator flaky depending on init timing.
    await expect(page.getByRole('link', { name: 'Manager', exact: true })).toBeVisible({ timeout: 15000 });

    // Open Create Role modal.
    await page.getByRole('button', { name: /new role/i }).click();
    await expect(page.getByRole('heading', { name: /create new role/i })).toBeVisible();

    // Enter lowercase collision. Passes client-side validation (letters only,
    // length >= 2) so the request actually reaches the server.
    await page.getByLabel(/role name/i).fill('manager');
    await page.getByRole('button', { name: /^create role$/i }).click();

    // The modal and the page both render `rolesError` in a `role="alert"`
    // div, so scope to the modal to avoid a strict-mode multi-match.
    const alert = page.locator('.modal-content').getByRole('alert');
    await expect(alert).toBeVisible({ timeout: 10000 });
    await expect(alert).toContainText('A role with this name already exists.');

    // No raw SQL/driver detail ever reaches the client.
    const alertText = ((await alert.textContent()) ?? '').toLowerCase();
    expect(alertText).not.toContain('sqlstate');
    expect(alertText).not.toContain('pq:');
    expect(alertText).not.toContain('duplicate key');
    expect(alertText).not.toContain('violates');

    // Modal remains open (the app does not close it on a rejected create).
    await expect(page.getByRole('heading', { name: /create new role/i })).toBeVisible();

    // Close modal, assert roles list unchanged — still exactly one "Manager".
    await page.getByRole('button', { name: /^cancel$/i }).click();
    await expect(page.getByRole('heading', { name: /create new role/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Manager', exact: true })).toHaveCount(1);
  });
});
