import { test, expect } from '../fixtures/auth';

test.describe('Phase 3 — Forecast toggle', () => {
  test('toggling on fires /analytics/forecast with horizonDays=14', async ({ authedPage: page }) => {
    await page.goto('/dashboard');
    await page.waitForResponse((res) => res.url().includes('/dashboard/overview') && res.ok(), { timeout: 15000 });
    const toggle = page.getByLabel(/forecast/i).first();
    const [req] = await Promise.all([
      page.waitForRequest((r) => r.url().includes('/analytics/forecast') && r.url().includes('horizonDays=14'), { timeout: 15000 }),
      toggle.click(),
    ]);
    expect(req.url()).toMatch(/metric=avg_screen_time/);
  });
});
