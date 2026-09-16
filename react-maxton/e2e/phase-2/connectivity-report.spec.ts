import { test, expect } from '../fixtures/auth';
import { gotoAndWait } from '../util';

test.describe('Phase 2 — Connectivity report (DEF-544)', () => {
  test('renders seeded rows and exports CSV', async ({ authedPage: page }) => {
    await gotoAndWait(page, '/reports/connectivity', (res) => res.url().includes('/analytics/connectivity') || res.url().includes('/reports/connectivity'));

    // Table renders — at least 3 rows for seeded active beneficiaries.
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Export CSV
    const exportBtn = page.getByRole('button', { name: /export csv/i }).first();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      exportBtn.click(),
    ]);
    // Frontend calls downloadCsv which produces a generic export.csv; accept any csv filename.
    expect(download.suggestedFilename()).toMatch(/\.csv$/i);
    // Read the saved file and check the header line.
    const path = await download.path();
    if (path) {
      const fs = await import('node:fs');
      const first = fs.readFileSync(path, 'utf8').split('\n')[0];
      expect(first).toMatch(/beneficiary|device|programme|last/i);
    }
  });
});
