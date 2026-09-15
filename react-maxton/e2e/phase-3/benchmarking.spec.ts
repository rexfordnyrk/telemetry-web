import { test, expect } from '../fixtures/auth';

test.describe('Phase 3 — Benchmarking', () => {
  test('bar chart with reference line for a metric', async ({ authedPage: page }) => {
    await page.goto('/reports/benchmarking');
    await page.getByLabel(/metric/i).first().selectOption('sync_count');
    await page.waitForResponse((res) => res.url().includes('/analytics/benchmark'), { timeout: 15000 });
    // Card header shows all-programmes-avg
    await expect(page.getByText(/all-programmes avg/i)).toBeVisible({ timeout: 15000 });
    // Chart mounted
    await expect(page.locator('.apexcharts-canvas').first().or(page.locator('[data-testid="chart"]'))).toBeVisible({ timeout: 15000 });
  });
});
