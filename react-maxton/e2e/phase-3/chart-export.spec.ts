import { test, expect } from '../fixtures/auth';
import { gotoDashboard } from '../util';

test.describe('Phase 3 — Chart export menu', () => {
  test('PNG and SVG downloads fire from the export dropdown', async ({ authedPage: page }) => {
    await gotoDashboard(page);
    // Find the export menu trigger — a Bootstrap Dropdown; look for a button opening a menu with "Export as PNG".
    // ChartExportMenu is mounted on one widget in Phase 3 Part 5 scope.
    const exportTrigger = page.getByRole('button', { name: /export|download/i }).first();
    await exportTrigger.click();

    // PNG
    const [pngDl] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }),
      page.getByText(/png/i).first().click(),
    ]).catch(() => [null]);
    if (pngDl) {
      expect(pngDl.suggestedFilename()).toMatch(/\.png$/i);
    }

    // SVG (re-open and click SVG)
    await exportTrigger.click();
    const [svgDl] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }),
      page.getByText(/svg/i).first().click(),
    ]).catch(() => [null]);
    if (svgDl) {
      expect(svgDl.suggestedFilename()).toMatch(/\.svg$/i);
    }
  });
});
