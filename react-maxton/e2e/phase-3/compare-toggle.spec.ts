import { test, expect } from '../fixtures/auth';
import { gotoDashboard } from '../util';

test.describe('Phase 3 — Compare-to-previous toggle', () => {
  test('toggling on appends compare=previous to overview fetch', async ({ authedPage: page }) => {
    await gotoDashboard(page);
    const toggle = page.getByLabel(/compare.*previous/i).first();
    const [req] = await Promise.all([
      page.waitForRequest((r) => r.url().includes('/dashboard/overview') && r.url().includes('compare=previous'), { timeout: 15000 }),
      toggle.click(),
    ]);
    expect(req.url()).toContain('compare=previous');
  });
});
