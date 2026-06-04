/**
 * Cart UI E2E Tests
 * 
 * Tests the cart user interface components including badge, drawer, empty state, and calculations.
 */

import { test, expect } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import {
  addToCartViaAPI,
  clearCartViaAPI,
  setGuestCart,
  clearGuestCart,
  waitForCartUpdate,
} from '../../helpers/cart';
import { loginViaAPI, assertNotAuthenticated } from '../../helpers/auth';
import { testUserCredentials } from '../../fixtures/users';
import { basicProduct, productWithVariants, saleProduct } from '../../fixtures/products';

test.describe('Cart Badge', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.goto('/');
  });

  test('should show cart badge when items are added', async ({ page }) => {
    // Initially no badge or badge shows 0
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    if (await cartBadge.isVisible()) {
      await expect(cartBadge).toHaveText('0');
    }

    // Add item to guest cart
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

    await page.reload();

    // Badge should show 3
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('3');
  });

  test('should update cart badge count when quantity changes', async ({ page }) => {
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);
    await clearCartViaAPI(page);

    // Add item with quantity 1
    await addToCartViaAPI(page, basicProduct.id, { quantity: 1 });
    await page.goto('/');

    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('1');

    // Add another item
    await addToCartViaAPI(page, productWithVariants.id, { quantity: 2 });
    await page.reload();

    // Badge should show 3 (1 + 2)
    await expect(cartBadge).toHaveText('3');
  });

  test('should hide cart badge when cart is empty', async ({ page }) => {
    const cartBadge = page.locator('[data-testid="cart-badge"]');

    // Cart is empty, badge should not be visible or show 0
    if (await cartBadge.isVisible()) {
      await expect(cartBadge).toHaveText('0');
    }
  });

  test('should show correct count after removing items', async ({ page }) => {
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);

    // Add 2 items
    await addToCartViaAPI(page, basicProduct.id, { quantity: 2 });
    await addToCartViaAPI(page, productWithVariants.id, { quantity: 1 });
    await page.goto('/');

    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('3');

    // Clear cart
    await clearCartViaAPI(page);
    await page.reload();

    // Badge should show 0 or be hidden
    if (await cartBadge.isVisible()) {
      await expect(cartBadge).toHaveText('0');
    }
  });

  test('should update badge in real-time', async ({ page }) => {
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);
    await clearCartViaAPI(page);
    await page.goto('/');

    const cartBadge = page.locator('[data-testid="cart-badge"]');

    // Add item via API (simulating background update)
    await addToCartViaAPI(page, basicProduct.id, { quantity: 1 });

    // Wait for badge to update
    await waitForCartUpdate(page, 1);
    await expect(cartBadge).toHaveText('1');
  });
});

test.describe('Cart Button Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to cart page when cart button is clicked', async ({ page }) => {
    const cartButton = page.locator('[data-testid="cart-button"]');
    await cartButton.click();

    await expect(page).toHaveURL(/\/cart/);
  });

  test('should show cart button in header on all pages', async ({ page }) => {
    const cartButton = page.locator('[data-testid="cart-button"]');
    await expect(cartButton).toBeVisible();

    // Navigate to different pages
    await page.goto('/shop');
    await expect(cartButton).toBeVisible();

    await page.goto('/profile');
    await expect(cartButton).toBeVisible();
  });
});

test.describe('Cart Empty State', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    await page.context().clearCookies();
    await clearGuestCart(page);
    await page.goto('/cart');
  });

  test('should display empty cart message when cart is empty', async ({ page }) => {
    await cartPage.assertEmptyState();

    // Check empty message is visible
    const emptyMessage = page.locator('[data-testid="cart-empty-message"]');
    await expect(emptyMessage).toBeVisible();
    await expect(emptyMessage).toContainText(/empty|no items/i);
  });

  test('should show "Continue Shopping" button in empty state', async ({ page }) => {
    const continueButton = page.locator('a[href*="/shop"], button:has-text("Continue Shopping")');
    await expect(continueButton).toBeVisible();
  });

  test('should not show cart items list when empty', async ({ page }) => {
    const cartItems = page.locator('[data-testid="cart-items-list"]');
    await expect(cartItems).not.toBeVisible();
  });

  test('should not show checkout button when empty', async ({ page }) => {
    const checkoutButton = page.locator('[data-testid="cart-checkout-button"], [data-testid="cart-mobile-checkout-button"]');
    const count = await checkoutButton.count();
    
    for (let i = 0; i < count; i++) {
      await expect(checkoutButton.nth(i)).not.toBeVisible();
    }
  });
});

