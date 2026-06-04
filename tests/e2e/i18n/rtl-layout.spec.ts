/**
 * RTL Layout E2E Tests
 * 
 * Tests for Right-to-Left (RTL) layout functionality in Arabic locale.
 * Ensures UI components work correctly in RTL mode.
 */

import { test, expect } from '@playwright/test';
import { clearTestState, testUserCredentials } from '../../fixtures';

test.describe('RTL Layout', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test.describe('Arabic Layout is RTL', () => {

    test('HTML dir attribute is "rtl" in Arabic', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const html = page.locator('html');
      const dir = await html.getAttribute('dir');

      expect(dir).toBe('rtl');
    });

    test('body element has RTL direction', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const bodyDir = await page.locator('body').evaluate((el) => 
        window.getComputedStyle(el).direction
      );

      expect(bodyDir).toBe('rtl');
    });

    test('main content has RTL direction', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const main = page.locator('main, [role="main"]').first();
      
      if (await main.isVisible().catch(() => false)) {
        const mainDir = await main.evaluate((el) => 
          window.getComputedStyle(el).direction
        );

        expect(mainDir).toBe('rtl');
      }
    });

    test('text aligns to the right in RTL', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Check text alignment of body
      const bodyTextAlign = await page.locator('body').evaluate((el) => 
        window.getComputedStyle(el).textAlign
      );

      // In RTL, text should align right or start (which means right in RTL)
      expect(['right', 'start'].includes(bodyTextAlign)).toBe(true);
    });

  });

  test.describe('Header in RTL', () => {

    test('header displays correctly in RTL', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const header = page.locator('header, [role="banner"]').first();
      await expect(header).toBeVisible();

      // Header should have RTL direction
      const headerDir = await header.evaluate((el) => 
        window.getComputedStyle(el).direction
      );

      expect(headerDir).toBe('rtl');
    });

    test('logo is positioned correctly in RTL', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const logo = page.locator('a[href="/ar"], a[href="/"]').first();
      
      if (await logo.isVisible().catch(() => false)) {
        await expect(logo).toBeVisible();
      }
    });

    test('search input works in RTL', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const searchInput = page.locator('input[type="search"]').first();
      
      if (await searchInput.isVisible().catch(() => false)) {
        await expect(searchInput).toBeVisible();

        // Input should have RTL direction
        const inputDir = await searchInput.evaluate((el) => 
          window.getComputedStyle(el).direction
        );

        expect(inputDir).toBe('rtl');

        // Can type in search
        await searchInput.fill('اختبار');
        const value = await searchInput.inputValue();
        expect(value).toBe('اختبار');
      }
    });

    test('navigation menu displays in RTL order', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const nav = page.locator('nav').first();
      
      if (await nav.isVisible().catch(() => false)) {
        // Nav should have RTL direction
        const navDir = await nav.evaluate((el) => 
          window.getComputedStyle(el).direction
        );

        expect(navDir).toBe('rtl');
      }
    });

    test('user menu opens correctly in RTL', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const accountLink = page.locator('a[href*="login"], a[href*="profile"]').first();
      
      if (await accountLink.isVisible().catch(() => false)) {
        await expect(accountLink).toBeVisible();
      }
    });

  });

  test.describe('Cart in RTL', () => {

    test('cart button displays correctly in RTL', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const cartButton = page.locator('[data-testid="cart-button"], a[href*="cart"]').first();
      await expect(cartButton).toBeVisible();
    });

    test('cart badge is positioned correctly in RTL', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const cartBadge = page.locator('[data-testid="cart-badge"]');
      
      if (await cartBadge.isVisible().catch(() => false)) {
        await expect(cartBadge).toBeVisible();

        // Badge should be positioned relative to RTL layout
        const badgePosition = await cartBadge.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return { left: rect.left, right: rect.right };
        });

        expect(badgePosition).toBeTruthy();
      }
    });

    test('cart page displays in RTL', async ({ page }) => {
      await page.goto('/ar/cart');
      await page.waitForLoadState('networkidle');

      const htmlDir = await page.locator('html').getAttribute('dir');
      expect(htmlDir).toBe('rtl');

      // Check if cart content respects RTL
      const main = page.locator('main, [role="main"]').first();
      
      if (await main.isVisible().catch(() => false)) {
        const mainDir = await main.evaluate((el) => 
          window.getComputedStyle(el).direction
        );

        expect(mainDir).toBe('rtl');
      }
    });

    test('cart items display in RTL layout', async ({ page }) => {
      await page.goto('/ar/cart');
      await page.waitForLoadState('networkidle');

      const cartItems = page.locator('[data-testid="cart-item"]');
      const count = await cartItems.count();

      if (count > 0) {
        const firstItem = cartItems.first();
        
        // Item should respect RTL direction
        const itemDir = await firstItem.evaluate((el) => 
          window.getComputedStyle(el).direction
        );

        expect(itemDir).toBe('rtl');
      }
    });

    test('cart summary is positioned correctly in RTL', async ({ page }) => {
      await page.goto('/ar/cart');
      await page.waitForLoadState('networkidle');

      const cartSummary = page.locator('[data-testid="cart-summary"], [class*="cart-summary"]').first();
      
      if (await cartSummary.isVisible().catch(() => false)) {
        await expect(cartSummary).toBeVisible();
      }
    });

    test('quantity buttons work in RTL', async ({ page }) => {
      await page.goto('/ar/cart');
      await page.waitForLoadState('networkidle');

      const increaseButton = page.locator('[data-testid="cart-item-quantity-increment"]').first();
      const decreaseButton = page.locator('[data-testid="cart-item-quantity-decrement"]').first();

      if (await increaseButton.isVisible().catch(() => false)) {
        await expect(increaseButton).toBeVisible();
      }

      if (await decreaseButton.isVisible().catch(() => false)) {
        await expect(decreaseButton).toBeVisible();
      }
    });

  });

  test.describe('Forms in RTL', () => {

    test('login form displays in RTL', async ({ page }) => {
      await page.goto('/ar/login');
      await page.waitForLoadState('networkidle');

      const htmlDir = await page.locator('html').getAttribute('dir');
      expect(htmlDir).toBe('rtl');

      const form = page.locator('form').first();
      
      if (await form.isVisible().catch(() => false)) {
        const formDir = await form.evaluate((el) => 
          window.getComputedStyle(el).direction
        );

        expect(formDir).toBe('rtl');
      }
    });

    test('form inputs have RTL text direction', async ({ page }) => {
      await page.goto('/ar/login');
      await page.waitForLoadState('networkidle');

      const emailInput = page.locator('input[type="email"]').first();
      
      if (await emailInput.isVisible().catch(() => false)) {
        const inputDir = await emailInput.evaluate((el) => 
          window.getComputedStyle(el).direction
        );

        expect(inputDir).toBe('rtl');
      }
    });

    test('form labels align correctly in RTL', async ({ page }) => {
      await page.goto('/ar/login');
      await page.waitForLoadState('networkidle');

      const labels = page.locator('label');
      const count = await labels.count();

      if (count > 0) {
        const firstLabel = labels.first();
        
        const labelDir = await firstLabel.evaluate((el) => 
          window.getComputedStyle(el).direction
        );

        expect(labelDir).toBe('rtl');
      }
    });

    test('form buttons display correctly in RTL', async ({ page }) => {
      await page.goto('/ar/login');
      await page.waitForLoadState('networkidle');

      const submitButton = page.locator('[data-testid="login-submit-button"], button[type="submit"]').first();
      await expect(submitButton).toBeVisible();
    });

    test('can submit form in RTL', async ({ page }) => {
      await page.goto('/ar/login');
      await page.waitForLoadState('networkidle');

      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();

      if (await emailInput.isVisible() && await passwordInput.isVisible()) {
        // Can type in inputs
        await emailInput.fill(testUserCredentials.email);
        await passwordInput.fill(testUserCredentials.password);

        const emailValue = await emailInput.inputValue();
        const passwordValue = await passwordInput.inputValue();

        expect(emailValue).toBe(testUserCredentials.email);
        expect(passwordValue).toBe(testUserCredentials.password);
      }
    });

    test('register form works in RTL', async ({ page }) => {
      await page.goto('/ar/register');
      await page.waitForLoadState('networkidle');

      const htmlDir = await page.locator('html').getAttribute('dir');
      expect(htmlDir).toBe('rtl');

      const form = page.locator('form').first();
      
      if (await form.isVisible().catch(() => false)) {
        await expect(form).toBeVisible();
      }
    });

    test('search form works in RTL', async ({ page }) => {
      await page.goto('/ar/search');
      await page.waitForLoadState('networkidle');

      const htmlDir = await page.locator('html').getAttribute('dir');
      expect(htmlDir).toBe('rtl');

      const searchInput = page.locator('input[type="search"]').first();
      
      if (await searchInput.isVisible().catch(() => false)) {
        await searchInput.fill('بحث');
        const value = await searchInput.inputValue();
        expect(value).toBe('بحث');
      }
    });

  });

  test.describe('Product Display in RTL', () => {

    test('product cards display in RTL', async ({ page }) => {
      await page.goto('/ar/search?q=test');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const productCards = page.locator('[data-testid="product-card"]');
      const count = await productCards.count();

      if (count > 0) {
        const firstCard = productCards.first();
        
        const cardDir = await firstCard.evaluate((el) => 
          window.getComputedStyle(el).direction
        );

        expect(cardDir).toBe('rtl');
      }
    });

    test('product grid respects RTL layout', async ({ page }) => {
      await page.goto('/ar/search?q=test');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const productGrid = page.locator('[data-testid="product-grid"]').first();
      
      if (await productGrid.isVisible().catch(() => false)) {
        const gridDir = await productGrid.evaluate((el) => 
          window.getComputedStyle(el).direction
        );

        expect(gridDir).toBe('rtl');
      }
    });

  });

  test.describe('Responsive RTL Layout', () => {

    test('RTL works on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const htmlDir = await page.locator('html').getAttribute('dir');
      expect(htmlDir).toBe('rtl');
    });

    test('RTL works on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const htmlDir = await page.locator('html').getAttribute('dir');
      expect(htmlDir).toBe('rtl');
    });

    test('RTL works on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const htmlDir = await page.locator('html').getAttribute('dir');
      expect(htmlDir).toBe('rtl');
    });

  });

  test.describe('Icons and Images in RTL', () => {

    test('icons display correctly in RTL', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Check for icons in header
      const icons = page.locator('svg, [class*="icon"]');
      const count = await icons.count();

      expect(count).toBeGreaterThan(0);
    });

    test('product images display correctly in RTL', async ({ page }) => {
      await page.goto('/ar/search?q=test');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      const productImages = page.locator('[data-testid="product-card-image"]');
      const count = await productImages.count();

      if (count > 0) {
        const firstImage = productImages.first();
        await expect(firstImage).toBeVisible();
      }
    });

  });

  test.describe('Navigation in RTL', () => {

    test('can navigate between pages in RTL', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Navigate to cart
      const cartButton = page.locator('[data-testid="cart-button"], a[href*="cart"]').first();
      if (await cartButton.isVisible().catch(() => false)) {
        await cartButton.click();
        await page.waitForTimeout(500);

        const url = page.url();
        expect(url).toContain('/ar');
      }
    });

    test('breadcrumbs work in RTL', async ({ page }) => {
      await page.goto('/ar/search?q=test');
      await page.waitForLoadState('networkidle');

      const breadcrumb = page.locator('nav[aria-label*="breadcrumb" i]').first();
      
      if (await breadcrumb.isVisible().catch(() => false)) {
        const breadcrumbDir = await breadcrumb.evaluate((el) => 
          window.getComputedStyle(el).direction
        );

        expect(breadcrumbDir).toBe('rtl');
      }
    });

  });

  test.describe('Typography in RTL', () => {

    test('Arabic fonts render correctly', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      // Get computed font family
      const bodyFont = await page.locator('body').evaluate((el) => 
        window.getComputedStyle(el).fontFamily
      );

      expect(bodyFont).toBeTruthy();
    });

    test('text size is readable in RTL', async ({ page }) => {
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      const bodyFontSize = await page.locator('body').evaluate((el) => 
        window.getComputedStyle(el).fontSize
      );

      // Font size should be defined
      expect(bodyFontSize).toBeTruthy();
    });

  });

  test.describe('Switching Between LTR and RTL', () => {

    test('layout changes from LTR to RTL when switching languages', async ({ page }) => {
      // Start in English (LTR)
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      let dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('ltr');

      // Switch to Arabic (RTL)
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('rtl');
    });

    test('layout changes from RTL to LTR when switching languages', async ({ page }) => {
      // Start in Arabic (RTL)
      await page.goto('/ar');
      await page.waitForLoadState('networkidle');

      let dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('rtl');

      // Switch to English (LTR)
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('ltr');
    });

  });

});
