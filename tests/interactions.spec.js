const { test, expect } = require('@playwright/test');

test.describe('Mouse and keyboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interactions.html');
  });

  test('drag and drop moves the item into the zone', async ({ page }) => {
    await page.locator('#drag-item').dragTo(page.locator('#drop-zone'));
    await expect(page.locator('#drop-zone')).toHaveText('Item dropped');
    await expect(page.locator('#drop-zone')).toHaveClass(/filled/);
  });

  test('hover reveals a menu', async ({ page }) => {
    const link = page.locator('#profile-link');
    await expect(link).toBeHidden();
    await page.locator('#menu-btn').hover();
    await expect(link).toBeVisible();
  });

  test('keyboard presses are picked up', async ({ page }) => {
    await page.locator('#key-input').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#key-result')).toHaveText('You pressed: Enter');

    await page.keyboard.press('Shift+A');
    await expect(page.locator('#key-result')).toHaveText('You pressed: A');
  });

  test('double click and right click', async ({ page }) => {
    await page.locator('#dbl-btn').dblclick();
    await expect(page.locator('#click-result')).toHaveText('Double clicked');

    await page.locator('#ctx-btn').click({ button: 'right' });
    await expect(page.locator('#click-result')).toHaveText('Right clicked');
  });
});
