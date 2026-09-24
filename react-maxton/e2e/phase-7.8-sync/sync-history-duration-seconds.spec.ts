import { test, expect } from '../fixtures/auth';
import { gotoDeviceDetails } from '../util';

// §7.8 Phase 3c (consuming Phase 3b's backend formatter) — session duration
// precision (DEF-488-494).
//
// Seeded by backend/internal/seed/e2e.go on device
// 00000000-0000-0000-0000-000000000501 with exactly 3 screen_sessions of
// 30s / 90s / 3700s. Backend's FormatSessionDurationWithSeconds renders
// these as "30s", "01:30", "01:01:40" respectively in the
// screen_sessions[].session_duration.formatted field, which the Usage tab's
// "Screen Sessions" table renders verbatim in its Duration column.
const DEVICE_ID = '00000000-0000-0000-0000-000000000501';

test.describe('Phase 3c/3b — Screen session duration seconds precision (DEF-488-494)', () => {
  test('renders 30s, 01:30 and 01:01:40 for the seeded durations', async ({ authedPage: page }) => {
    await gotoDeviceDetails(page, DEVICE_ID);

    // Switch to the Usage tab, which holds the Screen Sessions table.
    await page.getByText('Usage', { exact: true }).click();

    const table = page.locator('#screen-sessions-datatable');
    await expect(table).toBeVisible();
    await expect(table.locator('tbody tr')).toHaveCount(3, { timeout: 15000 });

    await expect(table.getByText('30s', { exact: true })).toBeVisible();
    await expect(table.getByText('01:30', { exact: true })).toBeVisible();
    await expect(table.getByText('01:01:40', { exact: true })).toBeVisible();
  });
});
