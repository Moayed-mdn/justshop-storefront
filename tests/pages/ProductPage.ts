/**
 * Product Detail Page Object Model
 * 
 * Page Object for /shop/products/{slug}
 * Based on actual product page implementation
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {

  // Product information
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly salePrice: Locator;
  readonly productDescription: Locator;
  readonly productImage: Locator;
  readonly imageGallery: Locator;

  // Stock information
  readonly inStockBadge: Locator;
  readonly outOfStockBadge: Locator;
  readonly lowStockWarning: Locator;

  // Variant selection
  readonly variantSelect: Locator;
  readonly sizeOptions: Locator;
  readonly colorOptions: Locator;

  // Quantity
  readonly quantityInput: Locator;
  readonly quantityDecrease: Locator;
  readonly quantityIncrease: Locator;

  // Actions
  readonly addToCartButton: Locator;
  readonly buyNowButton: Locator;

  // Messages
  readonly successNotification: Locator;
  readonly errorNotification: Locator;

  // Breadcrumb
  readonly breadcrumb: Locator;

  // Category
  readonly categoryLink: Locator;

  constructor(page: Page) {
    super(page);

    // Product information
    this.productName = page.locator('[data-testid="product-name"], h1');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.salePrice = page.locator('[data-testid="sale-price"]');
    this.productDescription = page.locator('[data-testid="product-description"]');
    this.productImage = page.locator('[data-testid="product-image"]');
    this.imageGallery = page.locator('[data-testid="image-gallery"]');

    // Stock information
    this.inStockBadge = page.locator('[data-testid="in-stock-badge"], text=/in stock/i');
    this.outOfStockBadge = page.locator('[data-testid="out-of-stock-badge"], text=/out of stock/i');
    this.lowStockWarning = page.locator('[data-testid="low-stock-warning"], text=/only.*left/i');

    // Variant selection
    this.variantSelect = page.locator('[data-testid="variant-select"]');
    this.sizeOptions = page.locator('[data-testid="size-option"]');
    this.colorOptions = page.locator('[data-testid="color-option"]');

    // Quantity
    this.quantityInput = page.locator('[data-testid="quantity-input"], input[name="quantity"]');
    this.quantityDecrease = page.locator('[data-testid="quantity-decrease"]');
    this.quantityIncrease = page.locator('[data-testid="quantity-increase"]');

    // Actions
    this.addToCartButton = page.locator('[data-testid="add-to-cart-button"]');
    this.buyNowButton = page.locator('[data-testid="buy-now-button"]');

    // Messages
    this.successNotification = page.locator('[data-testid="cart-success-notification"], [role="status"]');
    this.errorNotification = page.locator('[data-testid="error-notification"], [role="alert"]');

    // Breadcrumb
    this.breadcrumb = page.locator('[data-testid="breadcrumb"], nav[aria-label="Breadcrumb"]');

    // Category
    this.categoryLink = page.locator('[data-testid="category-link"]');
  }

  /**
   * Navigate to product page by slug
   */
  async goto(slug: string) {
    await this.page.goto(`/shop/products/${slug}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get product name
   */
  async getProductName(): Promise<string> {
    return await this.productName.textContent() || '';
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  /**
   * Check if product is on sale
   */
  async isOnSale(): Promise<boolean> {
    return await this.salePrice.isVisible();
  }

  /**
   * Check if product is in stock
   */
  async isInStock(): Promise<boolean> {
    return await this.inStockBadge.isVisible();
  }

  /**
   * Check if product is out of stock
   */
  async isOutOfStock(): Promise<boolean> {
    return await this.outOfStockBadge.isVisible();
  }

  /**
   * Check if product has low stock warning
   */
  async hasLowStockWarning(): Promise<boolean> {
    return await this.lowStockWarning.isVisible();
  }

  /**
   * Set quantity
   */
  async setQuantity(quantity: number) {
    await this.quantityInput.fill(String(quantity));
  }

  /**
   * Increase quantity
   */
  async increaseQuantity() {
    await this.quantityIncrease.click();
  }

  /**
   * Decrease quantity
   */
  async decreaseQuantity() {
    await this.quantityDecrease.click();
  }

  /**
   * Get current quantity
   */
  async getQuantity(): Promise<number> {
    const value = await this.quantityInput.inputValue();
    return parseInt(value, 10);
  }

  /**
   * Select variant by value
   */
  async selectVariant(variantId: number | string) {
    await this.variantSelect.selectOption(String(variantId));
  }

  /**
   * Select size (if size options exist)
   */
  async selectSize(size: string) {
    const sizeOption = this.page.locator(`[data-testid="size-option"][data-value="${size}"]`);
    await sizeOption.click();
  }

  /**
   * Select color (if color options exist)
   */
  async selectColor(color: string) {
    const colorOption = this.page.locator(`[data-testid="color-option"][data-value="${color}"]`);
    await colorOption.click();
  }

  /**
   * Add product to cart
   */
  async addToCart() {
    await this.addToCartButton.click();
  }

  /**
   * Wait for success notification
   */
  async waitForAddToCartSuccess() {
    await this.successNotification.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Wait for error notification
   */
  async waitForAddToCartError() {
    await this.errorNotification.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Add to cart and wait for success
   */
  async addToCartAndWait(quantity?: number) {
    if (quantity) {
      await this.setQuantity(quantity);
    }

    await this.addToCart();
    await this.waitForAddToCartSuccess();
  }

  /**
   * Buy now (if available)
   */
  async buyNow() {
    await this.buyNowButton.click();
    // Should redirect to checkout
    await this.page.waitForURL(/\/shop\/checkout/);
  }

  /**
   * Click product image to view gallery
   */
  async viewImageGallery() {
    await this.productImage.click();
  }

  /**
   * Navigate to category
   */
  async goToCategory() {
    await this.categoryLink.click();
  }

  /**
   * Assert page loaded correctly
   */
  async assertPageLoaded() {
    await expect(this.productName).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productImage).toBeVisible();
  }

  /**
   * Assert product details are displayed
   */
  async assertProductDetails(expectedName: string, expectedPrice: string) {
    await expect(this.productName).toHaveText(expectedName);
    await expect(this.productPrice).toContainText(expectedPrice);
  }

  /**
   * Assert add to cart button is enabled
   */
  async assertCanAddToCart() {
    await expect(this.addToCartButton).toBeEnabled();
    await expect(this.inStockBadge).toBeVisible();
  }

  /**
   * Assert add to cart button is disabled (out of stock)
   */
  async assertCannotAddToCart() {
    await expect(this.addToCartButton).toBeDisabled();
    await expect(this.outOfStockBadge).toBeVisible();
  }

  /**
   * Assert sale price is shown
   */
  async assertOnSale(regularPrice: string, salePrice: string) {
    await expect(this.productPrice).toContainText(regularPrice);
    await expect(this.salePrice).toContainText(salePrice);
  }

  /**
   * Assert breadcrumb contains expected items
   */
  async assertBreadcrumb(items: string[]) {
    for (const item of items) {
      await expect(this.breadcrumb).toContainText(item);
    }
  }
}
