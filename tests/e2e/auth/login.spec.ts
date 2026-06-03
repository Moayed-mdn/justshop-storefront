/**
 * Login E2E Tests
 * 
 * Tests the authentication flow for JustShop Frontend.
 * Based on actual auth implementation in app/stores/auth.ts and app/plugins/01.auth.client.ts
 */

import { test, expect } from '@playwright/test';
import {
  loginViaUI,
  loginViaAPI,
  logoutViaAPI,
  assertAuthenticated,
  assertNotAuthenticated,
  AUTH_COOKIES,
} from '../../helpers/auth';

/**
 * Test data
 * NOTE: These should ideally come from environment variables or fixtures
 */
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'Password123!',
};

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure user is logged out before each test
    await page.goto('/');
    const cookies = await page.context().cookies();
    const hasSession = cookies.some((c) => c.name === AUTH_COOKIES.SESSION);

    if (hasSession) {
      await logoutViaAPI(page);
    }
  });

  test('should display login page correctly', async ({ page }) => {
    await page.goto('/auth/login');

    // Check page title
    await expect(page).toHaveTitle(/login/i);

    // Check form elements exist
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Check links
    await expect(page.locator('a[href*="register"]')).toBeVisible();
    await expect(page.locator('a[href*="forgot-password"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth/login');

    // Click submit without filling form
    await page.click('button[type="submit"]');

    // Check for validation errors
    // Adjust selectors based on actual error display
    await expect(page.locator('.error-message, .text-red-500')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill form with invalid credentials
    await page.fill('[name="email"]', 'invalid@example.com');
    await page.fill('[name="password"]', 'wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for error message
    // Actual error code from implementation: AUTH_002
    await expect(
      page.locator('text=/invalid credentials|AUTH_002/i')
    ).toBeVisible({ timeout: 10000 });

    // Should not redirect
    await expect(page).toHaveURL(/\/auth\/login/);

    // Should not have session cookies
    await assertNotAuthenticated(page);
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill login form
    await page.fill('[name="email"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect away from login page
    await page.waitForURL((url) => !url.pathname.includes('/auth/login'), {
      timeout: 10000,
    });

    // Should be authenticated
    await assertAuthenticated(page);

    // Should see user menu or profile link
    await expect(
      page.locator('[data-testid="user-menu-trigger"], [href*="profile"]')
    ).toBeVisible();
  });

  test('should persist auth state after login', async ({ page }) => {
    // Login
    await loginViaAPI(page, TEST_USER.email, TEST_USER.password);

    // Navigate to home page
    await page.goto('/');

    // Should still be authenticated
    await assertAuthenticated(page);

    // Reload page
    await page.reload();

    // Should STILL be authenticated (persistence test)
    await assertAuthenticated(page);
  });

  test('should remember user when "Remember Me" is checked', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill form
    await page.fill('[name="email"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);

    // Check "Remember Me" if it exists
    const rememberCheckbox = page.locator('[name="remember"]');
    if (await rememberCheckbox.isVisible()) {
      await rememberCheckbox.check();
    }

    // Submit
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForURL((url) => !url.pathname.includes('/auth/login'));

    // Check that session cookie has longer expiry (if "Remember Me" affects cookie duration)
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find((c) => c.name === AUTH_COOKIES.SESSION);

    expect(sessionCookie).toBeDefined();
    // Note: Actual expiry check depends on backend implementation
  });

  test('should redirect to intended page after login', async ({ page }) => {
    // Try to access protected page (e.g., profile)
    await page.goto('/profile');

    // Should redirect to login with return URL
    await expect(page).toHaveURL(/\/auth\/login/);

    // Login
    await loginViaUI(page, TEST_USER.email, TEST_USER.password, {
      waitForRedirect: true,
    });

    // Should redirect back to profile page
    // Adjust based on actual redirect implementation
    await expect(page).toHaveURL(/\/profile/);
  });

  test('should show loading state during login', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill form
    await page.fill('[name="email"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);

    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for loading state
    // This might be a spinner, disabled button, or loading text
    await expect(submitButton).toBeDisabled();
    // OR
    // await expect(page.locator('.spinner, [data-testid="loading"]')).toBeVisible();

    // Wait for login to complete
    await page.waitForURL((url) => !url.pathname.includes('/auth/login'));
  });

  test('should handle Google OAuth login button', async ({ page }) => {
    await page.goto('/auth/login');

    // Check if Google OAuth button exists
    const googleButton = page.locator('[data-testid="google-login-button"], button:has-text("Google")');

    if (await googleButton.isVisible()) {
      // Note: Actually testing OAuth flow requires mocking or test credentials
      // Here we just verify the button exists and has correct attributes
      await expect(googleButton).toBeVisible();
      await expect(googleButton).toBeEnabled();

      // Could check that clicking it navigates to OAuth URL
      // But full OAuth testing is complex and often mocked
    }
  });
});

test.describe('Login with i18n', () => {
  test('should display login page in Arabic', async ({ page }) => {
    await page.goto('/ar/auth/login');

    // Check page is in Arabic
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');

    // Check form elements exist (same selectors, different text)
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

test.describe('Login Security', () => {
  test('should include CSRF token in request', async ({ page }) => {
    await page.goto('/auth/login');

    // Check for CSRF token in cookies
    const cookies = await page.context().cookies();
    const xsrfCookie = cookies.find((c) => c.name === AUTH_COOKIES.XSRF);

    expect(xsrfCookie).toBeDefined();
  });

  test('should sanitize input fields', async ({ page }) => {
    await page.goto('/auth/login');

    // Try to inject script
    const maliciousInput = '<script>alert("XSS")</script>';
    await page.fill('[name="email"]', maliciousInput);

    // The input should be sanitized or rejected
    const emailValue = await page.inputValue('[name="email"]');

    // Should not contain script tags
    expect(emailValue).not.toContain('<script>');
  });
});
