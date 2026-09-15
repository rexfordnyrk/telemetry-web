import { test, expect } from '../fixtures/auth';

test.describe('Phase 2 — Preset period slug serialization', () => {
  const presets: Array<{ optionValue: string; expectedSlug: RegExp }> = [
    { optionValue: 'today',    expectedSlug: /period=today/ },
    { optionValue: 'week',     expectedSlug: /period=week/ },
    { optionValue: 'month',    expectedSlug: /period=month/ },
    { optionValue: 'year',     expectedSlug: /period=year/ },
  ];

  for (const p of presets) {
    test(`preset "${p.optionValue}" serializes to slug`, async ({ authedPage: page }) => {
      await page.goto('/dashboard');
      await page.waitForResponse((res) => res.url().includes('/dashboard/overview') && res.ok(), { timeout: 15000 });

      // Open Filters modal, pick preset, apply.
      await page.getByRole('button', { name: /filters/i }).first().click();
      await page.getByLabel(/period/i).selectOption({ value: p.optionValue });
      const applyBtn = page.getByRole('button', { name: /done|apply/i }).last();

      const [req] = await Promise.all([
        page.waitForRequest((r) => r.url().includes('/dashboard/overview'), { timeout: 15000 }),
        applyBtn.click(),
      ]);
      expect(req.url()).toMatch(p.expectedSlug);
    });
  }
});
