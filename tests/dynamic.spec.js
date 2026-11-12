const { test, expect } = require('@playwright/test');

test.describe('Dynamic content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dynamic.html');
  });

  test('loader appears and then the data is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'Load data' }).click();
    await expect(page.locator('#loader')).toBeVisible();
    await expect(page.locator('#loaded-text')).toHaveText('Data loaded', { timeout: 5000 });
    await expect(page.locator('#loader')).toBeHidden();
  });

  test('element added after a delay can be used once it appears', async ({ page }) => {
    await page.getByRole('button', { name: 'Reveal hidden field' }).click();
    const field = page.locator('#revealed-input');
    await field.fill('hello');
    await expect(field).toHaveValue('hello');
  });

  test('waits for a specific network response', async ({ page }) => {
    const responsePromise = page.waitForResponse('**/api/slow');
    await page.getByRole('button', { name: 'Load data' }).click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  test('mocked response replaces the real one', async ({ page }) => {
    await page.route('**/api/slow', (route) =>
      route.fulfill({ json: { message: 'Mocked data' } })
    );
    await page.getByRole('button', { name: 'Load data' }).click();
    await expect(page.locator('#loaded-text')).toHaveText('Mocked data');
  });
});
