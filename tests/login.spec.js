const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('valid credentials open the secure area', async ({ page }) => {
    await loginPage.login('tester', 'secret123');
    await expect(page).toHaveURL(/secure\.html/);
    await expect(page.locator('#welcome')).toHaveText('Welcome, tester!');
  });

  test('wrong password shows an error and stays on the page', async ({ page }) => {
    await loginPage.login('tester', 'nope');
    await expect(loginPage.error).toHaveText('Invalid username or password');
    await expect(page).toHaveURL(/login\.html/);
  });

  test('logging out returns to the login page', async ({ page }) => {
    await loginPage.login('tester', 'secret123');
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page).toHaveURL(/login\.html/);
  });

  test('secure page redirects when not logged in', async ({ page }) => {
    await page.goto('/secure.html');
    await expect(page).toHaveURL(/login\.html/);
  });
});
