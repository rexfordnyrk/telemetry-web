import { test, expect } from '../fixtures/auth';
import { gotoDeviceDetails } from '../util';

// §7.8 Phase 3c — sync-history error/warning expansion (DEF-005 cross-cut).
//
// Seeded by backend/internal/seed/e2e.go (seedE2EPhase78SyncFixtures) on
// device 00000000-0000-0000-0000-000000000500 with exactly 3 sync_logs:
//   - sync_type "e2e_success" — no error_message, no warning_message
//   - sync_type "e2e_failed"  — error_message set
//   - sync_type "e2e_warning" — warning_message set
// DeviceDetails.tsx renders sync_type via a single String.replace("_", " ")
// + toUpperCase(), so these badges read "E2E SUCCESS" / "E2E FAILED" /
// "E2E WARNING" — used here to find each row without depending on
// created_at ordering.
const DEVICE_ID = '00000000-0000-0000-0000-000000000500';

test.describe('Phase 3c — Sync history error/warning details (DEF-005)', () => {
  test('shows details only for rows with error or warning, and expands/collapses correctly', async ({
    authedPage: page,
  }) => {
    await gotoDeviceDetails(page, DEVICE_ID);

    // Switch to the Device History tab.
    await page.getByText('Device History', { exact: true }).click();

    const table = page.locator('#sync-history-datatable');
    await expect(table).toBeVisible();

    // Exactly 2 rows (failed + warning) show the "Show details" toggle.
    const showDetailsButtons = table.getByRole('button', { name: 'Show details' });
    await expect(showDetailsButtons).toHaveCount(2, { timeout: 15000 });

    // The success row (no error/warning) shows the em-dash placeholder instead.
    const successRow = table.locator('tbody tr', { hasText: 'E2E SUCCESS' });
    await expect(successRow).toBeVisible();
    await expect(successRow.getByRole('button', { name: /show details/i })).toHaveCount(0);
    await expect(successRow.getByText('—', { exact: true })).toBeVisible();

    // Failed row: click to expand → error text + "Error" label appear.
    const failedRow = table.locator('tbody tr', { hasText: 'E2E FAILED' });
    const failedToggle = failedRow.getByRole('button', { name: 'Show details' });
    await failedToggle.click();

    await expect(page.getByText('e2e seed: connection reset by peer')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Error', { exact: true })).toBeVisible();
    await expect(page.getByText('Warning', { exact: true })).toHaveCount(0);

    // Click again → collapses.
    const failedToggleAfterExpand = failedRow.getByRole('button', { name: 'Hide details' });
    await failedToggleAfterExpand.click();
    await expect(page.getByText('e2e seed: connection reset by peer')).toHaveCount(0, { timeout: 10000 });

    // Warning row: click to expand → warning text + "Warning" label (not "Error").
    const warningRow = table.locator('tbody tr', { hasText: 'E2E WARNING' });
    const warningToggle = warningRow.getByRole('button', { name: 'Show details' });
    await warningToggle.click();

    await expect(page.getByText('e2e seed: all records were duplicates')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Warning', { exact: true })).toBeVisible();
    await expect(page.getByText('Error', { exact: true })).toHaveCount(0);
  });
});
