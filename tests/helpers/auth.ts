/**
 * Auth Testing Helpers
 * 
 * Utilities for authentication testing in JustShop Frontend.
 * Based on actual auth implementation in app/stores/auth.ts and app/plugins/01.auth.client.ts
 */

import { Page, expect } from '@playwright/test';
import type { AuthState } from './types';

/**
 * Session cookie names from actual implementation
 */
export const AUTH_COOKIES = {
  SESSION: 'ecommerce_session',
  XSRF: 'XSRF-TOKEN',
  JS_AUTH: 'js_auth',
} as const;

/**
 * Login via UI
 * Uses actual login page route: /auth/login
 */
export async function loginViaUI(
  page: Page,
  email: string,
  password: string,
  options?: {
    rememberMe?: boolean;
    waitForRedirect?: boolean;
  }
) {
  const { rememberMe = false, waitForRedirect = true } = options || {};

  // Navigate to login page
  await page.goto('/auth/login');

  // Fill login form (adjust selectors based on actual component)
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);

  if (rememberMe) {
    await page.check('[name="remember"]');
  }

  // Submit form
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();

  if (waitForRedirect) {
    // Wait for redirect after successful login
    await page.waitForURL((url) => !url.pathname.includes('/auth/login'));
  }

  // Verify session cookies exist
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === AUTH_COOKIES.SESSION);
  expect(sessionCookie).toBeDefined();
}

/**
 * Login via API
 * Uses actual API route: POST /api/auth/login
 * 
 * This is faster than UI login for test setup.
 */
export async function loginViaAPI(
  page: Page,
  email: string,
  password: string
): Promise<AuthState> {
  const response = await page.request.post('/api/auth/login', {
    data: {
      email,
      password,
    },
  });

  expect(response.ok()).toBeTruthy();

  const data = await response.json();

  // Verify response structure (from actual API)
  expect(data).toHaveProperty('user');
  expect(data.user).toHaveProperty('email', email);

  // Session cookies are set automatically by Set-Cookie header
  // Verify they exist
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === AUTH_COOKIES.SESSION);
  expect(sessionCookie).toBeDefined();

  return {
    isAuthenticated: true,
    user: data.user,
  };
}

/**
 * Register a new user via API
 * Uses actual API route: POST /api/auth/register
 */
export async function registerViaAPI(
  page: Page,
  userData: {
    email: string;
    password: string;
    password_confirmation: string;
    name?: string;
    phone?: string;
  }
) {
  const response = await page.request.post('/api/auth/register', {
    data: userData,
  });

  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(data).toHaveProperty('user');

  return data;
}

/**
 * Logout via UI
 * Uses actual logout trigger (adjust based on actual implementation)
 */
export async function logoutViaUI(page: Page) {
  // Click user menu or logout button (adjust selector)
  await page.click('[data-testid="user-menu-trigger"]');
  await page.click('[data-testid="logout-button"]');

  // Wait for logout to complete
  await page.waitForURL('/');

  // Verify session cookies are cleared
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === AUTH_COOKIES.SESSION);
  expect(sessionCookie).toBeUndefined();
}

/**
 * Logout via API
 * Uses actual API route: POST /api/auth/logout
 */
export async function logoutViaAPI(page: Page) {
  const response = await page.request.post('/api/auth/logout');
  expect(response.ok()).toBeTruthy();

  // Verify session cookies are cleared
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find((c) => c.name === AUTH_COOKIES.SESSION);
  expect(sessionCookie).toBeUndefined();
}

/**
 * Get current auth state from cookies
 * Based on actual persisted auth state in js_auth cookie
 */
export async function getAuthState(page: Page): Promise<AuthState | null> {
  const cookies = await page.context().cookies();
  const authCookie = cookies.find((c) => c.name === AUTH_COOKIES.JS_AUTH);

  if (!authCookie) {
    return null;
  }

  try {
    // The js_auth cookie contains serialized auth state
    const authState = JSON.parse(decodeURIComponent(authCookie.value));
    return authState;
  } catch {
    return null;
  }
}

/**
 * Wait for user to be authenticated
 * Checks for session cookie and js_auth cookie
 */
export async function waitForAuthentication(page: Page, timeout = 5000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find((c) => c.name === AUTH_COOKIES.SESSION);
    const authCookie = cookies.find((c) => c.name === AUTH_COOKIES.JS_AUTH);

    if (sessionCookie && authCookie) {
      return true;
    }

    await page.waitForTimeout(100);
  }

  throw new Error('Authentication timeout: User not authenticated within timeout period');
}

/**
 * Assert user is authenticated
 */
export async function assertAuthenticated(page: Page) {
  const authState = await getAuthState(page);
  expect(authState).not.toBeNull();
  expect(authState?.isAuthenticated).toBe(true);
  expect(authState?.user).toBeDefined();
}

/**
 * Assert user is NOT authenticated
 */
export async function assertNotAuthenticated(page: Page) {
  const authState = await getAuthState(page);
  expect(authState).toBeNull();
}

/**
 * Create a test user (requires backend API)
 * This should be used in global setup or fixtures
 */
export async function createTestUser(
  email: string,
  password: string = 'Password123!',
  additionalData?: Record<string, any>
) {
  // This would typically call your backend API directly
  // to create a user for testing purposes
  // Implementation depends on your backend test setup
  return {
    email,
    password,
    ...additionalData,
  };
}

/**
 * Clean up test user (requires backend API)
 * This should be used in test cleanup or global teardown
 */
export async function deleteTestUser(email: string) {
  // This would typically call your backend API directly
  // to delete a test user after testing
  // Implementation depends on your backend test setup
}
