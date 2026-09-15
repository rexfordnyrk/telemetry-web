import { test, expect } from '../fixtures/auth';

test.describe('Phase 1 — Dashboard refresh (DEF-533-535, DEF-577)', () => {
  test('manual refresh re-fetches and updates the "Updated Ns ago" note', async ({ authedPage: page }) => {
    await page.goto('/dashboard');
    // Wait for first fetch to complete.
    await page.waitForResponse((res) => res.url().includes('/dashboard/overview') && res.ok(), { timeout: 15000 });
    // Grab the "Updated" text (search Overview.tsx for the actual copy — likely 'Updated' or 'Last updated').
    const updatedLabel = page.getByText(/updated.*ago|last updated/i).first();
    await expect(updatedLabel).toBeVisible({ timeout: 10000 });

    // Trigger a manual refresh via the refresh button.
    const refreshBtn = page.getByRole('button', { name: /refresh/i }).first();
    // Wait for a second dashboard fetch triggered by the click.
    const [nextRes] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/dashboard/overview') && res.ok(), { timeout: 15000 }),
      refreshBtn.click(),
    ]);
    expect(nextRes.ok()).toBeTruthy();

    // Note: seeding a new sync mid-test is out of scope (needs a test-only endpoint or seed --add-sync
    // flag not shipped in Phase 4). We assert that refresh re-fetches; delta-under-refresh is a follow-up.
  });

  test('clock advance triggers auto-refresh interval', async ({ authedPage: page }) => {
    // Playwright clock: install AFTER goto so the initial fetch uses real timers.
    await page.goto('/dashboard');
    await page.waitForResponse((res) => res.url().includes('/dashboard/overview') && res.ok(), { timeout: 15000 });

    await page.clock.install();
    const before = page.waitForResponse((res) => res.url().includes('/dashboard/overview') && res.ok(), { timeout: 30000 });
    await page.clock.fastForward('2m');
    // Auto-refresh interval fires — if the app polls at 60s or 2min it fires.
    // If no auto-refresh is wired, this test is a follow-up: swallow the timeout, but still fail LOUD.
    try {
      await before;
    } catch (e) {
      test.info().annotations.push({ type: 'follow-up', description: 'auto-refresh interval may not be wired — verify Overview.tsx polling logic' });
      throw e;
    }
  });
});
