/**
 * Example E2E Test
 * 
 * This is a simple example test to verify Playwright is working correctly.
 * Once you've verified it works, you can delete this file.
 */

import { test, expect } from '@playwright/test';

test.describe('Example Tests', () => {
  test('homepage should load', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check that we're on the correct page
    expect(page.url()).toContain('localhost:3000');

    // Check that header exists
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should have correct HTML lang attribute', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const lang = await html.getAttribute('lang');

    // Default language should be English
    expect(lang).toBe('en');
  });

  test('should navigate to shop page', async ({ page }) => {
    await page.goto('/');

    // Find and click shop link (adjust selector as needed)
    const shopLink = page.locator('a[href*="/shop"]').first();
    
    if (await shopLink.isVisible()) {
      await shopLink.click();
      await page.waitForURL(/\/shop/);
      expect(page.url()).toContain('/shop');
    } else {
      // If shop link not found, navigate directly
      await page.goto('/shop');
      await expect(page).toHaveURL(/\/shop/);
    }
  });

  test('should handle 404 pages', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/this-page-does-not-exist-12345');

    // Should show 404 or redirect
    const content = await page.textContent('body');
    expect(content).toMatch(/404|not found|page.*exist/i);
  });
});

test.describe('Multi-tenant Header', () => {
  test('should include X-Tenant-Id header in requests', async ({ page }) => {
    let hasTenanHeader = false;

    // Listen to all requests
    page.on('request', (request) => {
      const headers = request.headers();
      if (headers['x-tenant-id']) {
        hasTenanHeader = true;
      }
    });

    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // API requests should have tenant header
    // Note: This checks that the header is being sent
    // The actual verification depends on your implementation
    expect(hasTenanHeader).toBe(true);
  });
});

test.describe('i18n Support', () => {
  test('should load Arabic version with /ar prefix', async ({ page }) => {
    await page.goto('/ar');

    const html = page.locator('html');
    
    // Check language
    const lang = await html.getAttribute('lang');
    expect(lang).toBe('ar');

    // Check RTL direction
    const dir = await html.getAttribute('dir');
    expect(dir).toBe('rtl');
  });

  test('should load English version without prefix', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    
    // Check language
    const lang = await html.getAttribute('lang');
    expect(lang).toBe('en');

    // Check LTR direction (or no dir attribute)
    const dir = await html.getAttribute('dir');
    expect(dir === 'ltr' || dir === null).toBe(true);
  });
});

test.describe('Environment Configuration', () => {
  test('should use correct base URL', async ({ page }) => {
    await page.goto('/');
    
    const url = page.url();
    expect(url).toContain('localhost:3000');
  });

  test('should have correct viewport size', async ({ page }) => {
    const viewportSize = page.viewportSize();
    
    expect(viewportSize).not.toBeNull();
    expect(viewportSize!.width).toBeGreaterThan(0);
    expect(viewportSize!.height).toBeGreaterThan(0);
  });
});
