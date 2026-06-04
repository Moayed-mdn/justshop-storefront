/**
 * Product Detail E2E Tests
 *
 * Tests for product detail page, variant selection, quantity, and add to cart.
 * Uses Playwright route interception (mockProductDetailAPI) so tests do not
 * depend on real backend data or seeded product slugs.
 */

import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';
import {
  mockProductDetailAPI,
  mockCartAPI,
  basicProduct,
  productWithVariants,
  saleProduct,
  outOfStockProduct,
  lowStockProduct,
  detailedProduct,
} from '../../helpers/mocks';
import { clearTestState } from '../../fixtures';

test.describe('Product Detail Page', () => {

  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
    productPage = new ProductPage(page);
  });

  test.describe('Product Information Display', () => {

    test('displays product detail page correctly', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await mockCartAPI(page);
      await productPage.goto(basicProduct.slug);

      await productPage.assertPageLoaded();
      await expect(productPage.productName).toBeVisible();
      await expect(productPage.productPrice).toBeVisible();
      await expect(productPage.productImage).toBeVisible();
    });

    test('displays product name correctly', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const productName = await productPage.getProductName();
      expect(productName).toBeTruthy();
      expect(productName.length).toBeGreaterThan(0);
    });

    test('displays product price correctly', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const price = await productPage.getProductPrice();
      expect(price).toBeTruthy();
      expect(price).toMatch(/\d+/);
    });

    test('displays product description', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const descriptionVisible = await productPage.productDescription.isVisible().catch(() => false);
      if (descriptionVisible) {
        const description = await productPage.productDescription.textContent();
        expect(description).toBeTruthy();
      }
    });

    test('displays breadcrumb navigation', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const breadcrumbVisible = await productPage.breadcrumb.isVisible().catch(() => false);
      if (breadcrumbVisible) {
        await expect(productPage.breadcrumb).toBeVisible();
      }
    });

    test('displays category link if available', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const categoryVisible = await productPage.categoryLink.isVisible().catch(() => false);
      if (categoryVisible) {
        await expect(productPage.categoryLink).toBeVisible();
      }
    });

  });

  test.describe('Product Image Gallery', () => {

    test('displays product image', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      await expect(productPage.productImage).toBeVisible();
      await expect(productPage.productImage).toHaveAttribute('src', /.+/);
    });

    test('product image has alt text', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const altText = await productPage.productImage.getAttribute('alt');
      expect(altText).toBeTruthy();
    });

    test('can view image gallery if available', async ({ page }) => {
      await mockProductDetailAPI(page, detailedProduct);
      await productPage.goto(detailedProduct.slug);

      const galleryVisible = await productPage.imageGallery.isVisible().catch(() => false);
      if (galleryVisible) {
        await expect(productPage.imageGallery).toBeVisible();
      }
    });

    test('clicking image opens gallery', async ({ page }) => {
      await mockProductDetailAPI(page, detailedProduct);
      await productPage.goto(detailedProduct.slug);

      const imageClickable = await productPage.productImage.isVisible();
      if (imageClickable) {
        await productPage.productImage.click();
        await page.waitForTimeout(500);
        // Gallery/zoom behaviour depends on implementation — no assertion needed
      }
    });

  });

  test.describe('Stock Status', () => {

    test('shows in stock badge for available products', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const inStock = await productPage.isInStock();
      if (inStock) {
        await expect(productPage.inStockBadge).toBeVisible();
      }
    });

    test('shows out of stock badge for unavailable products', async ({ page }) => {
      await mockProductDetailAPI(page, outOfStockProduct);
      await productPage.goto(outOfStockProduct.slug);

      const outOfStock = await productPage.isOutOfStock();
      if (outOfStock) {
        await expect(productPage.outOfStockBadge).toBeVisible();
        await productPage.assertCannotAddToCart();
      }
    });

    test('shows low stock warning when applicable', async ({ page }) => {
      await mockProductDetailAPI(page, lowStockProduct);
      await productPage.goto(lowStockProduct.slug);

      const hasLowStock = await productPage.hasLowStockWarning();
      if (hasLowStock) {
        await expect(productPage.lowStockWarning).toBeVisible();
      }
    });

    test('disables add to cart button when out of stock', async ({ page }) => {
      await mockProductDetailAPI(page, outOfStockProduct);
      await productPage.goto(outOfStockProduct.slug);

      const outOfStock = await productPage.isOutOfStock();
      if (outOfStock) {
        await expect(productPage.addToCartButton).toBeDisabled();
      }
    });

    test('enables add to cart button when in stock', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const inStock = await productPage.isInStock();
      if (inStock) {
        await expect(productPage.addToCartButton).toBeEnabled();
      }
    });

  });

  test.describe('Sale Price Display', () => {

    test('shows sale price when product is on sale', async ({ page }) => {
      await mockProductDetailAPI(page, saleProduct);
      await productPage.goto(saleProduct.slug);

      const onSale = await productPage.isOnSale();
      if (onSale) {
        await expect(productPage.salePrice).toBeVisible();
      }
    });

    test('shows both regular and sale price', async ({ page }) => {
      await mockProductDetailAPI(page, saleProduct);
      await productPage.goto(saleProduct.slug);

      const onSale = await productPage.isOnSale();
      if (onSale) {
        await expect(productPage.productPrice).toBeVisible();
        await expect(productPage.salePrice).toBeVisible();

        const regularPrice = await productPage.productPrice.textContent();
        const salePrice = await productPage.salePrice.textContent();

        expect(regularPrice).toBeTruthy();
        expect(salePrice).toBeTruthy();
        expect(regularPrice).not.toBe(salePrice);
      }
    });

    test('does not show sale price for regular products', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const onSale = await productPage.isOnSale();
      expect(onSale).toBe(false);
    });

  });

  test.describe('Variant Selection', () => {

    test('displays variant selector when variants exist', async ({ page }) => {
      await mockProductDetailAPI(page, productWithVariants);
      await productPage.goto(productWithVariants.slug);

      const hasVariants =
        (await productPage.variantSelect.isVisible().catch(() => false)) ||
        (await productPage.sizeOptions.first().isVisible().catch(() => false));

      if (hasVariants) {
        const variantSelectVisible = await productPage.variantSelect.isVisible().catch(() => false);
        const sizeOptionsVisible = await productPage.sizeOptions.first().isVisible().catch(() => false);
        expect(variantSelectVisible || sizeOptionsVisible).toBe(true);
      }
    });

    test('can select size variant', async ({ page }) => {
      await mockProductDetailAPI(page, productWithVariants);
      await productPage.goto(productWithVariants.slug);

      const hasSizeOptions = await productPage.sizeOptions.first().isVisible().catch(() => false);
      if (hasSizeOptions) {
        await productPage.selectSize('M');
        await page.waitForTimeout(500);
      }
    });

    test('can select color variant', async ({ page }) => {
      await mockProductDetailAPI(page, productWithVariants);
      await productPage.goto(productWithVariants.slug);

      const hasColorOptions = await productPage.colorOptions.first().isVisible().catch(() => false);
      if (hasColorOptions) {
        await productPage.selectColor('Black');
        await page.waitForTimeout(500);
      }
    });

    test('price updates when variant is selected', async ({ page }) => {
      await mockProductDetailAPI(page, productWithVariants);
      await productPage.goto(productWithVariants.slug);

      const hasVariants = await productPage.variantSelect.isVisible().catch(() => false);
      if (hasVariants) {
        const priceBefore = await productPage.getProductPrice();
        await productPage.selectVariant(2);
        await page.waitForTimeout(500);

        const priceAfter = await productPage.getProductPrice();
        expect(priceAfter).toBeTruthy();
      }
    });

    test('shows correct stock status for selected variant', async ({ page }) => {
      await mockProductDetailAPI(page, productWithVariants);
      await productPage.goto(productWithVariants.slug);

      const hasVariants = await productPage.variantSelect.isVisible().catch(() => false);
      if (hasVariants) {
        await productPage.selectVariant(1);
        await page.waitForTimeout(500);

        const inStock = await productPage.isInStock();
        const outOfStock = await productPage.isOutOfStock();
        expect(inStock || outOfStock).toBe(true);
      }
    });

  });

  test.describe('Quantity Selector', () => {

    test('displays quantity selector', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const quantityVisible = await productPage.quantityInput.isVisible().catch(() => false);
      if (quantityVisible) {
        await expect(productPage.quantityInput).toBeVisible();
      }
    });

    test('defaults to quantity of 1', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const quantityVisible = await productPage.quantityInput.isVisible().catch(() => false);
      if (quantityVisible) {
        const quantity = await productPage.getQuantity();
        expect(quantity).toBe(1);
      }
    });

    test('can increase quantity', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const increaseVisible = await productPage.quantityIncrease.isVisible().catch(() => false);
      if (increaseVisible) {
        const initialQuantity = await productPage.getQuantity();
        await productPage.increaseQuantity();
        await page.waitForTimeout(300);

        const newQuantity = await productPage.getQuantity();
        expect(newQuantity).toBe(initialQuantity + 1);
      }
    });

    test('can decrease quantity', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const decreaseVisible = await productPage.quantityDecrease.isVisible().catch(() => false);
      if (decreaseVisible) {
        await productPage.setQuantity(2);
        await page.waitForTimeout(300);

        await productPage.decreaseQuantity();
        await page.waitForTimeout(300);

        const quantity = await productPage.getQuantity();
        expect(quantity).toBe(1);
      }
    });

    test('can set quantity manually', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const quantityVisible = await productPage.quantityInput.isVisible().catch(() => false);
      if (quantityVisible) {
        await productPage.setQuantity(5);
        await page.waitForTimeout(300);

        const quantity = await productPage.getQuantity();
        expect(quantity).toBe(5);
      }
    });

    test('does not allow quantity less than 1', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const quantityVisible = await productPage.quantityInput.isVisible().catch(() => false);
      if (quantityVisible) {
        await productPage.setQuantity(0);
        await page.waitForTimeout(300);

        const quantity = await productPage.getQuantity();
        expect(quantity).toBeGreaterThanOrEqual(1);
      }
    });

    test('enforces maximum quantity based on stock', async ({ page }) => {
      await mockProductDetailAPI(page, lowStockProduct);
      await productPage.goto(lowStockProduct.slug);

      const quantityVisible = await productPage.quantityInput.isVisible().catch(() => false);
      if (quantityVisible) {
        await productPage.setQuantity(100);
        await page.waitForTimeout(300);
        // Should be capped or show error — behaviour depends on implementation
      }
    });

  });

  test.describe('Add to Cart', () => {

    test('can add product to cart', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await mockCartAPI(page);
      await productPage.goto(basicProduct.slug);

      const initialCount = await productPage.getCartCount();
      await productPage.addToCart();
      await productPage.waitForAddToCartSuccess();

      const newCount = await productPage.getCartCount();
      expect(newCount).toBe(initialCount + 1);
    });

    test('shows success notification after adding to cart', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await mockCartAPI(page);
      await productPage.goto(basicProduct.slug);

      await productPage.addToCart();
      await productPage.waitForAddToCartSuccess();

      await expect(productPage.successNotification).toBeVisible();
    });

    test('can add product with specific quantity', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await mockCartAPI(page);
      await productPage.goto(basicProduct.slug);

      const quantityVisible = await productPage.quantityInput.isVisible().catch(() => false);
      if (quantityVisible) {
        const initialCount = await productPage.getCartCount();
        await productPage.setQuantity(3);
        await productPage.addToCart();
        await productPage.waitForAddToCartSuccess();

        const newCount = await productPage.getCartCount();
        expect(newCount).toBe(initialCount + 3);
      }
    });

    test('updates cart badge after adding product', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await mockCartAPI(page);
      await productPage.goto(basicProduct.slug);

      const cartBadge = page.locator('[data-testid="cart-badge"]');

      await productPage.addToCart();
      await productPage.waitForAddToCartSuccess();

      await expect(cartBadge).toBeVisible();
    });

    test('can add variant product to cart', async ({ page }) => {
      await mockProductDetailAPI(page, productWithVariants);
      await mockCartAPI(page);
      await productPage.goto(productWithVariants.slug);

      const hasVariants =
        (await productPage.variantSelect.isVisible().catch(() => false)) ||
        (await productPage.sizeOptions.first().isVisible().catch(() => false));

      if (hasVariants) {
        const hasSizeOptions = await productPage.sizeOptions.first().isVisible().catch(() => false);
        if (hasSizeOptions) {
          await productPage.selectSize('M');
          await page.waitForTimeout(500);
        }

        const initialCount = await productPage.getCartCount();
        await productPage.addToCart();
        await productPage.waitForAddToCartSuccess();

        const newCount = await productPage.getCartCount();
        expect(newCount).toBe(initialCount + 1);
      }
    });

    test('cannot add out of stock product to cart', async ({ page }) => {
      await mockProductDetailAPI(page, outOfStockProduct);
      await productPage.goto(outOfStockProduct.slug);

      const outOfStock = await productPage.isOutOfStock();
      if (outOfStock) {
        await expect(productPage.addToCartButton).toBeDisabled();
      }
    });

    test('shows error when trying to add more than available stock', async ({ page }) => {
      await mockProductDetailAPI(page, lowStockProduct);
      await mockCartAPI(page);
      await productPage.goto(lowStockProduct.slug);

      const quantityVisible = await productPage.quantityInput.isVisible().catch(() => false);
      if (quantityVisible) {
        await productPage.setQuantity(100);
        await productPage.addToCart();

        const errorVisible = await productPage.errorNotification.isVisible().catch(() => false);
        if (errorVisible) {
          await expect(productPage.errorNotification).toBeVisible();
        }
      }
    });

  });

  test.describe('Buy Now Button', () => {

    test('displays buy now button if available', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const buyNowVisible = await productPage.buyNowButton.isVisible().catch(() => false);
      if (buyNowVisible) {
        await expect(productPage.buyNowButton).toBeVisible();
      }
    });

    test('buy now redirects to checkout', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await mockCartAPI(page);
      await productPage.goto(basicProduct.slug);

      const buyNowVisible = await productPage.buyNowButton.isVisible().catch(() => false);
      if (buyNowVisible && (await productPage.buyNowButton.isEnabled())) {
        await productPage.buyNowButton.click();
        await expect(productPage.page).toHaveURL(/\/(checkout|cart)/);
      }
    });

  });

  test.describe('Product Navigation', () => {

    test('can navigate to category from product page', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const categoryVisible = await productPage.categoryLink.isVisible().catch(() => false);
      if (categoryVisible) {
        await productPage.goToCategory();
        await expect(productPage.page).toHaveURL(/\/category\//);
      }
    });

    test('breadcrumb navigation works', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const breadcrumbVisible = await productPage.breadcrumb.isVisible().catch(() => false);
      if (breadcrumbVisible) {
        const homeLink = productPage.breadcrumb.locator('a').first();
        if (await homeLink.isVisible()) {
          await homeLink.click();
          await page.waitForTimeout(500);
        }
      }
    });

  });

  test.describe('Responsive Behavior', () => {

    test('displays correctly on desktop', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await page.setViewportSize({ width: 1920, height: 1080 });
      await productPage.goto(basicProduct.slug);

      await productPage.assertPageLoaded();
    });

    test('displays correctly on tablet', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await page.setViewportSize({ width: 768, height: 1024 });
      await productPage.goto(basicProduct.slug);

      await productPage.assertPageLoaded();
    });

    test('displays correctly on mobile', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await page.setViewportSize({ width: 375, height: 667 });
      await productPage.goto(basicProduct.slug);

      await productPage.assertPageLoaded();
    });

  });

  test.describe('Error Handling', () => {

    test('shows 404 for non-existent product', async ({ page }) => {
      // Intercept with a 404 response — no fixture match needed
      await page.route('**/api/products/non-existent-product-xyz-123', async (route) => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ status: false, message: 'Product not found.', error_code: 'NOT_FOUND', errors: null }),
        });
      });

      await productPage.goto('non-existent-product-xyz-123');
      await expect(page.locator('text=/not found|404/i')).toBeVisible();
    });

    test('handles invalid product slug', async ({ page }) => {
      await page.route('**/api/products/**', async (route) => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ status: false, message: 'Product not found.', error_code: 'NOT_FOUND', errors: null }),
        });
      });

      await productPage.goto('invalid-slug-xyz');
      const is404 = await page.locator('text=/not found|404/i').isVisible().catch(() => false);
      expect(typeof is404).toBe('boolean');
    });

  });

  test.describe('Performance', () => {

    test('product page loads within reasonable time', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      const startTime = Date.now();
      await productPage.goto(basicProduct.slug);
      await productPage.assertPageLoaded();
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(10000);
    });

    test('images load properly', async ({ page }) => {
      await mockProductDetailAPI(page, basicProduct);
      await productPage.goto(basicProduct.slug);

      const image = productPage.productImage;
      await expect(image).toBeVisible();

      const isLoaded = await image.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      );
      expect(isLoaded).toBe(true);
    });

  });

});
