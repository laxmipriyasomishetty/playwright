const { test, expect } = require('@playwright/test');
const { RegisterPage } = require('../pages/RegisterPage');

test.describe('Registration form', () => {
  let form;

  test.beforeEach(async ({ page }) => {
    form = new RegisterPage(page);
    await form.goto();
  });

  test('shows validation errors when submitted empty', async () => {
    await form.submit.click();
    await expect(form.error('fullname')).toHaveText('Name is required');
    await expect(form.error('email')).toHaveText('Enter a valid email');
    await expect(form.error('country')).toHaveText('Pick a country');
    await expect(form.error('terms')).toHaveText('You must accept the terms');
    await expect(form.result).toBeHidden();
  });

  test('rejects a malformed email', async () => {
    await form.email.fill('not-an-email');
    await form.submit.click();
    await expect(form.error('email')).toHaveText('Enter a valid email');
  });

  test('submits successfully with every field type filled in', async ({ page }) => {
    await form.fullName.fill('Priya Sharma');
    await form.email.fill('priya@example.com');
    await form.country.selectOption('in');
    await form.dob.fill('1995-04-12');
    await page.getByLabel('Business').check();
    await form.bio.fill('QA engineer who likes tidy test suites.');
    await form.terms.check();
    await form.submit.click();

    await expect(form.result).toHaveText('Account created for Priya Sharma (business, India)');
  });

  test('radio and checkbox state can be read back', async ({ page }) => {
    await expect(page.getByLabel('Personal')).toBeChecked();
    await page.getByLabel('Business').check();
    await expect(page.getByLabel('Personal')).not.toBeChecked();

    await expect(form.terms).not.toBeChecked();
    await form.terms.check();
    await expect(form.terms).toBeChecked();
  });

  test('select offers the expected countries', async () => {
    await expect(form.country.locator('option')).toHaveText([
      'Select a country',
      'India',
      'United States',
      'Germany',
    ]);
  });
});
