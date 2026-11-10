const { test, expect } = require('@playwright/test');

test.describe('Multiple windows', () => {
  test('link with target=_blank opens a new tab', async ({ page, context }) => {
    await page.goto('/windows.html');

    const [newTab] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('#new-tab-link').click(),
    ]);

    await newTab.waitForLoadState();
    await expect(newTab).toHaveURL(/child\.html$/);
    await expect(newTab.locator('#child-text')).toContainText('separate window');

    await newTab.close();
    await expect(page.getByRole('heading', { name: 'Windows and Tabs' })).toBeVisible();
  });

  test('window.open creates a popup', async ({ page }) => {
    await page.goto('/windows.html');

    const popupPromise = page.waitForEvent('popup');
    await page.locator('#popup-button').click();
    const popup = await popupPromise;

    await popup.waitForLoadState();
    await expect(popup.locator('#child-text')).toContainText('Source: popup');
  });

  test('two tabs in one context share nothing on the page but can be switched', async ({ context }) => {
    const first = await context.newPage();
    const second = await context.newPage();

    await first.goto('/login.html');
    await second.goto('/register.html');

    expect(context.pages()).toHaveLength(2);
    await expect(first.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(second.getByRole('heading', { name: 'Register' })).toBeVisible();
  });

  test('separate contexts do not share session data', async ({ browser }) => {
    const userA = await browser.newContext();
    const userB = await browser.newContext();
    const pageA = await userA.newPage();
    const pageB = await userB.newPage();

    await pageA.goto('/login.html');
    await pageA.getByLabel('Username').fill('tester');
    await pageA.getByLabel('Password').fill('secret123');
    await pageA.getByRole('button', { name: 'Sign in' }).click();
    await expect(pageA).toHaveURL(/secure\.html/);

    await pageB.goto('/secure.html');
    await expect(pageB).toHaveURL(/login\.html/);

    await userA.close();
    await userB.close();
  });
});
