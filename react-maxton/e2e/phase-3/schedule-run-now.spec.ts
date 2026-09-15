import { test, expect } from '../fixtures/auth';

test.describe('Phase 3 — Run now (DEF-548-552)', () => {
  test('creates a schedule, runs it, runs history shows Delivered with stub marker', async ({ authedPage: page }) => {
    const name = `RunNow ${Date.now()}`;
    await page.goto('/reports/schedules');
    await page.getByRole('button', { name: /new scheduled report|create/i }).first().click();
    await page.getByLabel(/name/i).first().fill(name);
    await page.getByLabel(/report type|type/i).first().selectOption({ index: 0 }).catch(() => {});
    await page.getByLabel(/format/i).selectOption('csv');
    await page.getByLabel(/cadence/i).selectOption('daily');
    await page.getByLabel(/^time$/i).fill('12:00');
    await page.getByLabel(/timezone|time zone/i).selectOption('UTC');
    const rec = page.getByPlaceholder(/add recipient|email/i).or(page.getByLabel(/recipient/i)).first();
    await rec.fill('admin@e2e.test');
    await rec.press('Enter');
    await page.getByRole('button', { name: /save|create/i }).last().click();
    await expect(page.getByText(name)).toBeVisible({ timeout: 15000 });

    // Click Run now on the row
    await page.getByRole('button', { name: /run now/i }).first().click();
    // Toast confirms
    await expect(page.getByText(/queued|running|success/i).first()).toBeVisible({ timeout: 10000 });

    // Open runs history — click the runs link on the row or navigate to /reports/schedules/:id/runs (need id)
    await page.getByRole('link', { name: /runs|history/i }).first().click();
    // Row with Delivered status + stub marker
    await expect(page.getByText(/delivered|success/i).first()).toBeVisible({ timeout: 15000 });
    // Under SMTP_STUB=1 backend, delivery_error is "stub: N recipients"
    await expect(page.getByText(/stub:\s*\d+\s*recipients/i).first()).toBeVisible({ timeout: 15000 });
  });
});
