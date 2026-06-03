/**
 * Guest Cart E2E Tests
 * 
 * Tests the guest cart functionality for JustShop Frontend.
 * Based on actual cart implementation in app/stores/cart.ts
 * 
 * Guest cart uses localStorage: js_cart_{tenantId}
 */

import { test, expect } from '@playwright/test';
import {
  addToCartViaAPI,
  clearGuestCart,
  getGuestCart,
  setGuestCart,
  getGuestCartKey,
  assertCartItemCount,
  assertCartEmpty,
  goToCart,
  waitForCartUpdate,
  assertCartContainsProduct,
} from '../../helpers/cart';
import { assertNotAuthenticated } from '../../helpers/auth';

/**
 * Test product IDs
 * NOTE: These should match actual products in your test database
 */
const TEST_PRODUCT_ID = 1;
const TEST_PRODUCT_ID_2 = 2;

test.describe('Guest Cart - localStorage', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure user is NOT authenticated
    await page.goto('/');
    await assertNotAuthenticated(page);

    // Clear guest cart before each test
    await clearGuestCart(page);
  });

  test('should initialize empty guest cart in localStorage', async ({ page }) => {
    await page.goto('/');

    // Guest cart should not exist initially
    const cart = await getGuestCart(page);
    expect(cart).toBeNull();

    // Cart badge should show 0
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    if (await cartBadge.isVisible()) {
      await expect(cartBadge).toHaveText('0');
    }
  });

  test('should add item to guest cart via UI', async ({ page }) => {
    // Navigate to a product page
    await page.goto('/shop/products/test-product'); // Adjust slug based on actual product

    // Click "Add to Cart" button
    const addButton = page.locator('[data-testid="add-to-cart-button"]');
    await addButton.click();

    // Wait for cart to update
    await waitForCartUpdate(page, 1);

    // Check localStorage
    const cart = await getGuestCart(page);
    expect(cart).not.toBeNull();
    expect(cart).toHaveLength(1);

    // Cart badge should show 1
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('1');
  });

  test('should persist guest cart across page navigation', async ({ page }) => {
    // Add item to cart
    await page.goto('/shop/products/test-product');
    await page.click('[data-testid="add-to-cart-button"]');
    await waitForCartUpdate(page, 1);

    // Navigate to another page
    await page.goto('/shop');

    // Cart should still have 1 item
    const cart = await getGuestCart(page);
    expect(cart).toHaveLength(1);

    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('1');
  });

  test('should persist guest cart across page reload', async ({ page }) => {
    // Set cart with test data
    await page.goto('/');
    await setGuestCart(page, [
      {
        id: 1,
        product_id: TEST_PRODUCT_ID,
        quantity: 2,
        price: '29.99',
        product: {
          id: TEST_PRODUCT_ID,
          name: 'Test Product',
          slug: 'test-product',
          price: '29.99',
        },
      },
    ]);

    // Reload page
    await page.reload();

    // Cart should persist
    const cart = await getGuestCart(page);
    expect(cart).toHaveLength(1);
    expect(cart![0].quantity).toBe(2);

    // Badge should reflect quantity
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('2');
  });

  test('should update item quantity in guest cart', async ({ page }) => {
    // Set initial cart
    await page.goto('/');
    await setGuestCart(page, [
      {
        id: 1,
        product_id: TEST_PRODUCT_ID,
        quantity: 1,
        price: '29.99',
        product: {
          id: TEST_PRODUCT_ID,
          name: 'Test Product',
          slug: 'test-product',
          price: '29.99',
        },
      },
    ]);

    // Go to cart page
    await goToCart(page);

    // Update quantity to 3
    const quantityInput = page.locator('[data-testid="cart-item-quantity"]').first();
    await quantityInput.fill('3');

    // Trigger update (might be automatic or require a button click)
    const updateButton = page.locator('[data-testid="update-cart-button"]');
    if (await updateButton.isVisible()) {
      await updateButton.click();
    }

    // Wait for update
    await page.waitForTimeout(1000);

    // Check localStorage
    const cart = await getGuestCart(page);
    expect(cart![0].quantity).toBe(3);

    // Badge should show 3
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('3');
  });

  test('should remove item from guest cart', async ({ page }) => {
    // Set initial cart with 2 items
    await page.goto('/');
    await setGuestCart(page, [
      {
        id: 1,
        product_id: TEST_PRODUCT_ID,
        quantity: 1,
        price: '29.99',
        product: {
          id: TEST_PRODUCT_ID,
          name: 'Test Product 1',
          slug: 'test-product-1',
          price: '29.99',
        },
      },
      {
        id: 2,
        product_id: TEST_PRODUCT_ID_2,
        quantity: 1,
        price: '39.99',
        product: {
          id: TEST_PRODUCT_ID_2,
          name: 'Test Product 2',
          slug: 'test-product-2',
          price: '39.99',
        },
      },
    ]);

    // Go to cart page
    await goToCart(page);

    // Remove first item
    const removeButton = page.locator('[data-testid="remove-cart-item"]').first();
    await removeButton.click();

    // Confirm removal if there's a confirmation dialog
    const confirmButton = page.locator('[data-testid="confirm-remove"]');
    if (await confirmButton.isVisible({ timeout: 2000 })) {
      await confirmButton.click();
    }

    // Wait for removal
    await page.waitForTimeout(1000);

    // Check localStorage
    const cart = await getGuestCart(page);
    expect(cart).toHaveLength(1);

    // Badge should show 1
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('1');
  });

  test('should clear entire guest cart', async ({ page }) => {
    // Set initial cart
    await page.goto('/');
    await setGuestCart(page, [
      {
        id: 1,
        product_id: TEST_PRODUCT_ID,
        quantity: 2,
        price: '29.99',
        product: {
          id: TEST_PRODUCT_ID,
          name: 'Test Product',
          slug: 'test-product',
          price: '29.99',
        },
      },
    ]);

    // Go to cart page
    await goToCart(page);

    // Click clear cart button
    const clearButton = page.locator('[data-testid="clear-cart-button"]');
    if (await clearButton.isVisible()) {
      await clearButton.click();

      // Confirm if needed
      const confirmButton = page.locator('[data-testid="confirm-clear"]');
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }

      // Wait for clear
      await page.waitForTimeout(1000);

      // Cart should be empty
      const cart = await getGuestCart(page);
      expect(cart).toBeNull();
    }
  });

  test('should prevent adding out-of-stock items to cart', async ({ page }) => {
    // Navigate to an out-of-stock product
    await page.goto('/shop/products/out-of-stock-product');

    // Add to cart button should be disabled
    const addButton = page.locator('[data-testid="add-to-cart-button"]');
    await expect(addButton).toBeDisabled();

    // Or should show "Out of Stock" message
    await expect(page.locator('text=/out of stock/i')).toBeVisible();
  });

  test('should validate quantity limits', async ({ page }) => {
    await page.goto('/shop/products/test-product');

    // Try to add excessive quantity
    const quantityInput = page.locator('[data-testid="quantity-input"]');
    await quantityInput.fill('9999');

    const addButton = page.locator('[data-testid="add-to-cart-button"]');
    await addButton.click();

    // Should show error or limit quantity
    await expect(
      page.locator('text=/maximum quantity|stock limit/i')
    ).toBeVisible({ timeout: 5000 });
  });

  test('should display cart summary correctly', async ({ page }) => {
    // Set cart with known items
    await page.goto('/');
    await setGuestCart(page, [
      {
        id: 1,
        product_id: TEST_PRODUCT_ID,
        quantity: 2,
        price: '29.99',
        product: {
          id: TEST_PRODUCT_ID,
          name: 'Test Product',
          slug: 'test-product',
          price: '29.99',
        },
      },
    ]);

    // Go to cart page
    await goToCart(page);

    // Check product name is displayed
    await expect(page.locator('text=Test Product')).toBeVisible();

    // Check quantity is displayed
    await expect(page.locator('[data-testid="cart-item-quantity"]')).toHaveValue('2');

    // Check price is displayed
    await expect(page.locator('text=/29.99/i')).toBeVisible();

    // Check subtotal calculation (2 * 29.99 = 59.98)
    await expect(page.locator('text=/59.98/i')).toBeVisible();
  });
});

