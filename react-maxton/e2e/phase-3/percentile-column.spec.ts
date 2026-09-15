import { test, expect } from '../fixtures/auth';

test.describe('Phase 3 — Beneficiary Activity Detail Modal — percentile column', () => {
  test('modal renders a Percentile column with numeric values', async ({ authedPage: page }) => {
    await page.goto('/dashboard');
    await page.waitForResponse((res) => res.url().includes('/dashboard/overview') && res.ok(), { timeout: 15000 });
    // Open ellipse menu → View Details
    const widget = page.getByText('Beneficiary Activity Overview').first()
      .locator('xpath=ancestor::*[contains(@class, "card") or contains(@class, "widget")][1]');
    await widget.locator('button[aria-haspopup="true"]').first().click();
    await page.getByText(/view details/i).first().click();

    // Modal opens; header contains "Percentile"
    await expect(page.getByRole('columnheader', { name: /percentile/i }).or(page.getByText(/^percentile/i))).toBeVisible({ timeout: 10000 });
    // Find at least one row cell rendering a percentage like "72%"
    const percentileCell = page.locator('table').getByText(/^\d{1,3}%$/).first();
    await expect(percentileCell).toBeVisible({ timeout: 10000 });
  });
});
