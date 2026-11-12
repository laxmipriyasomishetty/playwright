const { test, expect } = require('@playwright/test');

test.describe('Orders table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/table.html');
  });

  test('has the expected number of rows', async ({ page }) => {
    await expect(page.locator('#orders tbody tr')).toHaveCount(4);
  });

  test('filter narrows the visible rows', async ({ page }) => {
    await page.getByPlaceholder('Filter by customer').fill('ar');
    const visible = page.locator('#orders tbody tr:visible');
    await expect(visible).toHaveCount(2);
    await expect(visible.first().locator('td').first()).toHaveText('Arjun');
  });

  test('clicking the Amount header sorts numerically', async ({ page }) => {
    const amounts = page.locator('#orders tbody tr td:nth-child(3)');

    await page.getByRole('columnheader', { name: 'Amount' }).click();
    await expect(amounts).toHaveText(['45', '90', '220', '500']);

    await page.getByRole('columnheader', { name: 'Amount' }).click();
    await expect(amounts).toHaveText(['500', '220', '90', '45']);
  });

  test('can find a row by its content', async ({ page }) => {
    const row = page.getByRole('row', { name: /Zoya/ });
    await expect(row).toContainText('Backpack');
    await expect(row).toContainText('500');
  });
});