test.describe('Cart Items Display', () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);
    await page.context().clearCookies();
    await clearGuestCart(page);
  });

  test('should display cart items correctly', async ({ page }) => {
    // Add items to guest cart
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

    await page.goto('/cart');

    // Check item is displayed
    const cartItem = page.locator('[data-testid="cart-item"]').first();
    await expect(cartItem).toBeVisible();

    // Check product name
    await expect(page.locator('[data-testid="cart-item-name"]').first()).toContainText(basicProduct.name);

    // Check quantity
    const quantity = page.locator('[data-testid="cart-item-quantity"]').first();
    await expect(quantity).toHaveText('2');
  });

  test('should display product image in cart', async ({ page }) => {
    await setGuestCart(page, [
      {
        id: 'local_1',
        product_id: basicProduct.id,
        quantity: 1,
        price: basicProduct.price,
        product: {
          id: basicProduct.id,
          name: basicProduct.name,
          slug: basicProduct.slug,
          price: basicProduct.price,
          image: basicProduct.image,
        },
      },
    ]);

    await page.goto('/cart');

    const productImage = page.locator('[data-testid="cart-item-image"]').first();
    await expect(productImage).toBeVisible();
  });

  test('should display multiple cart items', async ({ page }) => {
    await setGuestCart(page, [
      {
        id: 'local_1',
        product_id: basicProduct.id,
        quantity: 1,
        price: basicProduct.price,
        product: {
          id: basicProduct.id,
          name: basicProduct.name,
          slug: basicProduct.slug,
          price: basicProduct.price,
        },
      },
      {
        id: 'local_2',
        product_id: productWithVariants.id,
        quantity: 2,
        price: productWithVariants.price,
        product: {
          id: productWithVariants.id,
          name: productWithVariants.name,
          slug: productWithVariants.slug,
          price: productWithVariants.price,
        },
      },
    ]);

    await page.goto('/cart');

    const cartItems = page.locator('[data-testid="cart-item"]');
    await expect(cartItems).toHaveCount(2);
  });

  test('should show quantity controls for each item', async ({ page }) => {
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

    await page.goto('/cart');

    // Check quantity controls exist
    const decreaseButton = page.locator('[data-testid="cart-item-quantity-decrement"]').first();
    const increaseButton = page.locator('[data-testid="cart-item-quantity-increment"]').first();
    const removeButton = page.locator('[data-testid="cart-item-remove"]').first();

    await expect(decreaseButton).toBeVisible();
    await expect(increaseButton).toBeVisible();
    await expect(removeButton).toBeVisible();
  });

  test('should show item subtotal', async ({ page }) => {
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

    await page.goto('/cart');

    // Check subtotal (2 * 29.99 = 59.98)
    const subtotal = page.locator('[data-testid="cart-item-subtotal"]').first();
    await expect(subtotal).toContainText('59.98');
  });
});

test.describe('Cart Summary and Total', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await clearGuestCart(page);
  });

  test('should calculate cart total correctly', async ({ page }) => {
    await setGuestCart(page, [
      {
        id: 'local_1',
        product_id: basicProduct.id,
        quantity: 2,
        price: basicProduct.price, // 29.99 * 2 = 59.98
        product: {
          id: basicProduct.id,
          name: basicProduct.name,
          slug: basicProduct.slug,
          price: basicProduct.price,
        },
      },
      {
        id: 'local_2',
        product_id: productWithVariants.id,
        quantity: 1,
        price: productWithVariants.price, // 59.99
        product: {
          id: productWithVariants.id,
          name: productWithVariants.name,
          slug: productWithVariants.slug,
          price: productWithVariants.price,
        },
      },
    ]);

    await page.goto('/cart');

    // Total should be 59.98 + 59.99 = 119.97
    const total = page.locator('[data-testid="cart-total"]');
    await expect(total).toContainText('119.97');
  });

  test('should show subtotal in cart summary', async ({ page }) => {
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

    await page.goto('/cart');

    const subtotal = page.locator('[data-testid="cart-subtotal"]');
    await expect(subtotal).toBeVisible();
    await expect(subtotal).toContainText('89.97'); // 29.99 * 3
  });

  test('should update total when quantity changes', async ({ page }) => {
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);
    await clearCartViaAPI(page);

    await addToCartViaAPI(page, basicProduct.id, { quantity: 1 });
    await page.goto('/cart');

    // Initial total: 29.99
    let total = page.locator('[data-testid="cart-total"]');
    await expect(total).toContainText('29.99');

    // Increase quantity
    const increaseButton = page.locator('[data-testid="cart-item-quantity-increment"]').first();
    await increaseButton.click();
    await page.waitForTimeout(1000);

    // Updated total: 59.98
    await expect(total).toContainText('59.98');
  });

  test('should show item count in summary', async ({ page }) => {
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
      {
        id: 'local_2',
        product_id: productWithVariants.id,
        quantity: 1,
        price: productWithVariants.price,
        product: {
          id: productWithVariants.id,
          name: productWithVariants.name,
          slug: productWithVariants.slug,
          price: productWithVariants.price,
        },
      },
    ]);

    await page.goto('/cart');

    // Should show "3 items" (2 + 1)
    await expect(page.locator('text=/3.*items?/i')).toBeVisible();
  });
});

