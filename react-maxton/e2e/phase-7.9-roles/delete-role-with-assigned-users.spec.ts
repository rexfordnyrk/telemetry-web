import { test, expect } from '@playwright/test';

// §7.9 phase-4 — delete-role-with-assigned-users.
// See role-duplicate-name-casing.spec.ts for why this logs in via the real
// UI form instead of the shared `authedPage` fixture (PermissionRoute needs
// a hydrated `state.auth.user`, which that fixture cannot provide).
async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.locator('#inputEmailAddress').fill('admin@e2e.test');
  await page.locator('#inputChoosePassword').fill('E2eAdmin!2026');
  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 20000 }),
    page.getByRole('button', { name: /^login$/i }).click(),
  ]);
}

test.describe('§7.9 delete role with assigned users', () => {
  test('shows friendly warning; role remains in list; modal stays open', async ({ page }) => {
    // Wide viewport — see role-duplicate-name-casing.spec.ts: below ~1400px
    // DataTables' responsive plugin collapses the Actions column, hiding the
    // row's Delete button entirely.
    await page.setViewportSize({ width: 1600, height: 1000 });

    await loginAsAdmin(page);
    await page.goto('/user-management/roles-permissions');

    // Guard: "Cashier" fixture (2 assigned users) present.
    await expect(page.getByRole('link', { name: 'Cashier', exact: true })).toBeVisible({ timeout: 15000 });

    const cashierRow = page.getByRole('row').filter({ hasText: 'Cashier' });
    await cashierRow.getByRole('button', { name: /delete/i }).click();

    // Confirm modal opens (plain div with role="dialog" — not a native <dialog>).
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: /confirm delete role/i })).toBeVisible();

    // Confirm the delete.
    await dialog.getByRole('button', { name: /delete role/i }).click();

    // Server rejects with 409 role_has_active_users; the UI renders it as an
    // inline alert-warning (not alert-danger) and keeps the modal open.
    const warning = dialog.locator('.alert.alert-warning');
    await expect(warning).toBeVisible({ timeout: 10000 });
    await expect(warning).toContainText('This role has 2 assigned users');
    await expect(warning).toContainText(/reassign/i);

    // Modal is still open (not auto-closed / not a toast-and-dismiss flow).
    await expect(dialog.getByRole('heading', { name: /confirm delete role/i })).toBeVisible();

    // Dismiss via Cancel.
    await dialog.getByRole('button', { name: /^cancel$/i }).click();
    await expect(dialog).toHaveCount(0);

    // Cashier is still present in the roles list.
    await expect(page.getByRole('link', { name: 'Cashier', exact: true })).toBeVisible();
  });
});
