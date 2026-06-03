/**
 * Cart Testing Helpers
 * 
 * Utilities for cart testing in JustShop Frontend.
 * Based on actual cart implementation in app/stores/cart.ts
 */

import { Page, expect } from '@playwright/test';
import type { CartState, CartItem } from './types';

/**
 * Get tenant ID from environment or default
 */
function getTenantId(): string {
  return process.env.TEST_TENANT_ID || 'demo';
}

/**
 * Get guest cart localStorage key
 * Based on actual implementation: js_cart_{tenantId}
 */
export function getGuestCartKey(): string {
  return `js_cart_${getTenantId()}`;
}

/**
 * Add item to cart via UI
 * Uses product detail page "Add to Cart" button
 */
export async function addToCartViaUI(
  page: Page,
  productSlug: string,
  options?: {
    quantity?: number;
    variantId?: number;
  }
) {
  const { quantity = 1, variantId } = options || {};

  // Navigate to product page
  await page.goto(`/shop/products/${productSlug}`);

  // Select variant if provided
  if (variantId) {
    await page.selectOption('[data-testid="variant-select"]', String(variantId));
  }

  // Set quantity if not 1
  if (quantity !== 1) {
    await page.fill('[data-testid="quantity-input"]', String(quantity));
  }

  // Click add to cart button
  const addToCartButton = page.locator('[data-testid="add-to-cart-button"]');
  await addToCartButton.click();

  // Wait for success notification or cart update
  await page.waitForSelector('[data-testid="cart-success-notification"]', {
    timeout: 5000,
  });
}

/**
 * Add item to cart via API
 * Uses actual API route: POST /api/cart/items
 * 
 * This is faster than UI interaction for test setup.
 */
export async function addToCartViaAPI(
  page: Page,
  productId: number,
  options?: {
    quantity?: number;
    variantId?: number;
  }
): Promise<CartState> {
  const { quantity = 1, variantId } = options || {};

  const response = await page.request.post('/api/cart/items', {
    data: {
      product_id: productId,
      quantity,
      ...(variantId && { variant_id: variantId }),
    },
  });

  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(data).toHaveProperty('cart');

  return data.cart;
}

/**
 * Update cart item quantity via API
 * Uses actual API route: PUT /api/cart/items/{id}
 */
export async function updateCartItemViaAPI(
  page: Page,
  itemId: number,
  quantity: number
): Promise<CartState> {
  const response = await page.request.put(`/api/cart/items/${itemId}`, {
    data: { quantity },
  });

  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  return data.cart;
}

/**
 * Remove item from cart via API
 * Uses actual API route: DELETE /api/cart/items/{id}
 */
export async function removeCartItemViaAPI(
  page: Page,
  itemId: number
): Promise<CartState> {
  const response = await page.request.delete(`/api/cart/items/${itemId}`);

  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  return data.cart;
}

/**
 * Clear entire cart via API
 * Uses actual API route: DELETE /api/cart
 */
export async function clearCartViaAPI(page: Page): Promise<void> {
  const response = await page.request.delete('/api/cart');
  expect(response.ok()).toBeTruthy();
}

/**
 * Get cart state via API
 * Uses actual API route: GET /api/cart
 */
export async function getCartViaAPI(page: Page): Promise<CartState> {
  const response = await page.request.get('/api/cart');
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  return data.cart;
}

/**
 * Get guest cart from localStorage
 * Based on actual implementation in app/stores/cart.ts
 */
export async function getGuestCart(page: Page): Promise<CartItem[] | null> {
  const cartKey = getGuestCartKey();
  const cartJson = await page.evaluate((key) => {
    return localStorage.getItem(key);
  }, cartKey);

  if (!cartJson) {
    return null;
  }

  try {
    return JSON.parse(cartJson);
  } catch {
    return null;
  }
}

/**
 * Set guest cart in localStorage
 * Useful for test setup
 */
export async function setGuestCart(page: Page, items: CartItem[]): Promise<void> {
  const cartKey = getGuestCartKey();
  await page.evaluate(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key: cartKey, value: items }
  );
}

/**
 * Clear guest cart from localStorage
 */
export async function clearGuestCart(page: Page): Promise<void> {
  const cartKey = getGuestCartKey();
  await page.evaluate((key) => {
    localStorage.removeItem(key);
  }, cartKey);
}

/**
 * Wait for cart to update
 * Waits for cart badge count to update
 */
export async function waitForCartUpdate(
  page: Page,
  expectedCount: number,
  timeout = 5000
) {
  await page.waitForFunction(
    (count) => {
      const badge = document.querySelector('[data-testid="cart-badge"]');
      if (!badge) return false;
      const badgeText = badge.textContent || '0';
      return parseInt(badgeText, 10) === count;
    },
    expectedCount,
    { timeout }
  );
}

/**
 * Assert cart has specific number of items
 */
export async function assertCartItemCount(page: Page, expectedCount: number) {
  const cart = await getCartViaAPI(page);
  expect(cart.itemCount).toBe(expectedCount);
  expect(cart.items).toHaveLength(expectedCount);
}

/**
 * Assert cart contains specific product
 */
export async function assertCartContainsProduct(
  page: Page,
  productId: number,
  expectedQuantity?: number
) {
  const cart = await getCartViaAPI(page);
  const item = cart.items.find((i) => i.product_id === productId);

  expect(item).toBeDefined();

  if (expectedQuantity !== undefined) {
    expect(item?.quantity).toBe(expectedQuantity);
  }
}

/**
 * Assert cart is empty
 */
export async function assertCartEmpty(page: Page) {
  const cart = await getCartViaAPI(page);
  expect(cart.items).toHaveLength(0);
  expect(cart.itemCount).toBe(0);
}

/**
 * Navigate to cart page
 */
export async function goToCart(page: Page) {
  await page.goto('/shop/cart');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to checkout page
 */
export async function goToCheckout(page: Page) {
  await page.goto('/shop/checkout');
  await page.waitForLoadState('networkidle');
}

/**
 * Open cart drawer/sidebar (if exists)
 */
export async function openCartDrawer(page: Page) {
  const cartButton = page.locator('[data-testid="cart-button"]');
  await cartButton.click();
  await page.waitForSelector('[data-testid="cart-drawer"]', {
    state: 'visible',
  });
}

/**
 * Close cart drawer/sidebar (if exists)
 */
export async function closeCartDrawer(page: Page) {
  const closeButton = page.locator('[data-testid="cart-drawer-close"]');
  await closeButton.click();
  await page.waitForSelector('[data-testid="cart-drawer"]', {
    state: 'hidden',
  });
}
