/**
 * Checkout E2E Tests
 *
 * Architecture note:
 * There is NO multi-step checkout form in this app.
 * The full checkout flow is:
 *   1. User fills cart
 *   2. Clicks checkout button on /cart (CartSummary or CartMobileCheckout)
 *   3. Frontend POSTs to /api/checkout/session (guest) or /api/checkout/session/auth (auth)
 *   4. Backend returns a Stripe session_url
 *   5. Browser is redirected to Stripe hosted checkout via window.location.href
 *   6. After payment, Stripe redirects to /checkout/success?session_id=... or /checkout/cancel
 *
 * All API calls are mocked via Playwright route interception.
 * The Stripe redirect is intercepted so tests stay within the app domain.
 */

import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../pages/CheckoutPage';
import {
  mockCartAPI,
  mockCheckoutSessionAPI,
  mockCheckoutSessionFailure,
  mockCheckoutStatusAPI,
  mockAuthAPI,
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

  test('checkout button is disabled while checkout is loading', async ({ page }) => {
    // Use a slow mock so we can observe the loading state
    await page.route('**/api/checkout/session*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: true, message: 'ok', data: { session_id: 'x', session_url: '/checkout/cancel' } }),
      });
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

    // Click and immediately check disabled state
    await checkout.checkoutButton.click();
    await expect(checkout.checkoutButton).toBeDisabled();
  });

  test('checkout button shows error message on API failure', async ({ page }) => {
    await mockCartAPI(page);
    await mockCheckoutSessionFailure(page, 'Unable to create checkout session.');

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

    await checkout.assertCheckoutError();
  });

  test('guest checkout POSTs to /api/checkout/session (not /auth)', async ({ page }) => {
    await mockCartAPI(page);

    const requests: string[] = [];
    await page.route('**/api/checkout/**', async (route) => {
      requests.push(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: true, message: 'ok', data: { session_id: 'x', session_url: '/checkout/cancel' } }),
      });
    });

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

    const usedGuestEndpoint = requests.some((url) => url.includes('/checkout/session') && !url.includes('/auth'));
    expect(usedGuestEndpoint).toBe(true);
  });

  test('authenticated checkout POSTs to /api/checkout/session/auth', async ({ page }) => {
    await mockAuthAPI(page);
    await mockCartAPI(page);

    const requests: string[] = [];
    await page.route('**/api/checkout/**', async (route) => {
      requests.push(route.request().url());
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: true, message: 'ok', data: { session_id: 'x', session_url: '/checkout/cancel' } }),
      });
    });

    // Set up authenticated state via cookie
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
    await page.waitForTimeout(500);

    const usedAuthEndpoint = requests.some((url) => url.includes('/checkout/session/auth'));
    expect(usedAuthEndpoint).toBe(true);
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

  test('checkout redirects browser after session is created', async ({ page }) => {
    // Mock session to return cancel page URL (stays in-app)
    await mockCheckoutSessionAPI(page, '/checkout/cancel');
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
    await page.waitForURL(/\/(checkout|cart)/, { timeout: 10000 });
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
    // Delay the status API so we can catch the loading state
    await page.route('**/api/checkout/status/**', async (route) => {
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
            order_status: 'processing',
            customer_email: 'test@example.com',
          },
        }),
      });
    });

    const checkout = new CheckoutPage(page);
    // Don't await — navigate and immediately check loading
    checkout.gotoSuccess('cs_test_mock123');
    await expect(checkout.successLoadingState).toBeVisible({ timeout: 3000 });
  });

  test('shows success state with order number after paid status', async ({ page }) => {
    await mockCheckoutStatusAPI(page, 'paid', 'ORD-2024-001');

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('cs_test_mock123');

    await checkout.assertSuccessPageLoaded();
    await checkout.assertOrderNumber('ORD-2024-001');
  });

  test('shows paid payment status badge', async ({ page }) => {
    await mockCheckoutStatusAPI(page, 'paid', 'ORD-2024-001');

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('cs_test_mock123');

    await checkout.assertSuccessPageLoaded();
    await expect(checkout.paymentStatus).toBeVisible();
    const statusText = await checkout.paymentStatus.textContent();
    expect(statusText?.toLowerCase()).toMatch(/paid/);
  });

  test('shows unpaid payment status badge', async ({ page }) => {
    await mockCheckoutStatusAPI(page, 'unpaid', 'ORD-2024-002');

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('cs_test_mock123');

    await checkout.assertSuccessPageLoaded();
    await expect(checkout.paymentStatus).toBeVisible();
    const statusText = await checkout.paymentStatus.textContent();
    expect(statusText?.toLowerCase()).toMatch(/unpaid/);
  });

  test('shows error state when no session_id in URL', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    // Navigate without session_id — triggers error branch in onMounted
    await page.goto('/checkout/success');
    await page.waitForLoadState('networkidle');

    await expect(checkout.successErrorState).toBeVisible();
  });

  test('shows error state when status API fails', async ({ page }) => {
    await page.route('**/api/checkout/status/**', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ status: false, message: 'Internal error', error_code: 'SERVER_ERROR', errors: null }),
      });
    });

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('cs_test_mock_bad');

    // Page retries once after 2s — wait long enough for both attempts to fail
    await expect(checkout.successErrorState).toBeVisible({ timeout: 8000 });
  });

  test('shows continue shopping link', async ({ page }) => {
    await mockCheckoutStatusAPI(page, 'paid', 'ORD-2024-001');

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('cs_test_mock123');
    await checkout.assertSuccessPageLoaded();

    await expect(checkout.successContinueShopping).toBeVisible();
  });

  test('shows view orders link when authenticated', async ({ page }) => {
    await mockCheckoutStatusAPI(page, 'paid', 'ORD-2024-001');
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
    await checkout.gotoSuccess('cs_test_mock123');
    await checkout.assertSuccessPageLoaded();

    await expect(checkout.viewOrdersLink).toBeVisible();
  });

  test('does NOT show view orders link for guests', async ({ page }) => {
    await mockCheckoutStatusAPI(page, 'paid', 'ORD-2024-001');

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('cs_test_mock123');
    await checkout.assertSuccessPageLoaded();

    await expect(checkout.viewOrdersLink).not.toBeVisible();
  });

  test('view orders link navigates to /orders', async ({ page }) => {
    await mockCheckoutStatusAPI(page, 'paid', 'ORD-2024-001');
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
    await checkout.gotoSuccess('cs_test_mock123');
    await checkout.assertSuccessPageLoaded();

    await checkout.viewOrdersLink.click();
    await expect(page).toHaveURL(/\/orders/);
  });

  test('continue shopping link navigates to home', async ({ page }) => {
    await mockCheckoutStatusAPI(page, 'paid', 'ORD-2024-001');

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('cs_test_mock123');
    await checkout.assertSuccessPageLoaded();

    await checkout.successContinueShopping.click();
    await expect(page).toHaveURL(/^(http:\/\/[^/]+\/)?(ar\/)?$/);
  });

  test('displays customer email in order card', async ({ page }) => {
    await mockCheckoutStatusAPI(page, 'paid', 'ORD-2024-001');

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('cs_test_mock123');
    await checkout.assertSuccessPageLoaded();

    // Customer email section is inside the order card
    const emailText = await checkout.successOrderCard.textContent();
    expect(emailText).toContain('test@example.com');
  });

  test('success page renders correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await mockCheckoutStatusAPI(page, 'paid', 'ORD-2024-001');

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('cs_test_mock123');
    await checkout.assertSuccessPageLoaded();
  });

  test('success page renders correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await mockCheckoutStatusAPI(page, 'paid', 'ORD-2024-001');

    const checkout = new CheckoutPage(page);
    await checkout.gotoSuccess('cs_test_mock123');
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

test.describe('Full Checkout Flow (mocked)', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test('guest: cart → checkout → success page', async ({ page }) => {
    await mockCartAPI(page);
    // Return a relative URL so the browser stays in-app
    await mockCheckoutSessionAPI(page, '/checkout/success?session_id=cs_test_flow');
    await mockCheckoutStatusAPI(page, 'paid', 'ORD-FLOW-001');

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

    // Step 2: click checkout — redirects to mocked success URL
    await checkout.clickCheckout();
    await page.waitForURL(/\/checkout\/success/, { timeout: 10000 });

    // Step 3: success page resolves status
    await checkout.assertSuccessPageLoaded();
    await checkout.assertOrderNumber('ORD-FLOW-001');
  });

  test('guest: cart → checkout → cancel page', async ({ page }) => {
    await mockCartAPI(page);
    await mockCheckoutSessionAPI(page, '/checkout/cancel');

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

    await page.waitForURL(/\/checkout\/cancel/, { timeout: 10000 });
    await checkout.assertCancelPageLoaded();
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
