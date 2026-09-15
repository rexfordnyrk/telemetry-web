import { test, expect } from '../fixtures/auth';

test.describe('Phase 3 — Compare-to-previous toggle', () => {
  test('toggling on appends compare=previous to overview fetch', async ({ authedPage: page }) => {
    await page.goto('/dashboard');
    await page.waitForResponse((res) => res.url().includes('/dashboard/overview') && res.ok(), { timeout: 15000 });
    const toggle = page.getByLabel(/compare.*previous/i).first();
    const [req] = await Promise.all([
      page.waitForRequest((r) => r.url().includes('/dashboard/overview') && r.url().includes('compare=previous'), { timeout: 15000 }),
      toggle.click(),
    ]);
    expect(req.url()).toContain('compare=previous');
  });
});
