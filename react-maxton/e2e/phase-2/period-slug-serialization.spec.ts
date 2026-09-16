import { test, expect } from '../fixtures/auth';
import { gotoDashboard } from '../util';

test.describe('Phase 2 — Preset period slug serialization', () => {
  const presets: Array<{ optionValue: string; expectedSlug: RegExp }> = [
    { optionValue: 'today',    expectedSlug: /period=today/ },
    { optionValue: 'week',     expectedSlug: /period=week/ },
    { optionValue: 'month',    expectedSlug: /period=month/ },
    { optionValue: 'year',     expectedSlug: /period=year/ },
  ];

  for (const p of presets) {
    test(`preset "${p.optionValue}" serializes to slug`, async ({ authedPage: page }) => {
      // Collect every outgoing overview request across the whole test so a preset that
      // matches the default period (which does not force a new fetch on apply) is still
      // validated against the initial navigation request.
      const seenUrls: string[] = [];
      page.on('request', (r) => {
        if (r.url().includes('/dashboard/overview')) seenUrls.push(r.url());
      });

      await gotoDashboard(page);

      // Open Filters modal, pick preset, apply.
      await page.getByRole('button', { name: /filters/i }).first().click();
      await page.getByLabel(/period/i).selectOption({ value: p.optionValue });
      await page.getByRole('button', { name: /done|apply/i }).last().click();

      // Wait for either a new matching request or for a settle grace period.
      const deadline = Date.now() + 5000;
      while (Date.now() < deadline && !seenUrls.some((u) => p.expectedSlug.test(u))) {
        await page.waitForTimeout(200);
      }
      expect(seenUrls.some((u) => p.expectedSlug.test(u))).toBeTruthy();
    });
  }
});
