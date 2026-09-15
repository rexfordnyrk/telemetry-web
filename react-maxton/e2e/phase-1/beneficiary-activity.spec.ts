import { test, expect } from '../fixtures/auth';

test.describe('Phase 1 — Beneficiary Activity Overview (DEF-518)', () => {
  test('renders seeded beneficiary rows with relative last-synced time', async ({ authedPage: page }) => {
    await page.goto('/dashboard');
    // Wait for the widget heading (rendered from Overview.tsx line ~505 "Beneficiary Activity Overview")
    await expect(page.getByText('Beneficiary Activity Overview')).toBeVisible({ timeout: 15000 });
    // Rows: at minimum 3 seeded active beneficiaries appear. Widget renders a table; count rows.
    const rows = page.locator('table tbody tr');
    await expect(rows).not.toHaveCount(0, { timeout: 15000 });
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(3);
    // Last-synced column shows a relative-time string.
    const cellText = await rows.first().locator('td').last().innerText();
    expect(cellText).toMatch(/(\d+m|\d+h|\d+d|just now|ago)/i);
  });
});
