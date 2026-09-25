import { test, expect, Page, Locator } from '@playwright/test';

// §7.9 phase-4 — permission-search-and-select-all.
// See role-duplicate-name-casing.spec.ts for why this logs in via the real
// UI form instead of the shared `authedPage` fixture (PermissionRoute needs
// a hydrated `state.auth.user`, which that fixture cannot provide).
async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.locator('#inputEmailAddress').fill('admin@e2e.test');
  await page.locator('#inputChoosePassword').fill('E2eAdmin!2026');
  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 20000 }),
    page.getByRole('button', { name: /^login$/i }).click(),
  ]);
}

// Scope to the "Available Permissions" / "Pending Additions" panel by its
// heading text rather than a CSS class — both panels share the same
// `div.mb-4` wrapper class as every other block in this card, so the
// heading is what actually disambiguates them.
function panelByHeading(page: Page, headingPattern: RegExp): Locator {
  return page.locator('div.mb-4').filter({ has: page.getByText(headingPattern) });
}

test.describe('§7.9 permission search + select-all-visible', () => {
  test('searching filters permissions; select-all-visible batch-adds; clear removes all pending', async ({ page }) => {
    // Wide viewport — see role-duplicate-name-casing.spec.ts.
    await page.setViewportSize({ width: 1600, height: 1000 });

    await loginAsAdmin(page);
    await page.goto('/user-management/roles-permissions');

    // Guard: "Manager" fixture (0 assigned permissions — a clean slate).
    await expect(page.getByRole('link', { name: 'Manager', exact: true })).toBeVisible({ timeout: 15000 });
    // A brief settle before interacting: DataTables re-initializes shortly
    // after the roles table first renders, and clicking mid-re-init can be
    // flaky (see phase-4-playwright.md's "DataTables interference" note).
    await page.waitForTimeout(1000);
    await page.getByRole('link', { name: 'Manager', exact: true }).click();

    const availableSection = panelByHeading(page, /available permissions/i);
    await expect(availableSection).toBeVisible({ timeout: 15000 });

    const searchBox = page.getByPlaceholder(/search permissions/i);
    const selectAllBtn = page.getByRole('button', { name: /select all visible/i });
    const clearSelectionBtn = page.getByRole('button', { name: /clear selection/i });
    const pendingSection = panelByHeading(page, /pending additions/i);

    // --- search "create" ---
    await searchBox.fill('create');
    await expect(selectAllBtn).toBeEnabled();
    const createBtnText = (await selectAllBtn.textContent()) ?? '';
    const createMatch = createBtnText.match(/\((\d+)\)/);
    expect(createMatch).not.toBeNull();
    const createCount = Number(createMatch![1]);
    // The backend seed guarantees at least create_e2e_fixture_alpha/beta.
    expect(createCount).toBeGreaterThanOrEqual(2);

    const visibleDuringCreateSearch = await availableSection.locator('span.badge').allTextContents();
    expect(visibleDuringCreateSearch.length).toBe(createCount);
    for (const text of visibleDuringCreateSearch) {
      expect(text.toLowerCase()).toContain('create');
    }

    // --- select all visible (only create_* goes to Pending Additions) ---
    await selectAllBtn.click();
    await expect(pendingSection).toBeVisible();
    await expect(pendingSection.getByRole('heading', { name: /pending additions/i })).toContainText(`(${createCount})`);
    const pendingAfterCreate = await pendingSection.locator('span.badge').allTextContents();
    expect(pendingAfterCreate.length).toBe(createCount);
    for (const text of pendingAfterCreate) {
      expect(text.toLowerCase()).toContain('create');
    }

    // --- clear search: non-create permissions reappear; create_* no longer
    // available (they moved to Pending, not because they're hidden) ---
    await searchBox.clear();
    const availableAfterClear = await availableSection.locator('span.badge').allTextContents();
    expect(availableAfterClear.length).toBeGreaterThan(0);
    for (const text of availableAfterClear) {
      expect(text.toLowerCase()).not.toContain('create');
    }
    // The e2e read_* fixtures are among the ones that reappeared.
    expect(availableAfterClear).toEqual(
      expect.arrayContaining(['read_e2e_fixture_alpha', 'read_e2e_fixture_beta']),
    );

    // --- search "read" — select-all-visible reflects only the remaining
    // (non-pending) read_* permissions, independent of the create_* batch ---
    await searchBox.fill('read');
    await expect(selectAllBtn).toBeEnabled();
    const readBtnText = (await selectAllBtn.textContent()) ?? '';
    const readMatch = readBtnText.match(/\((\d+)\)/);
    expect(readMatch).not.toBeNull();
    const readCount = Number(readMatch![1]);
    expect(readCount).toBeGreaterThanOrEqual(2);

    const visibleDuringReadSearch = await availableSection.locator('span.badge').allTextContents();
    expect(visibleDuringReadSearch.length).toBe(readCount);
    for (const text of visibleDuringReadSearch) {
      expect(text.toLowerCase()).toContain('read');
    }

    await selectAllBtn.click();
    await searchBox.clear();

    // --- both batches now sit in Pending Additions; everything else stays
    // in Available ---
    const pendingBoth = await pendingSection.locator('span.badge').allTextContents();
    expect(pendingBoth.length).toBe(createCount + readCount);
    expect(pendingBoth.filter((t) => t.toLowerCase().includes('create')).length).toBe(createCount);
    expect(pendingBoth.filter((t) => t.toLowerCase().includes('read')).length).toBe(readCount);

    const availableFinal = await availableSection.locator('span.badge').allTextContents();
    for (const text of availableFinal) {
      expect(text.toLowerCase()).not.toContain('create');
      expect(text.toLowerCase()).not.toContain('read');
    }

    // --- Clear Selection empties pending entirely ---
    await clearSelectionBtn.click();
    await expect(pendingSection).toHaveCount(0);

    // Nothing was ever applied/saved — no Apply Changes click occurred.
  });
});
