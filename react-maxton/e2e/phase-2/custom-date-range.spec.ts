import { test, expect } from '../fixtures/auth';

test.describe('Phase 2 — Custom date range (DEF-547)', () => {
  test('applying a custom range fetches Overview without a 400 warning', async ({ authedPage: page }) => {
    await page.goto('/dashboard');
    await page.waitForResponse((res) => res.url().includes('/dashboard/overview') && res.ok(), { timeout: 15000 });

    // Open Filters modal
    await page.getByRole('button', { name: /filters/i }).first().click();

    // Pick "Custom range…" from the period select. FiltersButton uses <option value="custom">.
    await page.getByLabel(/period/i).selectOption({ value: 'custom' });

    // Custom range picker appears (data-testid="custom-range-picker").
    await expect(page.getByTestId('custom-range-picker')).toBeVisible();

    // Fill start / end dates. react-datepicker: two inputs — first is start, second is end.
    const twoDaysAgo = new Date(Date.now() - 2 * 86400_000);
    const today = new Date();
    const fmt = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;

    const inputs = page.getByTestId('custom-range-picker').locator('input');
    await inputs.nth(0).fill(fmt(twoDaysAgo));
    await inputs.nth(0).press('Enter');
    await inputs.nth(1).fill(fmt(today));
    await inputs.nth(1).press('Enter');

    // Click Done (or Apply) — the modal footer button.
    const applyBtn = page.getByRole('button', { name: /done|apply/i }).last();
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/dashboard/overview'), { timeout: 15000 }),
      applyBtn.click(),
    ]);
    expect(res.status()).toBeLessThan(400);
  });
});
