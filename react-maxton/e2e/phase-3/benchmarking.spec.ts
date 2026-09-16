import { test, expect } from '../fixtures/auth';
import { gotoAndWait } from '../util';

test.describe('Phase 3 — Benchmarking', () => {
  test('bar chart with reference line for a metric', async ({ authedPage: page }) => {
    await gotoAndWait(page, '/reports/benchmarking', (res) => res.url().includes('/analytics/benchmark'));
    // Switching to a different metric than the default forces a new fetch.
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/analytics/benchmark'), { timeout: 15000 }),
      page.getByLabel(/metric/i).first().selectOption('data_usage'),
    ]);
    expect(res.ok()).toBeTruthy();
    // Card header shows all-programmes-avg
    await expect(page.getByText(/all-programmes avg/i)).toBeVisible({ timeout: 15000 });
    // Either the bar chart mounted or the empty-state banner rendered.
    const chartOrEmpty = page
      .locator('.apexcharts-canvas')
      .first()
      .or(page.getByText(/no programme data|no data/i));
    await expect(chartOrEmpty).toBeVisible({ timeout: 15000 });
  });
});
