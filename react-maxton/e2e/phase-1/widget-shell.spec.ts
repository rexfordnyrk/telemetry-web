import { test, expect } from '../fixtures/auth';
import { gotoDashboard } from '../util';

test.describe('Phase 1 — Widget shell empty & error states', () => {
  test('error state with retry when API fails', async ({ authedPage: page }) => {
    await page.route('**/dashboard/overview**', (r) => r.abort());
    try {
      await gotoDashboard(page);
    } catch {
      // Expected to fail since we aborted the route
    }
    // WidgetShell renders an error state with a Retry button.
    const retry = page.getByRole('button', { name: /retry/i }).first();
    await expect(retry).toBeVisible({ timeout: 15000 });
    // Unblock the route and click Retry.
    await page.unroute('**/dashboard/overview**');
    await Promise.all([
      page.waitForResponse((res) => res.url().includes('/dashboard/overview') && res.ok(), { timeout: 15000 }),
      retry.click(),
    ]);
  });

  test('empty state renders when a filter yields no data', async ({ authedPage: page }) => {
    // Choose an obviously-empty filter combo. Simplest path: pick a date range 5 years ago.
    // Loose test: mock the overview response to be empty and confirm empty copy renders.
    await page.route('**/dashboard/overview**', async (r) => {
      const json = { data: { widgets: {} } };
      await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(json) });
    });
    await gotoDashboard(page);
    // At least the beneficiary activity widget shows an empty message.
    // Copy may be "No beneficiary activity" / "No data" — use permissive match.
    await expect(page.getByText(/no.*beneficiary|no data|no activity/i).first()).toBeVisible({ timeout: 15000 });
  });
});
