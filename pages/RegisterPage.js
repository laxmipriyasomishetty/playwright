class RegisterPage {
  constructor(page) {
    this.page = page;
    this.fullName = page.getByLabel('Full name');
    this.email = page.getByLabel('Email');
    this.country = page.getByLabel('Country');
    this.dob = page.getByLabel('Date of birth');
    this.bio = page.getByLabel('About you');
    this.terms = page.getByLabel('I accept the terms');
    this.submit = page.getByRole('button', { name: 'Create account' });
    this.result = page.locator('#register-result');
  }

  async goto() {
    await this.page.goto('/register.html');
  }

  error(field) {
    return this.page.locator(`[data-error="${field}"]`);
  }
}

module.exports = { RegisterPage };
