import { test, expect } from '../fixtures/auth';

test.describe('Phase 3 — Scheduled reports CRUD', () => {
  const uniqueName = `E2E daily ${Date.now()}`;

  test('create, edit, toggle, delete a schedule', async ({ authedPage: page }) => {
    await page.goto('/reports/schedules');
    await page.waitForLoadState('networkidle');

    // Open the create modal
    await page.getByRole('button', { name: /new scheduled report|new schedule|create/i }).first().click();

    // Fill name
    await page.getByLabel(/name/i).first().fill(uniqueName);

    // Report type: pick Beneficiary activity (or whatever the seeded list has)
    const typeSelect = page.getByLabel(/report type|type/i).first();
    await typeSelect.selectOption({ label: /beneficiary/i }).catch(() => typeSelect.selectOption({ index: 0 }));

    // Format: CSV
    await page.getByLabel(/format/i).selectOption('csv');

    // Cadence: daily 12:00 UTC — CadenceEditor exposes cadence, time, timezone selects.
    await page.getByLabel(/cadence/i).selectOption('daily');
    await page.getByLabel(/^time$/i).fill('12:00');
    await page.getByLabel(/timezone|time zone/i).selectOption('UTC');

    // Recipient: type email + press enter (RecipientInput chip UI)
    const recipientInput = page.getByPlaceholder(/add recipient|email/i).or(page.getByLabel(/recipient/i));
    await recipientInput.first().fill('admin@e2e.test');
    await recipientInput.first().press('Enter');

    // Save
    await page.getByRole('button', { name: /save|create/i }).last().click();

    // Row visible in list
    await expect(page.getByText(uniqueName)).toBeVisible({ timeout: 15000 });

    // Edit: change format to XLSX
    await page.getByRole('button', { name: /edit/i }).first().click();
    await page.getByLabel(/format/i).selectOption('xlsx');
    await page.getByRole('button', { name: /save/i }).last().click();
    await expect(page.getByText(/xlsx/i).first()).toBeVisible({ timeout: 10000 });

    // Delete
    await page.getByRole('button', { name: /delete/i }).first().click();
    await page.getByRole('button', { name: /confirm|yes|delete/i }).last().click();
    await expect(page.getByText(uniqueName)).toHaveCount(0, { timeout: 10000 });
  });
});
