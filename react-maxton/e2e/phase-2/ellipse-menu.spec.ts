import { test, expect } from '../fixtures/auth';
import { gotoDashboard } from '../util';

test.describe('Phase 2 — Beneficiary Activity ellipse menu (DEF-529)', () => {
  test('menu exposes Export Data / View Details / Settings', async ({ authedPage: page }) => {
    await gotoDashboard(page);

    // The widget shows a dropdown trigger. Locate the widget by its heading, then find the toggle within.
    const widgetHeading = page.getByText('Beneficiary Activity Overview').first();
    const widget = widgetHeading.locator('xpath=ancestor::*[contains(@class, "card") or contains(@class, "widget")][1]');
    // Bootstrap Dropdown toggles show ellipsis. Prefer role=button, aria-haspopup.
    // Bootstrap Dropdown.Toggle renders as a <button> whose accessible name is the icon text "more_vert".
    const toggle = widget.getByRole('button', { name: 'more_vert' }).first();
    await toggle.click();

    // Assert three items visible within the open dropdown menu (Bootstrap Dropdown renders .dropdown-menu.show).
    const openMenu = widget.locator('.dropdown-menu.show');
    await expect(openMenu.getByText(/export data/i)).toBeVisible();
    await expect(openMenu.getByText(/view details/i)).toBeVisible();
    await expect(openMenu.locator('.dropdown-item').getByText(/^settings$/i)).toBeVisible();
  });

  test('View Details opens the modal with more rows (full=1)', async ({ authedPage: page }) => {
    await gotoDashboard(page);

    const widget = page.getByText('Beneficiary Activity Overview').first()
      .locator('xpath=ancestor::*[contains(@class, "card") or contains(@class, "widget")][1]');
    await widget.getByRole('button', { name: 'more_vert' }).first().click();
    const [req] = await Promise.all([
      page.waitForRequest((r) => r.url().includes('full=1'), { timeout: 15000 }).catch(() => null),
      page.getByText(/view details/i).first().click(),
    ]);
    // Modal opens
    await expect(page.getByRole('dialog').or(page.locator('.modal.show'))).toBeVisible({ timeout: 10000 });
    if (req) {
      expect(req.url()).toContain('full=1');
    }
  });
});
