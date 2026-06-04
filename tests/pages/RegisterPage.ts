/**
 * Register Page Object Model
 * 
 * Page Object for /register
 * Based on actual register page implementation with data-testid attributes
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {

  // Form elements - using actual data-testid attributes
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordConfirmationInput: Locator;
  readonly submitButton: Locator;

  // Links
  readonly loginLink: Locator;

  // Messages
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly fieldErrorName: Locator;
  readonly fieldErrorEmail: Locator;
  readonly fieldErrorPassword: Locator;
  readonly fieldErrorPasswordConfirmation: Locator;

  constructor(page: Page) {
    super(page);

    // Form elements
    this.nameInput = page.locator('input#name');
    this.emailInput = page.locator('input#email');
    this.passwordInput = page.locator('input#password');
    this.passwordConfirmationInput = page.locator('input#password_confirmation');
    this.submitButton = page.locator('button[type="submit"]');

    // Links
    this.loginLink = page.locator('a[href*="login"]');

    // Messages
    this.errorMessage = page.locator('[role="alert"], .text-red-600');
    this.successMessage = page.locator('.text-green-600');
    
    // Field-specific errors
    this.fieldErrorName = page.locator('input#name ~ span.text-xs');
    this.fieldErrorEmail = page.locator('input#email ~ span.text-xs');
    this.fieldErrorPassword = page.locator('input#password ~ span.text-xs');
    this.fieldErrorPasswordConfirmation = page.locator('input#password_confirmation ~ span.text-xs');
  }

  /**
   * Navigate to register page
   */
  async goto() {
    await this.page.goto('/register');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill registration form
   */
  async fillRegistrationForm(data: {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.passwordConfirmationInput.fill(data.passwordConfirmation);
  }

  /**
   * Submit registration form
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Register with credentials (fill + submit)
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }) {
    await this.fillRegistrationForm(data);
    await this.submit();
  }

  /**
   * Wait for successful registration (redirect to login)
   */
  async waitForSuccess() {
    await this.page.waitForURL(/\/login/, { timeout: 10000 });
  }

  /**
   * Wait for error message to appear
   */
  async waitForError() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get error message text
   */
  async getErrorText(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Check if form is in loading state
   */
  async isLoading(): Promise<boolean> {
    return await this.submitButton.isDisabled();
  }

  /**
   * Assert page is displayed correctly
   */
  async assertPageLoaded() {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordConfirmationInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
    await expect(this.loginLink).toBeVisible();
  }

  /**
   * Assert error message is shown
   */
  async assertErrorShown(expectedText?: string | RegExp) {
    await expect(this.errorMessage).toBeVisible();

    if (expectedText) {
      if (typeof expectedText === 'string') {
        await expect(this.errorMessage).toContainText(expectedText);
      } else {
        const text = await this.getErrorText();
        expect(text).toMatch(expectedText);
      }
    }
  }

  /**
   * Assert field validation error is shown
   */
  async assertFieldError(field: 'name' | 'email' | 'password' | 'passwordConfirmation', expectedText?: string | RegExp) {
    let fieldError: Locator;
    
    switch (field) {
      case 'name':
        fieldError = this.fieldErrorName;
        break;
      case 'email':
        fieldError = this.fieldErrorEmail;
        break;
      case 'password':
        fieldError = this.fieldErrorPassword;
        break;
      case 'passwordConfirmation':
        fieldError = this.fieldErrorPasswordConfirmation;
        break;
    }

    await expect(fieldError).toBeVisible();

    if (expectedText) {
      if (typeof expectedText === 'string') {
        await expect(fieldError).toContainText(expectedText);
      } else {
        const text = await fieldError.textContent() || '';
        expect(text).toMatch(expectedText);
      }
    }
  }

  /**
   * Click login link
   */
  async goToLogin() {
    await this.loginLink.click();
    await this.page.waitForURL(/\/login/);
  }
}
