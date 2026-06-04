/**
 * Login E2E Tests
 * 
 * Tests the authentication flow for JustShop Frontend.
 * Based on actual auth implementation in app/stores/auth.ts and app/plugins/01.auth.client.ts
 */

import { test, expect } from '@playwright/test';
import type { Page, Response } from '@playwright/test';
import {
  assertNotAuthenticated,
  AUTH_COOKIES,
} from '../../helpers/auth';
import { mockAuthAPI } from '../../helpers/mocks';
import { clearTestState, setupAuthenticatedContext, mockAuthenticatedUser } from '../../fixtures';

/**
 * Test data
 * NOTE: These should ideally come from environment variables or fixtures
 */
const TEST_USER = {
  email: 'test@example.com',
  password: 'Password123!',
};

async function gotoLogin(page: Page, path = '/login') {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

async function submitLogin(page: Page, email = TEST_USER.email, password = TEST_USER.password) {
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', password);

  const loginResponse = page.waitForResponse((response: Response) =>
    response.url().includes('/api/auth/login') && response.request().method() === 'POST',
  );

  await page.click('button[type="submit"]');
  await loginResponse;
}

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearTestState(page);
  });

  test('should display login page correctly', async ({ page }) => {
    await gotoLogin(page);

    // Check page title
    await expect(page).toHaveTitle(/sign in/i);

    // Check form elements exist
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Check links
    await expect(page.locator('a[href*="register"]')).toBeVisible();
    await expect(page.locator('a[href*="forgot-password"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await gotoLogin(page);

    // Click submit without filling form
    // Note: Browser HTML5 validation will prevent submission
    // or backend will return validation errors
    await page.click('button[type="submit"]');

    // Check for validation errors (either HTML5 validation or backend errors)
    // HTML5 validation prevents submission, so check if still on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }

      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          status: false,
          message: 'Invalid credentials.',
          error_code: 'AUTH_001',
          errors: null,
        }),
      });
    });
    await gotoLogin(page);

    // Fill form with invalid credentials
    await submitLogin(page, 'invalid@example.com', 'wrongpassword');

    await expect(page.locator('[role="alert"]')).toContainText(/invalid credentials/i);

    // Should not redirect (stay on login page)
    await expect(page).toHaveURL(/\/login/);

    // Should not have session cookies
    await assertNotAuthenticated(page);
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await mockAuthAPI(page);
    await gotoLogin(page);
    await submitLogin(page);
    await expect(page).toHaveURL('/');
  });

  test('should persist auth cookies across reloads once a session exists', async ({ page }) => {
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: mockAuthenticatedUser,
      isLoading: false,
    });

    await page.goto('/');
    await page.reload();

    const cookies = await page.context().cookies();
    expect(cookies.some((c) => c.name === AUTH_COOKIES.SESSION)).toBeTruthy();
    expect(cookies.some((c) => c.name === AUTH_COOKIES.XSRF)).toBeTruthy();
  });

  test('should login successfully when the remember-session control is enabled if present', async ({ page }) => {
    await mockAuthAPI(page);
    await gotoLogin(page);

    // Check "Remember Me" if it exists
    const rememberCheckbox = page.locator('[name="remember"]');
    if (await rememberCheckbox.isVisible().catch(() => false)) {
      await rememberCheckbox.check();
    }

    await submitLogin(page);
    await expect(page).toHaveURL('/');
  });

  test('should redirect to home after login from a protected page', async ({ page }) => {
    await mockAuthAPI(page);

    // Try to access protected page (e.g., profile)
    await page.goto('/profile');

    // Should redirect to login with return URL
    await expect(page).toHaveURL(/\/login/);
    await page.waitForLoadState('networkidle');

    await submitLogin(page);

    // Current guest/auth middleware redirects authenticated users to home.
    await expect(page).toHaveURL('/');
  });

  test('should show loading state during login', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: true,
          message: 'Logged in successfully',
          data: {
            user: {
              ...mockAuthenticatedUser,
              has_password: true,
              has_google_linked: false,
            },
          },
        }),
      });
    });

    await gotoLogin(page);

    // Fill form
    await page.fill('input[id="email"]', TEST_USER.email);
    await page.fill('input[id="password"]', TEST_USER.password);

    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    const loginResponse = page.waitForResponse((response) =>
      response.url().includes('/api/auth/login') && response.request().method() === 'POST',
    );
    await submitButton.click();

    // Check for loading state
    await expect(submitButton).toBeDisabled();

    // Wait for login to complete
    await loginResponse;
    await expect(page).toHaveURL('/');
  });

  test('should handle Google OAuth login button', async ({ page }) => {
    await gotoLogin(page);

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
    await gotoLogin(page, '/ar/login');

    // Check page is in Arabic
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar-SA');

    // Check form elements exist (same selectors, different text)
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

test.describe('Login Security', () => {
  test('should not require a CSRF cookie before the user submits the form', async ({ page }) => {
    await gotoLogin(page);

    // Check for CSRF token in cookies
    const cookies = await page.context().cookies();
    const xsrfCookie = cookies.find((c) => c.name === AUTH_COOKIES.XSRF);

    expect(xsrfCookie).toBeUndefined();
  });

  test('should treat script-like input as literal text in the email field', async ({ page }) => {
    await gotoLogin(page);

    // Try to inject script
    const maliciousInput = '<script>alert("XSS")</script>';
    await page.fill('input[id="email"]', maliciousInput);

    // The browser treats typed text as a literal input value; it should not execute.
    const emailValue = await page.inputValue('input[id="email"]');

    expect(emailValue).toBe(maliciousInput);
  });
});
