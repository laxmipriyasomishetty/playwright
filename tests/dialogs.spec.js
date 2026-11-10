const { test, expect } = require('@playwright/test');

test.describe('JavaScript dialogs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dialogs.html');
  });

  test('alert can be read and accepted', async ({ page }) => {
    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Hello from the alert');
      await dialog.accept();
    });

    await page.locator('#alert-btn').click();
    await expect(page.locator('#dialog-result')).toHaveText('Alert closed');
  });

  test('confirm can be accepted', async ({ page }) => {
    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#confirm-btn').click();
    await expect(page.locator('#dialog-result')).toHaveText('Confirmed');
  });

  test('confirm can be dismissed', async ({ page }) => {
    page.once('dialog', (dialog) => dialog.dismiss());
    await page.locator('#confirm-btn').click();
    await expect(page.locator('#dialog-result')).toHaveText('Cancelled');
  });

  test('prompt accepts typed text', async ({ page }) => {
    page.once('dialog', (dialog) => dialog.accept('Ravi'));
    await page.locator('#prompt-btn').click();
    await expect(page.locator('#dialog-result')).toHaveText('Hello, Ravi');
  });
});
