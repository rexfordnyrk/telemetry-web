import { test, expect } from '../fixtures/auth';
import { gotoDeviceDetails } from '../util';

// §7.8 Phase 3d — Unassign action on Device Details (DEF-459, DEF-468).
//
// Scenario A seeded on device 00000000-0000-0000-0000-000000000502 with an
// active assignment to beneficiary "E2E Unassign Beneficiary"
// (00000000-0000-0000-0000-000000000700).
// Scenario B seeded on device 00000000-0000-0000-0000-000000000503 with no
// assignment at all.
//
// NOTE: Scenario A mutates seed state (it actually unassigns the device).
// It must run before any other spec that might depend on device 502's
// assignment still being active — no other spec in this suite touches it.
const ASSIGNED_DEVICE_ID = '00000000-0000-0000-0000-000000000502';
const UNASSIGNED_DEVICE_ID = '00000000-0000-0000-0000-000000000503';

test.describe('Phase 3d — Unassign device from Device Details (DEF-459, DEF-468)', () => {
  test('unassigns an actively-assigned device end to end', async ({ authedPage: page }) => {
    await gotoDeviceDetails(page, ASSIGNED_DEVICE_ID);

    const unassignButton = page.getByRole('button', { name: /unassign device/i });
    await expect(unassignButton).toBeVisible({ timeout: 15000 });

    await unassignButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog.getByText('E2E Unassign Beneficiary')).toBeVisible();

    // Submit button in the modal footer — variant="warning", text "Unassign Device".
    await dialog.getByRole('button', { name: 'Unassign Device' }).click();

    // Modal closes.
    await expect(dialog).toHaveCount(0, { timeout: 15000 });

    // Success toast/alert.
    await expect(page.getByText('Device Unassigned')).toBeVisible({ timeout: 10000 });

    // Header button disappears once the device-details refetch lands.
    await expect(page.getByRole('button', { name: /unassign device/i })).toHaveCount(0, { timeout: 15000 });

    // Reload confirms the server-side state: current_beneficiary is null.
    await gotoDeviceDetails(page, ASSIGNED_DEVICE_ID);
    await expect(page.getByRole('button', { name: /unassign device/i })).toHaveCount(0);
    await expect(page.getByText('No beneficiary assigned')).toBeVisible({ timeout: 10000 });
  });

  test('does not render an Unassign button for an unassigned device', async ({ authedPage: page }) => {
    await gotoDeviceDetails(page, UNASSIGNED_DEVICE_ID);
    await expect(page.getByText('No beneficiary assigned')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /unassign device/i })).toHaveCount(0);
  });
});
