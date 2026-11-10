const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test('home page has the right title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Practice Site');
  });

  test('header links move between pages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL(/register\.html/);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
  });

  test('unknown page returns 404', async ({ page }) => {
    const response = await page.goto('/does-not-exist.html');
    expect(response.status()).toBe(404);
  });
});
