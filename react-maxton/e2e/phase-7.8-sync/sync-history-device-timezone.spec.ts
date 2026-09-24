import { test, expect } from '../fixtures/auth';
import { gotoDeviceDetails } from '../util';

// §7.8 Phase 4 — device-local sync-history timestamps (DEF-466).
//
// Scenario A seeded on device 00000000-0000-0000-0000-000000000504 with
// device_timezone = "Asia/Kolkata" (UTC+5:30) and one sync_log at exactly
// 2026-09-24T14:00:00Z → renders as 19:30 local device time.
// Scenario B seeded on device 00000000-0000-0000-0000-000000000505 with
// device_timezone = NULL, same UTC timestamp → falls back to UTC rendering.
const KOLKATA_DEVICE_ID = '00000000-0000-0000-0000-000000000504';
const NULL_TZ_DEVICE_ID = '00000000-0000-0000-0000-000000000505';

test.describe('Phase 4 — Sync history renders device-local timezone (DEF-466)', () => {
  test('renders 19:30 with an Asia/Kolkata tooltip for a device with a known timezone', async ({
    authedPage: page,
  }) => {
    await gotoDeviceDetails(page, KOLKATA_DEVICE_ID);
    await page.getByText('Device History', { exact: true }).click();

    const table = page.locator('#sync-history-datatable');
    await expect(table).toBeVisible();

    const dateCell = table.locator('tbody tr').first().locator('span[title]');
    await expect(dateCell).toBeVisible({ timeout: 15000 });
    await expect(dateCell).toContainText('19:30');

    const title = await dateCell.getAttribute('title');
    expect(title).toContain('Device time (Asia/Kolkata)');
  });

  test('falls back to UTC with a UTC tooltip when device_timezone is null', async ({ authedPage: page }) => {
    await gotoDeviceDetails(page, NULL_TZ_DEVICE_ID);
    await page.getByText('Device History', { exact: true }).click();

    const table = page.locator('#sync-history-datatable');
    await expect(table).toBeVisible();

    const dateCell = table.locator('tbody tr').first().locator('span[title]');
    await expect(dateCell).toBeVisible({ timeout: 15000 });
    await expect(dateCell).toContainText('14:00');

    const title = await dateCell.getAttribute('title');
    expect(title).toContain('Device time (UTC)');
  });
});
