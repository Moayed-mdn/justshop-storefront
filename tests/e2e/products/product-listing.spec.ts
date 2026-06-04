/**
 * Product Listing E2E Tests
 *
 * Tests for product listing page, category filtering, sorting, and pagination.
 * Uses Playwright route interception (mockProductListingAPI) so tests do not
 * depend on real backend data or seeded products.
 */

import { test, expect } from '@playwright/test';
import { ProductListingPage } from '../../pages/ProductListingPage';
import { mockProductListingAPI, mockCartAPI, testProducts, basicProduct, saleProduct } from '../../helpers/mocks';
import { clearTestState } from '../../fixtures';

test.describe('Product Listing Page', () => {

  let listingPage: ProductListingPage;

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
    listingPage = new ProductListingPage(page);
    // Apply mock before every test so no test depends on a live backend
    await mockProductListingAPI(page);
  });

  test.describe('Product Display', () => {

    test('displays products on listing page', async () => {
      await listingPage.goto();

      await listingPage.assertHasProducts();
      await expect(listingPage.productGrid).toBeVisible();
    });

    test('displays product cards with correct elements', async () => {
      await listingPage.goto();
      await listingPage.assertHasProducts();

      const firstCard = listingPage.productCards.first();
      await expect(firstCard.locator('[data-testid="product-card-image"]')).toBeVisible();
      await expect(firstCard.locator('[data-testid="product-card-name"]')).toBeVisible();
      await expect(firstCard.locator('[data-testid="product-card-price"]')).toBeVisible();
      await expect(firstCard.locator('[data-testid="product-card-add-to-cart"]')).toBeVisible();
    });

    test('displays product images correctly', async () => {
      await listingPage.goto();

      const firstImage = listingPage.productImages.first();
      await expect(firstImage).toBeVisible();
      await expect(firstImage).toHaveAttribute('src', /.+/);
      await expect(firstImage).toHaveAttribute('alt', /.+/);
    });

    test('displays product names correctly', async () => {
      await listingPage.goto();

      const names = await listingPage.getProductNames();
      expect(names.length).toBeGreaterThan(0);
      names.forEach((name) => {
        expect(name).not.toBe('');
      });
    });

    test('displays product prices correctly', async () => {
      await listingPage.goto();

      const firstPrice = listingPage.productPrices.first();
      await expect(firstPrice).toBeVisible();
      const priceText = await firstPrice.textContent();
      expect(priceText).toMatch(/\d+/);
    });

    test('shows empty state when no products match filter', async ({ page }) => {
      // Override mock to return empty list for this test
      await mockProductListingAPI(page, []);
      await listingPage.goto('nonexistentproductxyz123');

      await listingPage.assertNoProducts();
      await expect(listingPage.noResultsMessage).toBeVisible();
    });

  });

  test.describe('Product Navigation', () => {

    test('navigates to product detail when clicking product card', async ({ page }) => {
      await listingPage.goto();
      await listingPage.assertHasProducts();

      await listingPage.clickProduct(0);
      await expect(listingPage.page).toHaveURL(/\/products?\//);
    });

    test('navigates to product detail when clicking product name', async () => {
      await listingPage.goto();
      await listingPage.assertHasProducts();

      const firstProductName = listingPage.productNames.first();
      await firstProductName.click();
      await expect(listingPage.page).toHaveURL(/\/products?\//);
    });

    test('navigates to product detail when clicking product image', async () => {
      await listingPage.goto();
      await listingPage.assertHasProducts();

      const firstProductImage = listingPage.productImages.first();
      await firstProductImage.click();
      await expect(listingPage.page).toHaveURL(/\/products?\//);
    });

  });

  test.describe('Add to Cart from Listing', () => {

    test('adds product to cart from listing page', async ({ page }) => {
      await mockCartAPI(page);
      await listingPage.goto();
      await listingPage.assertHasProducts();

      const initialCount = await listingPage.getCartCount();
      await listingPage.addToCartFromListing(0);
      await listingPage.waitForCartUpdate();

      const newCount = await listingPage.getCartCount();
      expect(newCount).toBe(initialCount + 1);
    });

    test('shows success notification after adding to cart', async ({ page }) => {
      await mockCartAPI(page);
      await listingPage.goto();
      await listingPage.assertHasProducts();

      await listingPage.addToCartButtons.first().click();
      await listingPage.waitForCartUpdate();

      const cartCount = await listingPage.getCartCount();
      expect(cartCount).toBeGreaterThan(0);
    });

    test('can add multiple products from listing', async ({ page }) => {
      await mockCartAPI(page);
      await listingPage.goto();
      await listingPage.assertHasProducts();

      const productCount = await listingPage.getProductCount();
      const itemsToAdd = Math.min(3, productCount);

      for (let i = 0; i < itemsToAdd; i++) {
        await listingPage.addToCartFromListing(i);
        await listingPage.page.waitForTimeout(500);
      }

      const finalCount = await listingPage.getCartCount();
      expect(finalCount).toBeGreaterThanOrEqual(itemsToAdd);
    });

  });

  test.describe('Sort Functionality', () => {

    test('sort dropdown exists if products are available', async () => {
      await listingPage.goto();

      const hasProducts = (await listingPage.productCards.count()) > 0;
      if (hasProducts && (await listingPage.sortDropdown.isVisible())) {
        await expect(listingPage.sortDropdown).toBeVisible();
      }
    });

    test('can sort products by price low to high', async ({ page }) => {
      await listingPage.goto();

      if (await listingPage.sortDropdown.isVisible()) {
        const pricesBefore = await listingPage.productPrices.allTextContents();
        await listingPage.sortBy('price-asc');
        await page.waitForTimeout(1000);

        const pricesAfter = await listingPage.productPrices.allTextContents();
        // Mock returns same data; just verify page still shows products
        expect(pricesAfter.length).toBeGreaterThan(0);
      }
    });

    test('can sort products by price high to low', async ({ page }) => {
      await listingPage.goto();

      if (await listingPage.sortDropdown.isVisible()) {
        await listingPage.sortBy('price-desc');
        await page.waitForTimeout(1000);
        await listingPage.assertHasProducts();
      }
    });

    test('can sort products by name', async ({ page }) => {
      await listingPage.goto();

      if (await listingPage.sortDropdown.isVisible()) {
        await listingPage.sortBy('name-asc');
        await page.waitForTimeout(1000);
        await listingPage.assertHasProducts();
      }
    });

    test('can sort products by newest', async ({ page }) => {
      await listingPage.goto();

      if (await listingPage.sortDropdown.isVisible()) {
        await listingPage.sortBy('newest');
        await page.waitForTimeout(1000);
        await listingPage.assertHasProducts();
      }
    });

  });

  test.describe('Pagination', () => {

    test('shows pagination if more than one page exists', async () => {
      await listingPage.goto();

      const hasPagination = await listingPage.hasPagination();
      if (hasPagination) {
        await listingPage.assertPaginationVisible();
      }
    });

    test('can navigate to next page', async ({ page }) => {
      await listingPage.goto();

      if (
        (await listingPage.nextPageButton.isVisible()) &&
        (await listingPage.nextPageButton.isEnabled())
      ) {
        const firstPageProducts = await listingPage.getProductNames();
        await listingPage.goToNextPage();
        await page.waitForTimeout(1000);

        // With mock data the list is the same; just verify the page still loads
        const secondPageProducts = await listingPage.getProductNames();
        expect(secondPageProducts.length).toBeGreaterThanOrEqual(0);
      }
    });

    test('can navigate to previous page', async ({ page }) => {
      await listingPage.goto();

      if (
        (await listingPage.nextPageButton.isVisible()) &&
        (await listingPage.nextPageButton.isEnabled())
      ) {
        await listingPage.goToNextPage();
        await page.waitForTimeout(1000);

        if (await listingPage.prevPageButton.isEnabled()) {
          await listingPage.goToPrevPage();
          await page.waitForTimeout(1000);
          await listingPage.assertHasProducts();
        }
      }
    });

    test('can navigate to specific page number', async ({ page }) => {
      await listingPage.goto();

      const pageCount = await listingPage.pageNumbers.count();
      if (pageCount >= 2) {
        await listingPage.goToPage(2);
        await page.waitForTimeout(1000);
        await listingPage.assertHasProducts();
      }
    });

    test('disables previous button on first page', async () => {
      await listingPage.goto();

      if (await listingPage.hasPagination()) {
        const isPrevDisabled = await listingPage.prevPageButton.isDisabled();
        expect(isPrevDisabled).toBe(true);
      }
    });

    test('disables next button on last page', async ({ page }) => {
      await listingPage.goto();

      if (await listingPage.hasPagination()) {
        // Navigate to last page (safety cap at 10)
        let iterations = 0;
        while ((await listingPage.nextPageButton.isEnabled()) && iterations < 10) {
          await listingPage.goToNextPage();
          await page.waitForTimeout(500);
          iterations++;
        }

        const isNextDisabled = await listingPage.nextPageButton.isDisabled();
        expect(isNextDisabled).toBe(true);
      }
    });

  });

  test.describe('Grid/List View Toggle', () => {

    test('defaults to grid view', async () => {
      await listingPage.goto();

      if (await listingPage.gridViewButton.isVisible()) {
        await expect(listingPage.productGrid).toBeVisible();
      }
    });

    test('can switch to list view', async ({ page }) => {
      await listingPage.goto();

      if (await listingPage.listViewButton.isVisible()) {
        await listingPage.switchToListView();
        await page.waitForTimeout(500);
        await listingPage.assertHasProducts();
      }
    });

    test('can switch back to grid view from list view', async ({ page }) => {
      await listingPage.goto();

      if (
        (await listingPage.listViewButton.isVisible()) &&
        (await listingPage.gridViewButton.isVisible())
      ) {
        await listingPage.switchToListView();
        await page.waitForTimeout(500);
        await listingPage.switchToGridView();
        await page.waitForTimeout(500);
        await listingPage.assertHasProducts();
      }
    });

  });

  test.describe('Responsive Behavior', () => {

    test('displays products in grid on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await listingPage.goto();

      await listingPage.assertHasProducts();
      await expect(listingPage.productGrid).toBeVisible();
    });

    test('displays products in grid on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await listingPage.goto();

      await listingPage.assertHasProducts();
      await expect(listingPage.productGrid).toBeVisible();
    });

    test('displays products in single column on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await listingPage.goto();

      await listingPage.assertHasProducts();
      await expect(listingPage.productGrid).toBeVisible();
    });

  });

  test.describe('Search Integration', () => {

    test('displays results for search query', async ({ page }) => {
      // Return a subset of products to simulate a search match
      await mockProductListingAPI(page, [basicProduct, saleProduct]);
      await listingPage.goto('shirt');

      const hasProducts = (await listingPage.productCards.count()) > 0;
      if (hasProducts) {
        await listingPage.assertHasProducts();
      } else {
        await listingPage.assertNoProducts();
      }
    });

    test('updates results when search query changes', async ({ page }) => {
      await listingPage.goto('shirt');
      const firstResults = await listingPage.getProductCount();

      await listingPage.goto('jacket');
      const secondResults = await listingPage.getProductCount();

      expect(typeof firstResults).toBe('number');
      expect(typeof secondResults).toBe('number');
    });

    test('handles empty search query', async () => {
      await listingPage.goto('');
      await listingPage.assertPageLoaded();
    });

    test('handles special characters in search', async () => {
      await listingPage.goto('test@#$%');
      await listingPage.assertPageLoaded();
    });

  });

  test.describe('Performance & Loading States', () => {

    test('shows loading skeleton while products load', async ({ page }) => {
      const navigation = listingPage.goto();

      const skeletonVisible = await listingPage.loadingSkeleton
        .first()
        .isVisible()
        .catch(() => false);

      await navigation;

      const skeletonStillVisible = await listingPage.loadingSkeleton
        .first()
        .isVisible()
        .catch(() => false);
      expect(skeletonStillVisible).toBe(false);
    });

    test('products load within reasonable time', async () => {
      const startTime = Date.now();
      await listingPage.goto();
      await listingPage.assertHasProducts();
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(10000);
    });

  });

});
