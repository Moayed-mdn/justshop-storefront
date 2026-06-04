/**
 * CheckoutPage — Page Object Model
 *
 * Covers the checkout entry point (cart page) and the two Stripe return pages:
 *   /checkout/success  — post-payment landing page
 *   /checkout/cancel   — cancelled payment landing page
 *
 * There is no multi-step checkout form in this app. The checkout flow is:
 *   cart page → click checkout button → backend creates Stripe session →
 *   window.location.href = session_url (Stripe hosted page) →
 *   Stripe redirects to /checkout/success?session_id=... or /checkout/cancel
 *
 * Extends BasePage so all header/cart/locale helpers are available.
 */

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Cart page checkout triggers ──────────────────────────────────────────

  /** The main checkout button inside CartSummary (desktop sidebar). */
  get checkoutButton() {
    return this.page.locator('[data-testid="cart-checkout-button"]');
  }

  /** The mobile sticky checkout button inside CartMobileCheckout. */
  get mobileCheckoutButton() {
    return this.page.locator('[data-testid="cart-mobile-checkout-button"]');
  }

  /** Cart order-summary total amount. */
  get cartTotal() {
    return this.page.locator('[data-testid="cart-summary-total"]');
  }

  /** Cart order-summary subtotal amount. */
  get cartSubtotal() {
    return this.page.locator('[data-testid="cart-summary-subtotal"]');
  }

  /** Error message shown inside CartSummary when checkout fails. */
  get checkoutError() {
    return this.page.locator('[data-testid="checkout-error"]');
  }

  // ── /checkout/success page ───────────────────────────────────────────────

  /** Spinner shown while the status API call is in-flight. */
  get successLoadingState() {
    return this.page.locator('[data-testid="checkout-success-loading"]');
  }

  /** Main success container (visible once status = 'success'). */
  get successContainer() {
    return this.page.locator('[data-testid="checkout-success-container"]');
  }

  /** Order details card on the success page. */
  get successOrderCard() {
    return this.page.locator('[data-testid="checkout-success-order"]');
  }

  /** Order number text inside the order details card. */
  get orderNumber() {
    return this.page.locator('[data-testid="checkout-order-number"]');
  }

  /** Payment status badge inside the order details card. */
  get paymentStatus() {
    return this.page.locator('[data-testid="checkout-payment-status"]');
  }

  /** "View Orders" link (visible only when authenticated). */
  get viewOrdersLink() {
    return this.page.locator('[data-testid="checkout-view-orders"]');
  }

  /** "Continue Shopping" link on the success page. */
  get successContinueShopping() {
    return this.page.locator('[data-testid="checkout-continue-shopping"]');
  }

  /** Error state container on the success page (status = 'error'). */
  get successErrorState() {
    return this.page.locator('[data-testid="checkout-error-container"]');
  }

  // ── /checkout/cancel page ────────────────────────────────────────────────

  /** Main container on the cancel page. */
  get cancelContainer() {
    return this.page.locator('[data-testid="checkout-cancel-container"]');
  }

  /** "Return to Cart" link on the cancel page. */
  get returnToCartLink() {
    return this.page.locator('[data-testid="checkout-return-to-cart"]');
  }

  /** "Continue Shopping" link on the cancel page. */
  get cancelContinueShopping() {
    return this.page.locator('[data-testid="checkout-cancel-continue-shopping"]');
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  /** Navigate to the cart page (checkout is initiated from here). */
  async gotoCart(): Promise<void> {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to the success page with a mock session_id query param.
   * The status API is mocked by mockCheckoutStatusAPI before calling this.
   */
  async gotoSuccess(sessionId = 'cs_test_mock123'): Promise<void> {
    await this.page.goto(`/checkout/success?session_id=${sessionId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Navigate to the cancel page. */
  async gotoCancel(): Promise<void> {
    await this.page.goto('/checkout/cancel');
    await this.page.waitForLoadState('networkidle');
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Click the desktop checkout button and wait for navigation or error.
   * When using mockCheckoutSessionAPI with a same-domain URL, this will
   * navigate within the app. When the real Stripe URL is returned this will
   * navigate away — use page.route to intercept.
   */
  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /** Click the mobile checkout button. */
  async clickMobileCheckout(): Promise<void> {
    await this.mobileCheckoutButton.click();
  }

  // ── Assertions ───────────────────────────────────────────────────────────

  /** Assert the cart page is loaded with the checkout button visible. */
  async assertCartReadyForCheckout(): Promise<void> {
    await expect(this.checkoutButton).toBeVisible();
    await expect(this.checkoutButton).toBeEnabled();
  }

  /** Assert the success page has fully loaded (order card visible). */
  async assertSuccessPageLoaded(): Promise<void> {
    await expect(this.successContainer).toBeVisible();
    await expect(this.successOrderCard).toBeVisible();
  }

  /** Assert a specific order number is displayed on the success page. */
  async assertOrderNumber(expected: string): Promise<void> {
    await expect(this.orderNumber).toHaveText(expected);
  }

  /** Assert a specific payment status label is displayed. */
  async assertPaymentStatus(expected: string | RegExp): Promise<void> {
    await expect(this.paymentStatus).toHaveText(expected);
  }

  /** Assert the cancel page is loaded. */
  async assertCancelPageLoaded(): Promise<void> {
    await expect(this.cancelContainer).toBeVisible();
    await expect(this.returnToCartLink).toBeVisible();
  }

  /** Assert checkout error message is shown in the cart summary. */
  async assertCheckoutError(message?: string | RegExp): Promise<void> {
    await expect(this.checkoutError).toBeVisible();
    if (message) {
      await expect(this.checkoutError).toHaveText(message);
    }
  }
}
