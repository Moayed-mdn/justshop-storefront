/**
 * Cart Page Object Model
 * 
 * Page Object for /cart
 * Based on actual cart page implementation with data-testid attributes
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {

  // Cart items
  readonly cartItemsList: Locator;
  readonly cartItems: Locator;
  readonly cartItem: Locator;

  // Item elements
  readonly itemImage: Locator;
  readonly itemName: Locator;
  readonly itemQuantity: Locator;
  readonly itemQuantityIncrease: Locator;
  readonly itemQuantityDecrease: Locator;
  readonly itemRemove: Locator;
  readonly itemSubtotal: Locator;

  // Cart summary
  readonly cartSummary: Locator;
  readonly cartSubtotal: Locator;
  readonly cartTotal: Locator;
  readonly checkoutButton: Locator;
  readonly clearCartButton: Locator;

  // Empty state
  readonly emptyCartMessage: Locator;
  readonly continueShoppingButton: Locator;

  // Mobile
  readonly mobileCheckout: Locator;
  readonly mobileCheckoutButton: Locator;
  readonly mobileTotal: Locator;

  // Clear modal
  readonly clearModal: Locator;
  readonly clearModalCancel: Locator;
  readonly clearModalConfirm: Locator;

  constructor(page: Page) {
    super(page);

    // Cart items list
    this.cartItemsList = page.locator('[data-testid="cart-items-list"]');
    this.cartItems = page.locator('[data-testid="cart-item"]');
    this.cartItem = this.cartItems.first();

    // Item elements
    this.itemImage = page.locator('[data-testid="cart-item-image"]');
    this.itemName = page.locator('[data-testid="cart-item-name"]');
    this.itemQuantity = page.locator('[data-testid="cart-item-quantity"]');
    this.itemQuantityIncrease = page.locator('[data-testid="cart-item-quantity-increment"]');
    this.itemQuantityDecrease = page.locator('[data-testid="cart-item-quantity-decrement"]');
    this.itemRemove = page.locator('[data-testid="cart-item-remove"]');
    this.itemSubtotal = page.locator('[data-testid="cart-item-subtotal"]');

    // Cart summary
    this.cartSummary = page.locator('[data-testid="cart-summary"]');
    this.cartSubtotal = page.locator('[data-testid="cart-subtotal"]');
    this.cartTotal = page.locator('[data-testid="cart-total"]');
    this.checkoutButton = page.locator('[data-testid="cart-checkout-button"]');
    this.clearCartButton = page.locator('[data-testid="cart-clear-button"]');

    // Empty state
    this.emptyCartMessage = page.locator('[data-testid="cart-empty-message"]');
    this.continueShoppingButton = page.locator('a[href*="/shop"], button:has-text("Continue Shopping")');

    // Mobile
    this.mobileCheckout = page.locator('[data-testid="cart-mobile-checkout"]');
    this.mobileCheckoutButton = page.locator('[data-testid="cart-mobile-checkout-button"]');
    this.mobileTotal = page.locator('[data-testid="cart-mobile-total"]');

    // Clear modal
    this.clearModal = page.locator('[data-testid="cart-clear-modal"]');
    this.clearModalCancel = page.locator('[data-testid="cart-clear-modal-cancel"]');
    this.clearModalConfirm = page.locator('[data-testid="cart-clear-modal-confirm"]');
  }

  /**
   * Navigate to cart page
   */
  async goto() {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get number of items in cart
   */
  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get cart total text
   */
  async getTotalText(): Promise<string> {
    return await this.cartTotal.textContent() || '';
  }

  /**
   * Get cart subtotal text
   */
  async getSubtotalText(): Promise<string> {
    return await this.cartSubtotal.textContent() || '';
  }

  /**
   * Increase quantity of first item
   */
  async increaseQuantity(itemIndex = 0) {
    await this.itemQuantityIncrease.nth(itemIndex).click();
    await this.page.waitForTimeout(500); // Wait for update
  }

  /**
   * Decrease quantity of first item
   */
  async decreaseQuantity(itemIndex = 0) {
    await this.itemQuantityDecrease.nth(itemIndex).click();
    await this.page.waitForTimeout(500); // Wait for update
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemIndex = 0) {
    await this.itemRemove.nth(itemIndex).click();
    await this.page.waitForTimeout(500); // Wait for removal
  }

  /**
   * Clear entire cart
   */
  async clearCart() {
    await this.clearCartButton.click();

    // Wait for modal and confirm
    await this.clearModal.waitFor({ state: 'visible' });
    await this.clearModalConfirm.click();
    await this.clearModal.waitFor({ state: 'hidden' });
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForURL(/\/checkout/);
  }

  /**
   * Proceed to checkout via mobile button
   */
  async proceedToCheckoutMobile() {
    await this.mobileCheckoutButton.click();
    await this.page.waitForURL(/\/checkout/);
  }

  /**
   * Assert cart page is displayed
   */
  async assertPageLoaded() {
    await expect(this.page).toHaveURL(/\/cart/);
    
    // Either cart items or empty message should be visible
    const hasItems = await this.cartItems.count() > 0;
    const isEmpty = await this.emptyCartMessage.isVisible();
    
    expect(hasItems || isEmpty).toBeTruthy();
  }

  /**
   * Assert cart is empty
   */
  async assertEmptyState() {
    await expect(this.emptyCartMessage).toBeVisible();
    await expect(this.emptyCartMessage).toContainText(/empty|no items/i);
    
    // Cart items should not be visible
    const itemCount = await this.cartItems.count();
    expect(itemCount).toBe(0);
  }

  /**
   * Assert cart has specific number of items
   */
  async assertItemCount(expectedCount: number) {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  /**
   * Assert cart total matches expected value
   */
  async assertTotal(expectedTotal: string) {
    await expect(this.cartTotal).toContainText(expectedTotal);
  }

  /**
   * Assert cart subtotal matches expected value
   */
  async assertSubtotal(expectedSubtotal: string) {
    await expect(this.cartSubtotal).toContainText(expectedSubtotal);
  }

  /**
   * Assert item is displayed in cart
   */
  async assertItemDisplayed(productName: string) {
    await expect(this.itemName.filter({ hasText: productName })).toBeVisible();
  }

  /**
   * Assert checkout button is visible and enabled
   */
  async assertCheckoutAvailable() {
    await expect(this.checkoutButton).toBeVisible();
    await expect(this.checkoutButton).toBeEnabled();
  }

  /**
   * Assert checkout button is not visible
   */
  async assertCheckoutNotAvailable() {
    await expect(this.checkoutButton).not.toBeVisible();
  }
}