test.describe('Guest Cart - Multi-tenant', () => {
  test('should use correct tenant-specific localStorage key', async ({ page }) => {
    await page.goto('/');

    // Get the expected key
    const expectedKey = getGuestCartKey();
    expect(expectedKey).toMatch(/^js_cart_/);

    // Add item to cart
    await page.goto('/shop/products/test-product');
    await page.click('[data-testid="add-to-cart-button"]');
    await waitForCartUpdate(page, 1);

    // Check that the correct key is used in localStorage
    const cartData = await page.evaluate((key) => {
      return localStorage.getItem(key);
    }, expectedKey);

    expect(cartData).not.toBeNull();
  });
});

test.describe('Guest Cart - Edge Cases', () => {
  test('should handle corrupted localStorage data', async ({ page }) => {
    await page.goto('/');

    // Set corrupted data in localStorage
    const cartKey = getGuestCartKey();
    await page.evaluate((key) => {
      localStorage.setItem(key, 'corrupted-json-{invalid');
    }, cartKey);

    // Reload page
    await page.reload();

    // App should handle gracefully and show empty cart
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    if (await cartBadge.isVisible()) {
      await expect(cartBadge).toHaveText('0');
    }

    // localStorage should be cleared or reset
    const cart = await getGuestCart(page);
    expect(cart).toBeNull();
  });

  test('should handle large cart items', async ({ page }) => {
    await page.goto('/');

    // Create cart with many items
    const largeCart = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      product_id: i + 1,
      quantity: 1,
      price: '29.99',
      product: {
        id: i + 1,
        name: `Test Product ${i + 1}`,
        slug: `test-product-${i + 1}`,
        price: '29.99',
      },
    }));

    await setGuestCart(page, largeCart);

    // Go to cart page
    await goToCart(page);

    // Page should render without crashing
    await expect(page.locator('h1, h2')).toContainText(/cart/i);

    // Items should be visible (might be paginated)
    const items = page.locator('[data-testid="cart-item"]');
    await expect(items.first()).toBeVisible();
  });
});
