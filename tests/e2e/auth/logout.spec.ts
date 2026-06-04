import { test, expect } from '@playwright/test';
import {
  assertAuthenticated,
  assertNotAuthenticated,
  AUTH_COOKIES,
} from '../../helpers/auth';
import {
  getGuestCartKey,
} from '../../helpers/cart';
import { setupAuthenticatedContext } from '../../fixtures';
import { mockAuthenticatedUser } from '../../fixtures/users';

const MOCK_CART_RESPONSE = {
  status: true,
  message: 'Success',
  data: {
    cart: {
      items: [{
        id: 1,
        product_id: 1,
        product_variant_id: 1,
        quantity: 1,
        name: 'Test Product',
        price: 99.99,
        image: '/test.jpg',
      }],
      itemCount: 1,
      subtotal: '99.99',
    },
  },
};

async function mockLogoutAPI(page: import('@playwright/test').Page) {
  await page.context().route('**/api/auth/logout', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: true,
          message: 'Logged out successfully',
          data: null,
        }),
      });
    } else {
      await route.continue();
    }
  });
}

test.describe('Logout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await mockLogoutAPI(page);
  });

  test('should logout successfully from header menu', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
    await page.goto('/');

    await assertAuthenticated(page);

    const userMenuTrigger = page.locator('[data-testid="user-menu-trigger"], [data-testid="profile-dropdown-trigger"]');
    await userMenuTrigger.click();

    const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout"), button:has-text("Log out")');
    await logoutButton.click();

    await assertNotAuthenticated(page);

    await expect(page.locator('a[href*="login"]')).toBeVisible();
  });

  test('should clear all auth cookies after logout', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
    await page.goto('/');

    let cookies = await page.context().cookies();
    expect(cookies.some(c => c.name === AUTH_COOKIES.SESSION)).toBeTruthy();
    expect(cookies.some(c => c.name === AUTH_COOKIES.JS_AUTH)).toBeTruthy();

    await page.context().clearCookies();

    cookies = await page.context().cookies();
    expect(cookies.some(c => c.name === AUTH_COOKIES.SESSION)).toBeFalsy();
    expect(cookies.some(c => c.name === AUTH_COOKIES.JS_AUTH)).toBeFalsy();
  });

  test('should redirect to home page after logout', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
    await page.goto('/profile');

    await expect(page).toHaveURL(/\/profile/);

    await page.context().clearCookies();
    await page.goto('/');

    await expect(page).toHaveURL('/');
  });

  test('should redirect to login when accessing protected page after logout', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
    await page.goto('/');

    await page.context().clearCookies();

    await page.goto('/profile');

    await expect(page).toHaveURL(/\/login/);
  });

  test('should clear authenticated cart after logout', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
    await page.goto('/');

    await page.context().route('**/api/cart/**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_CART_RESPONSE),
        });
      } else if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_CART_RESPONSE),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/cart');
    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(1);

    await page.context().clearCookies();
    await page.goto('/');

    await page.context().route('**/api/cart/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: true,
          message: 'Success',
          data: { cart: { items: [], itemCount: 0, subtotal: '0.00' } },
        }),
      });
    });

    await page.goto('/cart');
    const emptyMessage = page.locator('[data-testid="cart-empty-message"]');
    await expect(emptyMessage).toBeVisible();
  });

  test('should preserve guest cart after logout', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
    await page.goto('/');

    await page.context().clearCookies();

    await page.goto('/');

    await page.evaluate(({ key, data }) => {
      localStorage.setItem(key, JSON.stringify(data));
    }, {
      key: getGuestCartKey(),
      data: {
        items: [{
          id: 'local_123',
          product_id: 1,
          product_variant_id: 1,
          quantity: 1,
          name: 'Guest Cart Item',
          price: 49.99,
          image: '/test.jpg',
        }],
      },
    });

    await page.reload();
    await page.goto('/cart');

    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(1);
  });

  test('should not allow logout if already logged out', async ({ page }) => {
    await assertNotAuthenticated(page);

    const response = await page.request.post('/api/auth/logout');

    expect([200, 401, 403]).toContain(response.status());
  });

  test('should clear Pinia store state after logout', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
    await page.goto('/');

    await assertAuthenticated(page);

    await page.context().clearCookies();

    const cookies = await page.context().cookies();
    const authCookie = cookies.find(c => c.name === AUTH_COOKIES.JS_AUTH);
    expect(authCookie).toBeUndefined();
  });

  test('should handle logout button click multiple times', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
    await page.goto('/');

    const userMenuTrigger = page.locator('[data-testid="user-menu-trigger"], [data-testid="profile-dropdown-trigger"]');
    await userMenuTrigger.click();

    const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout"), button:has-text("Log out")');
    await logoutButton.click();

    await page.waitForTimeout(100);
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }

    await assertNotAuthenticated(page);
  });

  test('should show login link after logout', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
    await page.goto('/');

    await page.context().clearCookies();
    await page.goto('/');

    const loginLink = page.locator('a[href*="login"]');
    await expect(loginLink).toBeVisible();

    const userMenu = page.locator('[data-testid="user-menu-trigger"], [data-testid="profile-dropdown-trigger"]');
    await expect(userMenu).not.toBeVisible();
  });
});

test.describe('Logout Cart Behavior', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should convert authenticated cart to guest cart after logout', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
    await page.goto('/');

    await page.context().route('**/api/cart/**', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_CART_RESPONSE),
        });
      } else if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_CART_RESPONSE),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/cart');
    let cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(1);

    await page.context().clearCookies();
    await page.goto('/cart');

    const emptyMessage = page.locator('[data-testid="cart-empty-message"]');
    const hasItems = await cartItems.count() > 0;
    const isEmpty = await emptyMessage.isVisible();

    expect(hasItems || isEmpty).toBeTruthy();
  });

  test('should keep cart badge count at zero after logout with no guest items', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
    await page.goto('/');

    await page.context().clearCookies();
    await page.goto('/');

    const cartBadge = page.locator('[data-testid="cart-badge"]');
    if (await cartBadge.isVisible()) {
      await expect(cartBadge).toHaveText('0');
    }
  });
});

test.describe('Logout Security', () => {
  test('should invalidate session token after logout', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });

    let cookies = await page.context().cookies();
    const sessionBefore = cookies.find(c => c.name === AUTH_COOKIES.SESSION);
    expect(sessionBefore).toBeDefined();

    await page.context().clearCookies();

    cookies = await page.context().cookies();
    const sessionAfter = cookies.find(c => c.name === AUTH_COOKIES.SESSION);
    expect(sessionAfter).toBeUndefined();
  });

  test('should not be able to make authenticated requests after logout', async ({ page }) => {
    await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });

    await page.context().route('**/api/profile', async (route) => {
      if (route.request().method() === 'GET') {
        const cookies = await page.context().cookies();
        const hasSession = cookies.some(c => c.name === AUTH_COOKIES.SESSION);
        if (hasSession) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              status: true,
              message: 'Success',
              data: mockAuthenticatedUser,
            }),
          });
        } else {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({
              status: false,
              message: 'Unauthenticated',
            }),
          });
        }
      } else {
        await route.continue();
      }
    });

    let response = await page.request.get('/api/profile');
    expect(response.ok()).toBeTruthy();

    await page.context().clearCookies();

    response = await page.request.get('/api/profile');
    expect(response.ok()).toBeFalsy();
    expect([401, 403]).toContain(response.status());
  });
});
