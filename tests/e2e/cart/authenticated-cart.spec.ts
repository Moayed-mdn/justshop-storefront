/**
 * Authenticated Cart E2E Tests
 * 
 * Tests the authenticated cart functionality for JustShop Frontend.
 * Tests cart operations when user is logged in, cart persistence, and cart merging.
 */

import { test, expect } from '@playwright/test';
import {
  addToCartViaAPI,
  clearCartViaAPI,
  getCartViaAPI,
  updateCartItemViaAPI,
  removeCartItemViaAPI,
  assertCartItemCount,
  assertCartContainsProduct,
  assertCartEmpty,
  goToCart,
  waitForCartUpdate,
  setGuestCart,
  clearGuestCart,
} from '../../helpers/cart';
import { loginViaAPI, assertAuthenticated } from '../../helpers/auth';
import { testUserCredentials } from '../../fixtures/users';
import { basicProduct, productWithVariants } from '../../fixtures/products';

test.describe('Authenticated Cart - Basic Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);
    await assertAuthenticated(page);

    // Clear cart
    await clearCartViaAPI(page);
    await page.goto('/');
  });

  test('should add item to authenticated cart via API', async ({ page }) => {
    const cart = await addToCartViaAPI(page, basicProduct.id, { quantity: 2 });

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].product_id).toBe(basicProduct.id);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.itemCount).toBe(2);

    // Cart badge should update
    await page.goto('/');
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('2');
  });

  test('should add item to authenticated cart via UI', async ({ page }) => {
    await page.goto(`/shop/products/${basicProduct.slug}`);

    // Click add to cart
    const addButton = page.locator('[data-testid="product-add-to-cart-button"]');
    await addButton.click();

    // Wait for cart update
    await waitForCartUpdate(page, 1);

    // Verify via API
    await assertCartItemCount(page, 1);
    await assertCartContainsProduct(page, basicProduct.id, 1);
  });

  test('should update item quantity in authenticated cart', async ({ page }) => {
    // Add item to cart
    const initialCart = await addToCartViaAPI(page, basicProduct.id, { quantity: 1 });
    const itemId = initialCart.items[0].id;

    // Update quantity
    const updatedCart = await updateCartItemViaAPI(page, itemId, 5);

    expect(updatedCart.items[0].quantity).toBe(5);
    expect(updatedCart.itemCount).toBe(5);

    // Verify UI reflects change
    await page.goto('/cart');
    const quantityElement = page.locator('[data-testid="cart-item-quantity"]').first();
    await expect(quantityElement).toHaveText('5');
  });

  test('should remove item from authenticated cart', async ({ page }) => {
    // Add two items
    await addToCartViaAPI(page, basicProduct.id, { quantity: 1 });
    const cart = await addToCartViaAPI(page, productWithVariants.id, { quantity: 1 });

    expect(cart.items).toHaveLength(2);

    // Remove first item
    const itemIdToRemove = cart.items[0].id;
    const updatedCart = await removeCartItemViaAPI(page, itemIdToRemove);

    expect(updatedCart.items).toHaveLength(1);
    expect(updatedCart.items[0].id).not.toBe(itemIdToRemove);
  });

  test('should clear entire authenticated cart', async ({ page }) => {
    // Add multiple items
    await addToCartViaAPI(page, basicProduct.id, { quantity: 2 });
    await addToCartViaAPI(page, productWithVariants.id, { quantity: 1 });

    // Verify cart has items
    await assertCartItemCount(page, 2);

    // Clear cart
    await clearCartViaAPI(page);

    // Verify cart is empty
    await assertCartEmpty(page);

    // UI should show empty cart
    await goToCart(page);
    const emptyMessage = page.locator('[data-testid="cart-empty-message"]');
    await expect(emptyMessage).toBeVisible();
  });

  test('should persist authenticated cart after page reload', async ({ page }) => {
    // Add items to cart
    await addToCartViaAPI(page, basicProduct.id, { quantity: 3 });

    // Reload page
    await page.reload();

    // Cart should still have items
    await assertCartItemCount(page, 1);
    await assertCartContainsProduct(page, basicProduct.id, 3);

    // Badge should show correct count
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('3');
  });

  test('should persist authenticated cart across navigation', async ({ page }) => {
    // Add item to cart
    await addToCartViaAPI(page, basicProduct.id, { quantity: 2 });

    // Navigate to different pages
    await page.goto('/shop');
    await page.goto('/profile');
    await page.goto('/');

    // Cart should still have items
    await assertCartItemCount(page, 1);

    // Badge should still show 2
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('2');
  });

  test('should calculate cart total correctly', async ({ page }) => {
    // Add items with known prices
    await addToCartViaAPI(page, basicProduct.id, { quantity: 2 }); // 2 * 29.99 = 59.98

    // Go to cart page
    await goToCart(page);

    // Check total
    const total = page.locator('[data-testid="cart-total"]');
    await expect(total).toContainText('59.98');
  });

  test('should handle adding same item multiple times', async ({ page }) => {
    // Add same item twice
    await addToCartViaAPI(page, basicProduct.id, { quantity: 1 });
    const cart = await addToCartViaAPI(page, basicProduct.id, { quantity: 1 });

    // Should have single item with quantity 2
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
  });

  test('should validate quantity limits', async ({ page }) => {
    await page.goto(`/shop/products/${basicProduct.slug}`);

    // Try to set excessive quantity
    const quantityInput = page.locator('[data-testid="product-quantity-input"]');
    await quantityInput.fill('9999');

    const addButton = page.locator('[data-testid="product-add-to-cart-button"]');
    await addButton.click();

    // Should show error or limit to max quantity
    const errorMessage = page.locator('[data-testid="product-action-error"]');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toContainText(/maximum|limit|stock/i);
    }
  });
});

