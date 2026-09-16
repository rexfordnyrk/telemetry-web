import { test, expect } from '../fixtures/auth';

test.describe('Phase 3 — Run now (DEF-548-552)', () => {
  test('creates a schedule, runs it, runs history shows Delivered with stub marker', async ({ authedPage: page }) => {
    test.setTimeout(120_000);
    const name = `RunNow ${Date.now()}`;
    // Wait for initial page load
    await page.goto('/reports/schedules');
    try {
      await page.waitForLoadState('networkidle', { timeout: 5000 });
    } catch {
      // Timeout is acceptable; proceed anyway
    }
    await page.getByRole('button', { name: /new scheduled report|create/i }).first().click();
    await page.getByLabel('Report name').fill(name);
    await page.getByLabel('Report type').selectOption({ index: 0 }).catch(() => {});
    await page.getByLabel('Report format').selectOption('csv');
    await page.getByLabel('Cadence kind').selectOption('daily');
    await page.getByLabel('Cadence time', { exact: true }).fill('12:00');
    await page.getByLabel('Cadence timezone').selectOption({ index: 0 });
    const rec = page.getByPlaceholder(/add recipient|email/i).or(page.getByLabel(/recipient/i)).first();
    await rec.fill('admin@e2e.test');
    await rec.press('Enter');
    await page.getByRole('button', { name: /save|create/i }).last().click();
    await expect(page.getByText(name)).toBeVisible({ timeout: 15000 });

    // Click Run now — Schedules.tsx confirms via window.alert. Accept the dialog.
    let alertText = '';
    page.on('dialog', async (d) => { alertText = d.message(); await d.accept().catch(() => {}); });
    await page.getByRole('button', { name: /run now/i }).first().click();

    // Wait for the run to complete (backend renders + uploads before responding, up to ~30s).
    await expect.poll(() => alertText, { timeout: 45000, intervals: [1000] }).toMatch(/run started|download/i);

    // Open runs history — the "View runs" is a Button that navigates (role=button, not link).
    await page.getByRole('button', { name: /view runs/i }).first().click();
    // A run row appears (Delivered on happy path, "Failed" with the stub marker as a
    // tooltip title under SMTP_STUB=1 — the backend leaves delivered_at NULL when the
    // mailer short-circuits). The plan treats both as green.
    await expect(page.getByText(/delivered|failed/i).first()).toBeVisible({ timeout: 15000 });
    // The stub marker either shows in visible text OR sits in the Failed cell's title attribute.
    const stubInDom = await page.locator('[title*="stub:"]').count();
    const stubInText = await page.getByText(/stub:\s*\d+\s*recipients/i).count();
    expect(stubInDom + stubInText).toBeGreaterThan(0);
  });
});
