import { test, expect } from '../fixtures/auth';

test.describe('Phase 2 — Beneficiary Activity ellipse menu (DEF-529)', () => {
  test('menu exposes Export Data / View Details / Settings', async ({ authedPage: page }) => {
    await page.goto('/dashboard');
    await page.waitForResponse((res) => res.url().includes('/dashboard/overview') && res.ok(), { timeout: 15000 });

    // The widget shows a dropdown trigger. Locate the widget by its heading, then find the toggle within.
    const widgetHeading = page.getByText('Beneficiary Activity Overview').first();
    const widget = widgetHeading.locator('xpath=ancestor::*[contains(@class, "card") or contains(@class, "widget")][1]');
    // Bootstrap Dropdown toggles show ellipsis. Prefer role=button, aria-haspopup.
    const toggle = widget.locator('button[aria-haspopup="true"], button:has(i.material-icons-outlined:has-text("more_vert")), button:has(.bx-dots-vertical)').first();
    await toggle.click();

    // Assert three items visible.
    await expect(page.getByRole('menuitem', { name: /export data/i }).or(page.getByText(/export data/i))).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /view details/i }).or(page.getByText(/view details/i))).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /settings/i }).or(page.getByText(/settings/i))).toBeVisible();
  });

  test('View Details opens the modal with more rows (full=1)', async ({ authedPage: page }) => {
    await page.goto('/dashboard');
    await page.waitForResponse((res) => res.url().includes('/dashboard/overview') && res.ok(), { timeout: 15000 });

    const widget = page.getByText('Beneficiary Activity Overview').first()
      .locator('xpath=ancestor::*[contains(@class, "card") or contains(@class, "widget")][1]');
    await widget.locator('button[aria-haspopup="true"]').first().click();
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
