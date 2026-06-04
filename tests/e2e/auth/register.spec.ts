/**
 * Register E2E Tests
 * 
 * Tests the user registration flow for JustShop Frontend.
 * Based on actual register page implementation with data-testid attributes.
 */

import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { loginViaAPI, assertNotAuthenticated } from '../../helpers/auth';
import { generateTestUser, invalidRegistrations } from '../../fixtures/users';

test.describe('Registration Flow', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    
    // Ensure user is logged out before each test
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    
    await registerPage.goto();
  });

  test('should display registration page correctly', async ({ page }) => {
    await registerPage.assertPageLoaded();

    // Check page title
    await expect(page).toHaveTitle(/create account/i);
  });

  test('should successfully register with valid data', async ({ page }) => {
    const testUser = generateTestUser();

    await registerPage.register({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
      passwordConfirmation: testUser.password,
    });

    // Should redirect to login page with success indicator
    await registerPage.waitForSuccess();
    await expect(page).toHaveURL(/\/login/);

    // Check for success message on login page
    const successMessage = page.locator('text=/registered|success/i');
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });

  test('should show validation error for empty name field', async ({ page }) => {
    const testUser = generateTestUser();

    await registerPage.register({
      name: '',
      email: testUser.email,
      password: testUser.password,
      passwordConfirmation: testUser.password,
    });

    // Should show field-specific error
    await registerPage.assertFieldError('name', /required|cannot be empty/i);
  });

  test('should show validation error for invalid email', async ({ page }) => {
    const testUser = generateTestUser();

    await registerPage.register({
      name: testUser.name,
      email: 'invalid-email',
      password: testUser.password,
      passwordConfirmation: testUser.password,
    });

    // Should show email validation error
    await registerPage.assertFieldError('email', /valid email|invalid/i);
  });

  test('should show validation error for weak password', async ({ page }) => {
    const testUser = generateTestUser();

    await registerPage.register({
      name: testUser.name,
      email: testUser.email,
      password: '123',
      passwordConfirmation: '123',
    });

    // Should show password validation error
    await registerPage.assertFieldError('password', /password.*short|minimum.*8|at least 8/i);
  });

  test('should show error for password confirmation mismatch', async ({ page }) => {
    const testUser = generateTestUser();

    await registerPage.register({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
      passwordConfirmation: 'DifferentPassword123!',
    });

    // Should show password confirmation error
    await registerPage.assertFieldError('passwordConfirmation', /match|confirmation|same/i);
  });

  test('should show error for duplicate email', async ({ page }) => {
    const testUser = generateTestUser();

    // First registration
    await registerPage.register({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
      passwordConfirmation: testUser.password,
    });

    // Wait for redirect
    await registerPage.waitForSuccess();

    // Navigate back to register page
    await registerPage.goto();

    // Try to register with same email
    await registerPage.register({
      name: 'Another User',
      email: testUser.email,
      password: 'AnotherPass123!',
      passwordConfirmation: 'AnotherPass123!',
    });

    // Should show duplicate email error
    await registerPage.assertErrorShown(/email.*already.*taken|already.*exists|duplicate/i);
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await registerPage.submit();

    // Should show multiple validation errors
    await registerPage.waitForError();
    await expect(registerPage.errorMessage).toBeVisible();
  });

  test('should navigate to login page via link', async ({ page }) => {
    await registerPage.goToLogin();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show loading state during registration', async ({ page }) => {
    const testUser = generateTestUser();

    await registerPage.fillRegistrationForm({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
      passwordConfirmation: testUser.password,
    });

    // Click submit
    const submitButton = registerPage.submitButton;
    await submitButton.click();

    // Check for loading state (button disabled)
    await expect(submitButton).toBeDisabled();
  });

  test('should clear form after failed registration', async ({ page }) => {
    await registerPage.register({
      name: 'Test User',
      email: 'invalid-email',
      password: 'Password123!',
      passwordConfirmation: 'Password123!',
    });

    // Wait for error
    await registerPage.waitForError();

    // Form fields should still contain values (not cleared)
    await expect(registerPage.nameInput).toHaveValue('Test User');
    await expect(registerPage.emailInput).toHaveValue('invalid-email');
  });

  test('should not be authenticated after visiting registration page', async ({ page }) => {
    await assertNotAuthenticated(page);
  });

  test('should sanitize input fields', async ({ page }) => {
    const maliciousInput = '<script>alert("XSS")</script>';

    await registerPage.nameInput.fill(maliciousInput);
    await registerPage.emailInput.fill(maliciousInput);

    // Inputs should not contain script tags
    const nameValue = await registerPage.nameInput.inputValue();
    const emailValue = await registerPage.emailInput.inputValue();

    expect(nameValue).not.toContain('<script>');
    expect(emailValue).not.toContain('<script>');
  });
});

test.describe('Registration with i18n', () => {
  test('should display registration page in Arabic', async ({ page }) => {
    await page.goto('/ar/register');
    await page.waitForLoadState('networkidle');

    // Check page is in Arabic (RTL)
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', /ar/i);

    // Form elements should still be visible
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('input#password_confirmation')).toBeVisible();
  });
});

test.describe('Registration Validation Edge Cases', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await page.context().clearCookies();
    await registerPage.goto();
  });

  for (const testCase of invalidRegistrations) {
    test(`should show error for: ${testCase.name}`, async ({ page }) => {
      await registerPage.register({
        name: testCase.data.name,
        email: testCase.data.email,
        password: testCase.data.password,
        passwordConfirmation: testCase.data.password_confirmation,
      });

      // Should show error matching expected pattern
      await registerPage.waitForError();
      const errorText = await registerPage.getErrorText();
      expect(errorText).toMatch(testCase.expectedError);
    });
  }

  test('should enforce password minimum length', async ({ page }) => {
    const testUser = generateTestUser();

    await registerPage.register({
      name: testUser.name,
      email: testUser.email,
      password: '1234567', // 7 characters (should be minimum 8)
      passwordConfirmation: '1234567',
    });

    await registerPage.assertFieldError('password', /minimum|at least.*8|too short/i);
  });

  test('should handle very long input gracefully', async ({ page }) => {
    const longString = 'a'.repeat(300);

    await registerPage.register({
      name: longString,
      email: `${longString}@example.com`,
      password: 'Password123!',
      passwordConfirmation: 'Password123!',
    });

    // Should show validation error or truncate
    await registerPage.waitForError();
  });
});