test.describe('Cart Checkout Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await clearGuestCart(page);
  });

  test('should show checkout button when cart has items', async ({ page }) => {
    await setGuestCart(page, [
      {
        id: 'local_1',
        product_id: basicProduct.id,
        quantity: 1,
        price: basicProduct.price,
        product: {
          id: basicProduct.id,
          name: basicProduct.name,
          slug: basicProduct.slug,
          price: basicProduct.price,
        },
      },
    ]);

    await page.goto('/cart');

    const checkoutButton = page.locator('[data-testid="cart-checkout-button"]');
    await expect(checkoutButton).toBeVisible();
    await expect(checkoutButton).toBeEnabled();
  });

  test('should navigate to checkout when button clicked', async ({ page }) => {
    await loginViaAPI(page, testUserCredentials.email, testUserCredentials.password);
    await addToCartViaAPI(page, basicProduct.id, { quantity: 1 });
    await page.goto('/cart');

    const checkoutButton = page.locator('[data-testid="cart-checkout-button"]');
    await checkoutButton.click();

    // Should navigate to checkout
    await expect(page).toHaveURL(/\/checkout/);
  });

  test('should show mobile checkout button on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await setGuestCart(page, [
      {
        id: 'local_1',
        product_id: basicProduct.id,
        quantity: 1,
        price: basicProduct.price,
        product: {
          id: basicProduct.id,
          name: basicProduct.name,
          slug: basicProduct.slug,
          price: basicProduct.price,
        },
      },
    ]);

    await page.goto('/cart');

    const mobileCheckout = page.locator('[data-testid="cart-mobile-checkout"]');
    await expect(mobileCheckout).toBeVisible();
  });
});

test.describe('Cart Clear Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await clearGuestCart(page);
  });

  test('should show clear cart button when cart has items', async ({ page }) => {
    await setGuestCart(page, [
      {
        id: 'local_1',
        product_id: basicProduct.id,
        quantity: 1,
        price: basicProduct.price,
        product: {
          id: basicProduct.id,
          name: basicProduct.name,
          slug: basicProduct.slug,
          price: basicProduct.price,
        },
      },
    ]);

    await page.goto('/cart');

    const clearButton = page.locator('[data-testid="cart-clear-button"]');
    await expect(clearButton).toBeVisible();
  });

  test('should show confirmation modal when clear button clicked', async ({ page }) => {
    await setGuestCart(page, [
      {
        id: 'local_1',
        product_id: basicProduct.id,
        quantity: 1,
        price: basicProduct.price,
        product: {
          id: basicProduct.id,
          name: basicProduct.name,
          slug: basicProduct.slug,
          price: basicProduct.price,
        },
      },
    ]);

    await page.goto('/cart');

    const clearButton = page.locator('[data-testid="cart-clear-button"]');
    await clearButton.click();

    // Confirmation modal should appear
    const modal = page.locator('[data-testid="cart-clear-modal"]');
    await expect(modal).toBeVisible();

    // Should have cancel and confirm buttons
    const cancelButton = page.locator('[data-testid="cart-clear-modal-cancel"]');
    const confirmButton = page.locator('[data-testid="cart-clear-modal-confirm"]');
    await expect(cancelButton).toBeVisible();
    await expect(confirmButton).toBeVisible();
  });

  test('should cancel clear when cancel button clicked', async ({ page }) => {
    await setGuestCart(page, [
      {
        id: 'local_1',
        product_id: basicProduct.id,
        quantity: 1,
        price: basicProduct.price,
        product: {
          id: basicProduct.id,
          name: basicProduct.name,
          slug: basicProduct.slug,
          price: basicProduct.price,
        },
      },
    ]);

    await page.goto('/cart');

    // Click clear button
    const clearButton = page.locator('[data-testid="cart-clear-button"]');
    await clearButton.click();

    // Click cancel in modal
    const cancelButton = page.locator('[data-testid="cart-clear-modal-cancel"]');
    await cancelButton.click();

    // Cart should still have items
    const cartItem = page.locator('[data-testid="cart-item"]');
    await expect(cartItem).toBeVisible();
  });
});
