/**
 * Product Listing Page Object Model
 * 
 * Page Object for product listing/category pages
 * Based on actual product grid and search implementation
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductListingPage extends BasePage {

  // Product grid
  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly noResultsMessage: Locator;
  readonly loadingSkeleton: Locator;

  // Product card elements
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productImages: Locator;
  readonly addToCartButtons: Locator;

  // Filters & Sort (if exists)
  readonly categoryFilter: Locator;
  readonly priceFilter: Locator;
  readonly sortDropdown: Locator;
  readonly clearFiltersButton: Locator;

  // Pagination (if exists)
  readonly paginationContainer: Locator;
  readonly nextPageButton: Locator;
  readonly prevPageButton: Locator;
  readonly pageNumbers: Locator;

  // View toggle (if exists)
  readonly gridViewButton: Locator;
  readonly listViewButton: Locator;

  // Results info
  readonly resultsCount: Locator;
  readonly resultsText: Locator;

  constructor(page: Page) {
    super(page);

    // Product grid
    this.productGrid = page.locator('[data-testid="product-grid"]');
    this.productCards = page.locator('[data-testid="product-card"]');
    this.noResultsMessage = page.locator('[data-testid="product-no-results"]');
    this.loadingSkeleton = page.locator('[data-testid="product-card-skeleton"]');

    // Product card elements
    this.productNames = page.locator('[data-testid="product-card-name"]');
    this.productPrices = page.locator('[data-testid="product-card-price"]');
    this.productImages = page.locator('[data-testid="product-card-image"]');
    this.addToCartButtons = page.locator('[data-testid="product-card-add-to-cart"]');

    // Filters & Sort
    this.categoryFilter = page.locator('[data-testid="category-filter"]');
    this.priceFilter = page.locator('[data-testid="price-filter"]');
    this.sortDropdown = page.locator('[data-testid="sort-dropdown"], select[name="sort"]');
    this.clearFiltersButton = page.locator('[data-testid="clear-filters"], button:has-text("Clear")');

    // Pagination
    this.paginationContainer = page.locator('[data-testid="pagination"], nav[aria-label*="pagination" i]');
    this.nextPageButton = page.locator('[data-testid="next-page"], button:has-text("Next")');
    this.prevPageButton = page.locator('[data-testid="prev-page"], button:has-text("Previous")');
    this.pageNumbers = page.locator('[data-testid="page-number"]');

    // View toggle
    this.gridViewButton = page.locator('[data-testid="grid-view-button"]');
    this.listViewButton = page.locator('[data-testid="list-view-button"]');

    // Results info
    this.resultsCount = page.locator('[data-testid="results-count"]');
    this.resultsText = page.locator('text=/showing.*results/i');
  }

  /**
   * Navigate to product listing/search page
   */
  async goto(query?: string) {
    if (query) {
      await this.page.goto(`/search?q=${encodeURIComponent(query)}`);
    } else {
      await this.page.goto('/search');
    }
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to category page
   */
  async gotoCategory(categorySlug: string) {
    await this.page.goto(`/category/${categorySlug}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get number of products displayed
   */
  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  /**
   * Get product names
   */
  async getProductNames(): Promise<string[]> {
    const names: string[] = [];
    const count = await this.productNames.count();
    for (let i = 0; i < count; i++) {
      const name = await this.productNames.nth(i).textContent();
      if (name) names.push(name.trim());
    }
    return names;
  }

  /**
   * Click on product card by index
   */
  async clickProduct(index: number = 0) {
    await this.productCards.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on product by name
   */
  async clickProductByName(name: string) {
    await this.page.locator(`[data-testid="product-card-name"]:has-text("${name}")`).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add product to cart from listing by index
   */
  async addToCartFromListing(index: number = 0) {
    await this.addToCartButtons.nth(index).click();
    await this.waitForCartUpdate();
  }

  /**
   * Filter by category
   */
  async filterByCategory(categoryName: string) {
    await this.categoryFilter.selectOption(categoryName);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filter by price range
   */
  async filterByPrice(min: string, max: string) {
    await this.page.locator('[data-testid="price-min"], input[name="price_min"]').fill(min);
    await this.page.locator('[data-testid="price-max"], input[name="price_max"]').fill(max);
    await this.page.locator('[data-testid="apply-price-filter"], button:has-text("Apply")').click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Sort products
   */
  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear all filters
   */
  async clearFilters() {
    if (await this.clearFiltersButton.isVisible()) {
      await this.clearFiltersButton.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Go to next page
   */
  async goToNextPage() {
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Go to previous page
   */
  async goToPrevPage() {
    await this.prevPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Go to specific page
   */
  async goToPage(pageNumber: number) {
    await this.page.locator(`[data-testid="page-number"]:has-text("${pageNumber}")`).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to grid view
   */
  async switchToGridView() {
    if (await this.gridViewButton.isVisible()) {
      await this.gridViewButton.click();
    }
  }

  /**
   * Switch to list view
   */
  async switchToListView() {
    if (await this.listViewButton.isVisible()) {
      await this.listViewButton.click();
    }
  }

  /**
   * Check if pagination exists
   */
  async hasPagination(): Promise<boolean> {
    return await this.paginationContainer.isVisible();
  }

  /**
   * Check if filters exist
   */
  async hasFilters(): Promise<boolean> {
    return await this.categoryFilter.isVisible() || await this.sortDropdown.isVisible();
  }

  /**
   * Assert page loaded correctly
   */
  async assertPageLoaded() {
    await expect(this.productGrid.or(this.noResultsMessage)).toBeVisible();
  }

  /**
   * Assert products are displayed
   */
  async assertHasProducts() {
    await expect(this.productCards.first()).toBeVisible();
    const count = await this.getProductCount();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Assert no products message is shown
   */
  async assertNoProducts() {
    await expect(this.noResultsMessage).toBeVisible();
    const count = await this.getProductCount();
    expect(count).toBe(0);
  }

  /**
   * Assert specific number of products
   */
  async assertProductCount(expectedCount: number) {
    const count = await this.getProductCount();
    expect(count).toBe(expectedCount);
  }

  /**
   * Assert product exists by name
   */
  async assertProductExists(productName: string) {
    await expect(
      this.page.locator(`[data-testid="product-card-name"]:has-text("${productName}")`)
    ).toBeVisible();
  }

  /**
   * Assert product does not exist by name
   */
  async assertProductNotExists(productName: string) {
    await expect(
      this.page.locator(`[data-testid="product-card-name"]:has-text("${productName}")`)
    ).not.toBeVisible();
  }

  /**
   * Assert pagination is visible
   */
  async assertPaginationVisible() {
    await expect(this.paginationContainer).toBeVisible();
  }

  /**
   * Assert current page is active
   */
  async assertActivePage(pageNumber: number) {
    await expect(
      this.page.locator(`[data-testid="page-number"][aria-current="page"]:has-text("${pageNumber}")`)
    ).toBeVisible();
  }
}
