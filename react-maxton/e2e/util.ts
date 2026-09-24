import type { Page, Response } from '@playwright/test';

/**
 * Navigate to `url` and wait for the first response matching `pred` to arrive.
 * Arms the response wait BEFORE goto so responses that land during navigation
 * are still caught. Falls back to `networkidle` if the response never comes.
 */
export async function gotoAndWait(
  page: Page,
  url: string,
  pred: (res: Response) => boolean,
  timeout = 20000,
): Promise<Response | null> {
  try {
    const [res] = await Promise.all([
      page.waitForResponse((r) => pred(r), { timeout }),
      page.goto(url),
    ]);
    return res;
  } catch {
    try {
      await page.waitForLoadState('networkidle', { timeout: 5000 });
    } catch { /* ignore */ }
    return null;
  }
}

/** Overview-page helper. */
export function gotoDashboard(page: Page) {
  return gotoAndWait(
    page,
    '/dashboard',
    (r) => r.url().includes('/analytics/dashboard/overview') && r.ok(),
  );
}

/** Device Details page helper (§7.8 phase-7.8-sync). */
export function gotoDeviceDetails(page: Page, deviceId: string) {
  return gotoAndWait(
    page,
    `/device-management/devices/${deviceId}`,
    (r) => r.url().includes(`/devices/${deviceId}/device-details`) && r.ok(),
  );
}
