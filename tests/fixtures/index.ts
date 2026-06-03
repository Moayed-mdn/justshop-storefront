/**
 * Fixtures Index
 * 
 * Central export for all test fixtures and test context setup.
 * Import from here: import { basicProduct, testUserCredentials, setupAuthenticatedContext } from '../fixtures';
 * 
 * Based on actual JustShop Frontend implementation:
 * - Pinia stores: app/stores/auth.ts, app/stores/cart.ts
 * - Session cookies: ecommerce_session, XSRF-TOKEN, js_auth
 * - Persisted state via pinia-plugin-persistedstate
 * - Multi-tenant: X-Tenant-Id header on all requests
 */

import { Page, BrowserContext } from '@playwright/test';
import type { AuthState, CartState } from '../helpers/types';

export * from './products';
export * from './users';

/**
 * Test Context Setup Utilities
 * Based on actual state management in this project
 */

/**
 * Setup authenticated context with session cookies
 * Mimics actual auth flow from app/plugins/01.auth.client.ts
 */
export async function setupAuthenticatedContext(
  page: Page,
  authState: Partial<AuthState>
): Promise<void> {
  // Set js_auth cookie (actual auth state persistence)
  await page.context().addCookies([
    {
      name: 'js_auth',
      value: encodeURIComponent(JSON.stringify({
        isAuthenticated: true,
        user: authState.user,
        ...authState,
      })),
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);

  // Set session cookie (backend session)
  await page.context().addCookies([
    {
      name: 'ecommerce_session',
      value: 'test-session-' + Date.now(),
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ]);

  // Set XSRF token (CSRF protection)
  await page.context().addCookies([
    {
      name: 'XSRF-TOKEN',
      value: 'test-xsrf-token-' + Date.now(),
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
}

/**
 * Setup guest cart in localStorage
 * Based on actual cart implementation in app/stores/cart.ts
 */
export async function setupGuestCart(
  page: Page,
  cartState: Partial<CartState>
): Promise<void> {
  const tenantId = process.env.TEST_TENANT_ID || 'demo';
  const cartKey = `js_cart_${tenantId}`;

  await page.evaluate(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key: cartKey, value: cartState.items || [] }
  );
}

/**
 * Setup theme preference in localStorage
 * Based on actual theme handling in app/composables/useTheme.ts
 */
export async function setupTheme(
  page: Page,
  theme: 'light' | 'dark'
): Promise<void> {
  await page.evaluate((themeValue) => {
    localStorage.setItem('theme', themeValue);
    document.documentElement.setAttribute('data-theme', themeValue);
  }, theme);
}

/**
 * Setup i18n locale preference
 * Based on actual i18n config in nuxt.config.ts
 */
export async function setupLocale(
  page: Page,
  locale: 'en' | 'ar'
): Promise<void> {
  await page.context().addCookies([
    {
      name: 'i18n_redirected',
      value: locale,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
}

/**
 * Clear all test state
 * Clears cookies, localStorage, sessionStorage
 */
export async function clearTestState(page: Page): Promise<void> {
  // Clear cookies
  await page.context().clearCookies();

  // Clear storage
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Setup complete test environment
 * Sets up multi-tenant header, theme, locale
 */
export async function setupTestEnvironment(
  context: BrowserContext,
  options?: {
    tenant?: string;
    locale?: 'en' | 'ar';
    theme?: 'light' | 'dark';
  }
): Promise<void> {
  const { tenant = 'demo', locale = 'en', theme = 'light' } = options || {};

  // Set multi-tenant header on all requests (CRITICAL for this project)
  await context.setExtraHTTPHeaders({
    'X-Tenant-Id': tenant,
    'Accept-Language': locale,
  });
}
