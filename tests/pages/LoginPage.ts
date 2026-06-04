/**
 * Login Page Object Model
 * 
 * Page Object for /login
 * Based on actual auth implementation
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

  // Form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberCheckbox: Locator;
  readonly submitButton: Locator;

  // Links
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;

  // OAuth buttons
  readonly googleLoginButton: Locator;

  // Messages
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Form elements
    // Using actual selectors from login.vue
    this.emailInput = page.locator('input[id="email"]');
    this.passwordInput = page.locator('input[id="password"]');
    this.rememberCheckbox = page.locator('[name="remember"]');
    this.submitButton = page.locator('button[type="submit"]');

    // Links
    this.registerLink = page.locator('a[href*="register"]');
    this.forgotPasswordLink = page.locator('a[href*="forgot-password"]');

    // OAuth
    this.googleLoginButton = page.locator(
      '[data-testid="google-login-button"], button:has-text("Google")'
    );

    // Messages
    this.errorMessage = page.locator('.error-message, .text-red-500, [role="alert"]');
    this.successMessage = page.locator('.success-message, .text-green-500');
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill login form
   */
  async fillLoginForm(email: string, password: string, remember = false) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    if (remember) {
      await this.rememberCheckbox.check();
    }
  }

  /**
   * Submit login form
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Login with credentials (fill + submit)
   */
  async login(email: string, password: string, remember = false) {
    await this.fillLoginForm(email, password, remember);
    await this.submit();
  }

  /**
   * Wait for successful login (redirect away from login page)
   */
  async waitForSuccess() {
    await this.page.waitForURL((url) => !url.pathname.includes('/login'), {
      timeout: 10000,
    });
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
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
    await expect(this.registerLink).toBeVisible();
    await expect(this.forgotPasswordLink).toBeVisible();
  }

  /**
   * Assert error message is shown
   */
  async assertErrorShown(expectedText?: string) {
    await expect(this.errorMessage).toBeVisible();

    if (expectedText) {
      await expect(this.errorMessage).toContainText(expectedText);
    }
  }

  /**
   * Assert validation errors for empty form
   */
  async assertValidationErrors() {
    await expect(this.errorMessage).toBeVisible();
  }

  /**
   * Click register link
   */
  async goToRegister() {
    await this.registerLink.click();
    await this.page.waitForURL(/\/auth\/register/);
  }

  /**
   * Click forgot password link
   */
  async goToForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL(/\/auth\/forgot-password/);
  }

  /**
   * Click Google login button
   */
  async loginWithGoogle() {
    await this.googleLoginButton.click();
  }

  /**
   * Check if Google login is available
   */
  async isGoogleLoginAvailable(): Promise<boolean> {
    return await this.googleLoginButton.isVisible();
  }
}
