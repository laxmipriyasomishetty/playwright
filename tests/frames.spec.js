const { test, expect } = require('@playwright/test');

test('form inside an iframe can be filled and submitted', async ({ page }) => {
  await page.goto('/frames.html');

  const frame = page.frameLocator('#newsletter-frame');
  await frame.getByLabel('Newsletter email').fill('reader@example.com');
  await frame.getByRole('button', { name: 'Subscribe' }).click();

  await expect(frame.locator('#newsletter-msg')).toHaveText('Subscribed: reader@example.com');
});
