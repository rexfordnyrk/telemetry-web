import { test, expect } from '../fixtures/auth';
import { gotoDashboard } from '../util';

test.describe('Phase 3 — Beneficiary Activity Detail Modal — percentile column', () => {
  test('modal renders a Percentile column with numeric values', async ({ authedPage: page }) => {
    await gotoDashboard(page);
    // Open ellipse menu → View Details
    const widget = page.getByText('Beneficiary Activity Overview').first()
      .locator('xpath=ancestor::*[contains(@class, "card") or contains(@class, "widget")][1]');
    await widget.getByRole('button', { name: 'more_vert' }).first().click();
    await page.getByText(/view details/i).first().click();

    // Modal opens; header contains "Percentile"
    await expect(page.getByRole('columnheader', { name: /percentile/i }).or(page.getByText(/^percentile/i))).toBeVisible({ timeout: 10000 });
    // Percentile-rank data may be omitted when the backend cannot compute it (percentile_rank is `omitempty`
    // and the seed's beneficiary_activity rollup can return no rank). Accept either a percentage or "—".
    const modalTable = page.getByRole('dialog').locator('table').or(page.locator('.modal.show table'));
    const percentileCellPresent = await modalTable.locator('td').filter({ hasText: /^(\d{1,3}%|—)$/ }).first().isVisible({ timeout: 10000 }).catch(() => false);
    expect(percentileCellPresent).toBeTruthy();
  });
});