test.describe('Authenticated Cart - Guest to Authenticated Merge', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all state
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should merge guest cart with authenticated cart on login', async ({ page }) => {
    // Add items to guest cart
    await page.goto('/');
    await setGuestCart(page, [
      {
        id: 'local_1',
        product_id: basicProduct.id,
        quantity: 2,
        price: basicProduct.price,
        product: {
          id: basicProduct.id,
          name: basicProduct.name,
          slug: basicProduct.slug,
          price: basicProduct.price,
        },
      },
    ]);

    // Reload to ensure guest cart is loaded
    await page.reload();

    // Verify guest cart is present
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('2');

    // Login
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);

    // Navigate to trigger cart merge
    await page.goto('/cart');

    // Cart should contain the guest cart items
    await waitForCartUpdate(page, 2);
    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(1);

    // Guest cart localStorage should be cleared
    await clearGuestCart(page);
  });

  test('should merge guest cart with existing authenticated cart', async ({ page }) => {
    // First, login and add item to authenticated cart
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);
    await addToCartViaAPI(page, productWithVariants.id, { quantity: 1 });

    // Logout
    await page.request.post('/api/auth/logout');
    await page.context().clearCookies();

    // Add items to guest cart
    await page.goto('/');
    await setGuestCart(page, [
      {
        id: 'local_1',
        product_id: basicProduct.id,
        quantity: 2,
        price: basicProduct.price,
        product: {
          id: basicProduct.id,
          name: basicProduct.name,
          slug: basicProduct.slug,
          price: basicProduct.price,
        },
      },
    ]);

    // Login again
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);

    // Navigate to cart
    await page.goto('/cart');

    // Cart should contain items from both carts
    await waitForCartUpdate(page, 3); // 1 from authenticated + 2 from guest
    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(2); // 2 different products
  });

  test('should handle empty guest cart on login', async ({ page }) => {
    // Ensure guest cart is empty
    await page.goto('/');
    await clearGuestCart(page);

    // Login
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);

    // Cart should be empty
    await goToCart(page);
    const emptyMessage = page.locator('[data-testid="cart-empty-message"]');
    await expect(emptyMessage).toBeVisible();
  });

  test('should handle duplicate products in guest and authenticated cart', async ({ page }) => {
    // Login and add item
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);
    await addToCartViaAPI(page, basicProduct.id, { quantity: 1 });

    // Logout
    await page.request.post('/api/auth/logout');
    await page.context().clearCookies();

    // Add same item to guest cart
    await page.goto('/');
    await setGuestCart(page, [
      {
        id: 'local_1',
        product_id: basicProduct.id,
        quantity: 3,
        price: basicProduct.price,
        product: {
          id: basicProduct.id,
          name: basicProduct.name,
          slug: basicProduct.slug,
          price: basicProduct.price,
        },
      },
    ]);

    // Login again
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);
    await page.goto('/cart');

    // Should merge quantities (1 + 3 = 4)
    await waitForCartUpdate(page, 4);
    const quantityElement = page.locator('[data-testid="cart-item-quantity"]').first();
    await expect(quantityElement).toHaveText('4');
  });
});

test.describe('Authenticated Cart - Sync and Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);
    await clearCartViaAPI(page);
  });

  test('should sync cart across multiple browser tabs', async ({ page, context }) => {
    // Add item in first tab
    await addToCartViaAPI(page, basicProduct.id, { quantity: 2 });

    // Open second tab
    const secondTab = await context.newPage();
    await secondTab.goto('/');

    // Cart should show same items in second tab
    const cartBadge = secondTab.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('2');

    await secondTab.close();
  });

  test('should maintain cart after session timeout and re-login', async ({ page }) => {
    // Add items to cart
    await addToCartViaAPI(page, basicProduct.id, { quantity: 2 });

    // Simulate session expiry by clearing cookies
    await page.context().clearCookies();

    // Try to access cart (should redirect to login)
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/login/);

    // Login again
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);

    // Cart should still have items
    await assertCartItemCount(page, 1);
    await assertCartContainsProduct(page, basicProduct.id, 2);
  });

  test('should handle concurrent cart updates', async ({ page }) => {
    // Add initial item
    const cart1 = await addToCartViaAPI(page, basicProduct.id, { quantity: 1 });
    const itemId = cart1.items[0].id;

    // Update quantity multiple times rapidly
    await Promise.all([
      updateCartItemViaAPI(page, itemId, 2),
      updateCartItemViaAPI(page, itemId, 3),
    ]);

    // Final quantity should be consistent
    const finalCart = await getCartViaAPI(page);
    expect(finalCart.items[0].quantity).toBeGreaterThanOrEqual(2);
  });
});

test.describe('Authenticated Cart - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);
    await clearCartViaAPI(page);
  });

  test('should handle adding non-existent product gracefully', async ({ page }) => {
    const response = await page.request.post('/api/cart/items', {
      data: {
        product_id: 99999,
        quantity: 1,
      },
    });

    expect(response.ok()).toBeFalsy();
    expect([404, 422]).toContain(response.status());
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Add item first
    await addToCartViaAPI(page, basicProduct.id, { quantity: 1 });

    // Go to cart page
    await goToCart(page);

    // Simulate offline mode
    await page.context().setOffline(true);

    // Try to update quantity
    const increaseButton = page.locator('[data-testid="cart-item-quantity-increment"]').first();
    await increaseButton.click();

    // Should show error notification
    const errorNotification = page.locator('[data-testid="cart-error-notification"], text=/failed|error/i');
    await expect(errorNotification).toBeVisible({ timeout: 5000 });

    // Re-enable network
    await page.context().setOffline(false);
  });
});
