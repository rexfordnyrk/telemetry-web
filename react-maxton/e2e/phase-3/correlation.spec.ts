import { test, expect } from '../fixtures/auth';

test.describe('Phase 3 — Correlation', () => {
  test('scatter chart renders with Pearson coefficient', async ({ authedPage: page }) => {
    await page.goto('/reports/correlation');
    await page.getByLabel(/metric a/i).selectOption('data_usage');
    await page.getByLabel(/metric b/i).selectOption('avg_screen_time');
    await page.waitForResponse((res) => res.url().includes('/analytics/correlate'), { timeout: 15000 });
    // Card header shows Pearson r
    await expect(page.getByText(/pearson r/i)).toBeVisible({ timeout: 15000 });
    // Chart mount
    await expect(page.locator('.apexcharts-canvas').first().or(page.locator('[data-testid="chart"]'))).toBeVisible({ timeout: 15000 });
  });
});
