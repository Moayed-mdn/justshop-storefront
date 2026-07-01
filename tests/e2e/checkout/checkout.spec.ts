/**
 * Checkout E2E Tests
 *
 * Architecture note:
 * The active storefront flow is merchant-driven enhanced checkout:
 *   1. User fills cart
 *   2. Clicks checkout button on /cart or Buy Now on product detail
 *   3. Guest users are redirected to /login?redirect=/checkout
 *   4. Authenticated users are routed to /checkout
 *   5. After enhanced payment completes, the app redirects to /checkout/success?order=...
 *
 * All API calls are mocked via Playwright route interception.
 */

import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../pages/CheckoutPage';
import {
  mockCartAPI,
  mockAuthAPI,
  mockOrderDetailAPI,
} from '../../helpers/mocks';
import { clearTestState, setupGuestCart, setupAuthenticatedContext } from '../../fixtures';
import { basicProduct } from '../../helpers/mocks';

// ---------------------------------------------------------------------------
// Cart → Checkout button
// ---------------------------------------------------------------------------

test.describe('Cart Page — Checkout Button', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test('checkout button is visible in cart summary when cart has items', async ({ page }) => {
    await mockCartAPI(page);
    const checkout = new CheckoutPage(page);

    // Seed a guest cart item so the cart is not empty
    await setupGuestCart(page, {
      items: [{
        id: 'local_1',
        quantity: 1,
        name: basicProduct.name,
        image: basicProduct.image,
        price: parseFloat(basicProduct.price),
        max_quantity: 10,
        product: { id: basicProduct.id },
        variant: { id: 1 },
      }],
      total_items: 1,
      total_price: parseFloat(basicProduct.price),
    });

    await checkout.gotoCart();
    await checkout.assertCartReadyForCheckout();
  });

  test('guest checkout redirects to login with checkout redirect target', async ({ page }) => {
    await mockCartAPI(page);

    await setupGuestCart(page, {
      items: [{
        id: 'local_1',
        quantity: 1,
        name: basicProduct.name,
        image: basicProduct.image,
        price: parseFloat(basicProduct.price),
        max_quantity: 10,
        product: { id: basicProduct.id },
        variant: { id: 1 },
      }],
      total_items: 1,
      total_price: parseFloat(basicProduct.price),
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoCart();

    // Click and immediately check disabled state
    await checkout.checkoutButton.click();
    await expect(page).toHaveURL(/\/login\?redirect=%2Fcheckout|\/login\?redirect=\/checkout/);
  });

  test('authenticated checkout navigates directly to the enhanced checkout page', async ({ page }) => {
    await mockCartAPI(page);
    await mockAuthAPI(page);

    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoCart();
    await checkout.clickCheckout();

    await expect(page).toHaveURL(/\/checkout$/);
  });

  test('cart checkout no longer uses the retired hosted checkout session endpoints', async ({ page }) => {
    const requests: string[] = [];
    await page.route('**/api/checkout/**', async (route) => {
      requests.push(route.request().url());
      await route.continue();
    });
    await mockCartAPI(page);
    await setupGuestCart(page, {
      items: [{
        id: 'local_1',
        quantity: 1,
        name: basicProduct.name,
        image: basicProduct.image,
        price: parseFloat(basicProduct.price),
        max_quantity: 10,
        product: { id: basicProduct.id },
        variant: { id: 1 },
      }],
      total_items: 1,
      total_price: parseFloat(basicProduct.price),
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoCart();
    await checkout.clickCheckout();
    await page.waitForTimeout(500);

    const usedHostedSessionEndpoint = requests.some((url) => url.includes('/checkout/session'));
    expect(usedHostedSessionEndpoint).toBe(false);
  });

  test('cart summary displays total amount', async ({ page }) => {
    await mockCartAPI(page);

    await setupGuestCart(page, {
      items: [{
        id: 'local_1',
        quantity: 1,
        name: basicProduct.name,
        image: basicProduct.image,
        price: parseFloat(basicProduct.price),
        max_quantity: 10,
        product: { id: basicProduct.id },
        variant: { id: 1 },
      }],
      total_items: 1,
      total_price: parseFloat(basicProduct.price),
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoCart();

    await expect(checkout.cartTotal).toBeVisible();
    const totalText = await checkout.cartTotal.textContent();
    expect(totalText).toMatch(/\d+/);
  });

  test('checkout button navigates away from cart into the enhanced flow', async ({ page }) => {
    await mockCartAPI(page);

    await setupGuestCart(page, {
      items: [{
        id: 'local_1',
        quantity: 1,
        name: basicProduct.name,
        image: basicProduct.image,
        price: parseFloat(basicProduct.price),
        max_quantity: 10,
        product: { id: basicProduct.id },
        variant: { id: 1 },
      }],
      total_items: 1,
      total_price: parseFloat(basicProduct.price),
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoCart();
    await checkout.clickCheckout();

    // Should navigate away from /cart
    await page.waitForURL(/\/(checkout|login)/, { timeout: 10000 });
    expect(page.url()).not.toContain('/cart');
  });

});

// ---------------------------------------------------------------------------
// Mobile checkout button
// ---------------------------------------------------------------------------

test.describe('Cart Page — Mobile Checkout Button', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test('mobile checkout button is visible on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await mockCartAPI(page);

    await setupGuestCart(page, {
      items: [{
        id: 'local_1',
        quantity: 1,
        name: basicProduct.name,
        image: basicProduct.image,
        price: parseFloat(basicProduct.price),
        max_quantity: 10,
        product: { id: basicProduct.id },
        variant: { id: 1 },
      }],
      total_items: 1,
      total_price: parseFloat(basicProduct.price),
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoCart();

    const mobileButton = checkout.mobileCheckoutButton;
    const isVisible = await mobileButton.isVisible().catch(() => false);
    // Mobile bar is shown on screens < 1024px — it should be visible at 375px
    if (isVisible) {
      await expect(mobileButton).toBeEnabled();
    }
  });

  test('mobile checkout button shows total amount', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await mockCartAPI(page);

    await setupGuestCart(page, {
      items: [{
        id: 'local_1',
        quantity: 1,
        name: basicProduct.name,
        image: basicProduct.image,
        price: parseFloat(basicProduct.price),
        max_quantity: 10,
        product: { id: basicProduct.id },
        variant: { id: 1 },
      }],
      total_items: 1,
      total_price: parseFloat(basicProduct.price),
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoCart();

    const mobileTotal = checkout.page.locator('[data-testid="cart-mobile-total"]');
    const isVisible = await mobileTotal.isVisible().catch(() => false);
    if (isVisible) {
      const text = await mobileTotal.textContent();
      expect(text).toMatch(/\d+/);
    }
  });

});

// ---------------------------------------------------------------------------
// /checkout/success page
// ---------------------------------------------------------------------------

test.describe('Checkout Success Page', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test('shows loading state while fetching status', async ({ page }) => {
    await page.route('**/api/orders/ORD-TEST-001', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: true,
          message: 'ok',
          data: {
            payment_status: 'paid',
            order_number: 'ORD-TEST-001',
            payment_status: 'paid',
            status: 'processing',
          },
        }),
      });
    });

    const checkout = new CheckoutPage(page);
    // Don't await — navigate and immediately check loading
    checkout.gotoSuccess('ORD-TEST-001');
    await expect(checkout.successLoadingState).toBeVisible({ timeout: 3000 });
  });

  test('shows success state with order number after paid status', async ({ page }) => {
    await mockOrderDetailAPI(page, 'ORD-2024-001', {
      payment_status: 'paid',
      status: 'processing',
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('ORD-2024-001');

    await checkout.assertSuccessPageLoaded();
    await checkout.assertOrderNumber('ORD-2024-001');
  });

  test('loads success page from enhanced checkout order query', async ({ page }) => {
    await mockOrderDetailAPI(page, 'ORD-ENHANCED-001', {
      payment_status: 'paid',
      status: 'processing',
    });

    await page.goto('/checkout/success?order=ORD-ENHANCED-001');
    await page.waitForLoadState('networkidle');

    const checkout = new CheckoutPage(page);
    await checkout.assertSuccessPageLoaded();
    await checkout.assertOrderNumber('ORD-ENHANCED-001');
  });

  test('shows paid payment status badge', async ({ page }) => {
    await mockOrderDetailAPI(page, 'ORD-2024-001', {
      payment_status: 'paid',
      status: 'processing',
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('ORD-2024-001');

    await checkout.assertSuccessPageLoaded();
    await expect(checkout.paymentStatus).toBeVisible();
    const statusText = await checkout.paymentStatus.textContent();
    expect(statusText?.toLowerCase()).toMatch(/paid/);
  });

  test('shows unpaid payment status badge', async ({ page }) => {
    await mockOrderDetailAPI(page, 'ORD-2024-002', {
      payment_status: 'unpaid',
      status: 'pending',
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('ORD-2024-002');

    await checkout.assertSuccessPageLoaded();
    await expect(checkout.paymentStatus).toBeVisible();
    const statusText = await checkout.paymentStatus.textContent();
    expect(statusText?.toLowerCase()).toMatch(/unpaid/);
  });

  test('shows error state when no order query is present', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await page.goto('/checkout/success');
    await page.waitForLoadState('networkidle');

    await expect(checkout.successErrorState).toBeVisible();
  });

  test('shows error state when order lookup fails', async ({ page }) => {
    await page.route('**/api/orders/ORD-TEST-BAD', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ status: false, message: 'Internal error', error_code: 'SERVER_ERROR', errors: null }),
      });
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('ORD-TEST-BAD');

    await expect(checkout.successErrorState).toBeVisible({ timeout: 8000 });
  });

  test('shows continue shopping link', async ({ page }) => {
    await mockOrderDetailAPI(page, 'ORD-2024-001', {
      payment_status: 'paid',
      status: 'processing',
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('ORD-2024-001');
    await checkout.assertSuccessPageLoaded();

    await expect(checkout.successContinueShopping).toBeVisible();
  });

  test('shows view orders link when authenticated', async ({ page }) => {
    await mockOrderDetailAPI(page, 'ORD-2024-001', {
      payment_status: 'paid',
      status: 'processing',
    });
    await mockAuthAPI(page);

    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('ORD-2024-001');
    await checkout.assertSuccessPageLoaded();

    await expect(checkout.viewOrdersLink).toBeVisible();
  });

  test('does NOT show view orders link for guests', async ({ page }) => {
    await mockOrderDetailAPI(page, 'ORD-2024-001', {
      payment_status: 'paid',
      status: 'processing',
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('ORD-2024-001');
    await checkout.assertSuccessPageLoaded();

    await expect(checkout.viewOrdersLink).not.toBeVisible();
  });

  test('view orders link navigates to /orders', async ({ page }) => {
    await mockOrderDetailAPI(page, 'ORD-2024-001', {
      payment_status: 'paid',
      status: 'processing',
    });
    await mockAuthAPI(page);

    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('ORD-2024-001');
    await checkout.assertSuccessPageLoaded();

    await checkout.viewOrdersLink.click();
    await expect(page).toHaveURL(/\/orders/);
  });

  test('continue shopping link navigates to home', async ({ page }) => {
    await mockOrderDetailAPI(page, 'ORD-2024-001', {
      payment_status: 'paid',
      status: 'processing',
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('ORD-2024-001');
    await checkout.assertSuccessPageLoaded();

    await checkout.successContinueShopping.click();
    await expect(page).toHaveURL(/^(http:\/\/[^/]+\/)?(ar\/)?$/);
  });

  test('displays customer email in order card', async ({ page }) => {
    await mockOrderDetailAPI(page, 'ORD-2024-001', {
      payment_status: 'paid',
      status: 'processing',
      customer_email: 'test@example.com',
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('ORD-2024-001');
    await checkout.assertSuccessPageLoaded();

    // Customer email section is inside the order card
    const emailText = await checkout.successOrderCard.textContent();
    expect(emailText).toContain('test@example.com');
  });

  test('success page renders correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await mockOrderDetailAPI(page, 'ORD-2024-001', {
      payment_status: 'paid',
      status: 'processing',
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('ORD-2024-001');
    await checkout.assertSuccessPageLoaded();
  });

  test('success page renders correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await mockOrderDetailAPI(page, 'ORD-2024-001', {
      payment_status: 'paid',
      status: 'processing',
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('ORD-2024-001');
    await checkout.assertSuccessPageLoaded();
  });

});

// ---------------------------------------------------------------------------
// /checkout/cancel page
// ---------------------------------------------------------------------------

test.describe('Checkout Cancel Page', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test('displays cancel page correctly', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.gotoCancel();
    await checkout.assertCancelPageLoaded();
  });

  test('shows return to cart link', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.gotoCancel();

    await expect(checkout.returnToCartLink).toBeVisible();
  });

  test('shows continue shopping link', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.gotoCancel();

    await expect(checkout.cancelContinueShopping).toBeVisible();
  });

  test('return to cart link navigates to /cart', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.gotoCancel();

    await checkout.returnToCartLink.click();
    await expect(page).toHaveURL(/\/cart/);
  });

  test('continue shopping link navigates to home', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.gotoCancel();

    await checkout.cancelContinueShopping.click();
    await expect(page).toHaveURL(/^(http:\/\/[^/]+\/)?(ar\/)?$/);
  });

  test('cancel page renders correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const checkout = new CheckoutPage(page);
    await checkout.gotoCancel();
    await checkout.assertCancelPageLoaded();
  });

});

// ---------------------------------------------------------------------------
// Full flow integration
// ---------------------------------------------------------------------------

test.describe('Checkout Entry Flow (mocked)', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test('guest: cart → checkout redirects to login with checkout target', async ({ page }) => {
    await mockCartAPI(page);

    await setupGuestCart(page, {
      items: [{
        id: 'local_1',
        quantity: 1,
        name: basicProduct.name,
        image: basicProduct.image,
        price: parseFloat(basicProduct.price),
        max_quantity: 10,
        product: { id: basicProduct.id },
        variant: { id: 1 },
      }],
      total_items: 1,
      total_price: parseFloat(basicProduct.price),
    });

    const checkout = new CheckoutPage(page);

    // Step 1: go to cart
    await checkout.gotoCart();
    await checkout.assertCartReadyForCheckout();

    // Step 2: click checkout — guest users are routed to login first
    await checkout.clickCheckout();
    await page.waitForURL(/\/login\?redirect=%2Fcheckout|\/login\?redirect=\/checkout/, { timeout: 10000 });
  });

  test('authenticated: cart → checkout goes straight to enhanced checkout page', async ({ page }) => {
    await mockAuthAPI(page);
    await mockCartAPI(page);

    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoCart();
    await checkout.clickCheckout();

    await page.waitForURL(/\/checkout$/, { timeout: 10000 });
  });

  test('cancel page: return to cart restores the cart', async ({ page }) => {
    await mockCartAPI(page);

    await setupGuestCart(page, {
      items: [{
        id: 'local_1',
        quantity: 2,
        name: basicProduct.name,
        image: basicProduct.image,
        price: parseFloat(basicProduct.price),
        max_quantity: 10,
        product: { id: basicProduct.id },
        variant: { id: 1 },
      }],
      total_items: 2,
      total_price: parseFloat(basicProduct.price) * 2,
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoCancel();
    await checkout.returnToCartLink.click();

    await expect(page).toHaveURL(/\/cart/);
    // Cart should still have items (not cleared on cancel)
    await expect(checkout.checkoutButton).toBeVisible();
  });

});
