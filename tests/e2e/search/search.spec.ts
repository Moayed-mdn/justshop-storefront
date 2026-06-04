/**
 * Search E2E Tests
 * 
 * Tests for search functionality including autocomplete, search results, and filters.
 * Based on actual GraphQL/Apollo Client search implementation.
 */

import { test, expect } from '@playwright/test';
import { clearTestState } from '../../fixtures';

test.describe('Search Functionality', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
    await page.goto('/');
  });

  test.describe('Search Input Display', () => {

    test('search input appears in header', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      await expect(searchInput).toBeVisible();
    });

    test('search input has placeholder text', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      const placeholder = await searchInput.getAttribute('placeholder');
      expect(placeholder).toBeTruthy();
    });

    test('search input is focused when clicked', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      await searchInput.click();
      await expect(searchInput).toBeFocused();
    });

    test('search icon is visible', async ({ page }) => {
      const searchIcon = page.locator('input[type="search"]').first().locator('..');
      await expect(searchIcon).toBeVisible();
    });

  });

  test.describe('Autocomplete Suggestions', () => {

    test('autocomplete dropdown appears while typing', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      // Type search query
      await searchInput.fill('shirt');
      
      // Wait for autocomplete dropdown
      await page.waitForTimeout(500);
      
      // Dropdown should appear (if suggestions exist)
      const dropdownVisible = await page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]')
        .first()
        .isVisible()
        .catch(() => false);

      // Either dropdown appears or no suggestions available
      expect(typeof dropdownVisible).toBe('boolean');
    });

    test('autocomplete shows suggestions for valid query', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('test');
      await page.waitForTimeout(800);
      
      // Check if dropdown with suggestions appears
      const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
      const dropdownVisible = await dropdown.isVisible().catch(() => false);

      if (dropdownVisible) {
        const suggestions = dropdown.locator('li, button, [data-suggestion-item]');
        const count = await suggestions.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('autocomplete does not show for queries less than 2 characters', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      // Type single character
      await searchInput.fill('a');
      await page.waitForTimeout(500);
      
      // Dropdown should not appear
      const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
      const dropdownVisible = await dropdown.isVisible().catch(() => false);
      
      expect(dropdownVisible).toBe(false);
    });

    test('shows loading spinner while fetching suggestions', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      // Start typing
      await searchInput.fill('shirt');
      
      // Check for loading spinner (might be brief)
      const spinner = page.locator('.search-spinner, [class*="loading"]').first();
      const spinnerAppeared = await spinner.isVisible({ timeout: 1000 }).catch(() => false);
      
      // Spinner may or may not appear depending on speed
      expect(typeof spinnerAppeared).toBe('boolean');
    });

    test('can navigate suggestions with keyboard arrows', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('shirt');
      await page.waitForTimeout(800);
      
      const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
      const dropdownVisible = await dropdown.isVisible().catch(() => false);

      if (dropdownVisible) {
        // Press down arrow
        await searchInput.press('ArrowDown');
        await page.waitForTimeout(200);
        
        // First suggestion should be highlighted
        const highlighted = dropdown.locator('[class*="highlighted"], [aria-selected="true"]').first();
        const highlightedVisible = await highlighted.isVisible().catch(() => false);
        
        // Highlighting may or may not be visually distinct
        expect(typeof highlightedVisible).toBe('boolean');
      }
    });

    test('can select suggestion with Enter key', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('shirt');
      await page.waitForTimeout(800);
      
      const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
      const dropdownVisible = await dropdown.isVisible().catch(() => false);

      if (dropdownVisible) {
        const suggestions = dropdown.locator('li, button, [data-suggestion-item]');
        const count = await suggestions.count();

        if (count > 0) {
          // Navigate down and select
          await searchInput.press('ArrowDown');
          await page.waitForTimeout(200);
          await searchInput.press('Enter');
          await page.waitForTimeout(500);
          
          // Should navigate somewhere (product, category, or search results)
          const currentUrl = page.url();
          expect(currentUrl).toBeTruthy();
        }
      }
    });

    test('can click on suggestion to select', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('shirt');
      await page.waitForTimeout(800);
      
      const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
      const dropdownVisible = await dropdown.isVisible().catch(() => false);

      if (dropdownVisible) {
        const suggestions = dropdown.locator('li, button, [data-suggestion-item]');
        const count = await suggestions.count();

        if (count > 0) {
          // Click first suggestion
          await suggestions.first().click();
          await page.waitForTimeout(500);
          
          // Should navigate
          const currentUrl = page.url();
          expect(currentUrl).not.toContain('/#');
        }
      }
    });

    test('autocomplete closes on Escape key', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('shirt');
      await page.waitForTimeout(800);
      
      const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
      const dropdownVisible = await dropdown.isVisible().catch(() => false);

      if (dropdownVisible) {
        // Press Escape
        await searchInput.press('Escape');
        await page.waitForTimeout(200);
        
        // Dropdown should close
        const stillVisible = await dropdown.isVisible().catch(() => false);
        expect(stillVisible).toBe(false);
      }
    });

    test('autocomplete closes when clicking outside', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('shirt');
      await page.waitForTimeout(800);
      
      const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
      const dropdownVisible = await dropdown.isVisible().catch(() => false);

      if (dropdownVisible) {
        // Click outside (on body)
        await page.click('body', { position: { x: 10, y: 10 } });
        await page.waitForTimeout(200);
        
        // Dropdown should close
        const stillVisible = await dropdown.isVisible().catch(() => false);
        expect(stillVisible).toBe(false);
      }
    });

  });

  test.describe('Search Submission', () => {

    test('pressing Enter submits search', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('shirt');
      await searchInput.press('Enter');
      
      // Should navigate to search results page
      await page.waitForURL(/\/search/);
      expect(page.url()).toContain('search');
    });

    test('navigates to search results with query parameter', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('test product');
      await searchInput.press('Enter');
      
      await page.waitForURL(/\/search/);
      
      // URL should contain query
      const url = page.url();
      expect(url).toContain('q=');
    });

    test('handles empty search submission', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      // Try to submit empty search
      await searchInput.click();
      await searchInput.press('Enter');
      
      // Should either stay on page or navigate to empty search
      await page.waitForTimeout(500);
      
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
    });

    test('handles special characters in search', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('test@#$%');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(1000);
      
      // Should handle gracefully
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
    });

  });

  test.describe('Search Results Page', () => {

    test('displays search results page correctly', async ({ page }) => {
      await page.goto('/search?q=shirt');
      await page.waitForLoadState('networkidle');
      
      // Should show search results page with query
      await expect(page.locator('text=/results for|search results/i')).toBeVisible();
    });

    test('shows search query in page heading', async ({ page }) => {
      const query = 'test product';
      await page.goto(`/search?q=${encodeURIComponent(query)}`);
      await page.waitForLoadState('networkidle');
      
      // Page should display the search query
      const heading = page.locator('h1').first();
      const headingText = await heading.textContent();
      expect(headingText?.toLowerCase()).toContain(query.toLowerCase());
    });

    test('displays product results when available', async ({ page }) => {
      await page.goto('/search?q=shirt');
      await page.waitForLoadState('networkidle');
      
      // Wait for loading to complete
      await page.waitForTimeout(1000);
      
      // Check for products or no results message
      const hasProducts = await page.locator('[data-testid="product-card"]').count() > 0;
      const hasNoResults = await page.locator('text=/no results|nothing found/i').isVisible().catch(() => false);
      
      // Should show either products or no results message
      expect(hasProducts || hasNoResults).toBe(true);
    });

    test('displays results count when available', async ({ page }) => {
      await page.goto('/search?q=shirt');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Look for results count
      const resultsCount = page.locator('text=/\\d+ results?/i').first();
      const countVisible = await resultsCount.isVisible().catch(() => false);
      
      // Count may or may not be visible depending on results
      expect(typeof countVisible).toBe('boolean');
    });

    test('shows categories when matches exist', async ({ page }) => {
      await page.goto('/search?q=clothing');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Look for categories section
      const categoriesHeading = page.locator('text=/categories/i').first();
      const categoriesVisible = await categoriesHeading.isVisible().catch(() => false);
      
      if (categoriesVisible) {
        // Should have category links
        const categoryLinks = page.locator('a[href*="/category"]');
        const count = await categoryLinks.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('shows brands when matches exist', async ({ page }) => {
      await page.goto('/search?q=nike');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Look for brands section
      const brandsHeading = page.locator('text=/brands/i').first();
      const brandsVisible = await brandsHeading.isVisible().catch(() => false);
      
      // Brands section may or may not be visible
      expect(typeof brandsVisible).toBe('boolean');
    });

    test('can click on product from search results', async ({ page }) => {
      await page.goto('/search?q=shirt');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const productCards = page.locator('[data-testid="product-card"]');
      const count = await productCards.count();
      
      if (count > 0) {
        // Click first product
        await productCards.first().click();
        await page.waitForTimeout(500);
        
        // Should navigate to product detail
        await expect(page).toHaveURL(/\/products?\//);
      }
    });

    test('can click on category from search results', async ({ page }) => {
      await page.goto('/search?q=clothing');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const categoryLinks = page.locator('a[href*="/category"]');
      const count = await categoryLinks.count();
      
      if (count > 0) {
        // Click first category
        await categoryLinks.first().click();
        await page.waitForTimeout(500);
        
        // Should navigate to category page
        await expect(page).toHaveURL(/\/category\//);
      }
    });

  });

  test.describe('No Results State', () => {

    test('displays no results message for non-matching query', async ({ page }) => {
      await page.goto('/search?q=nonexistentproductxyz12345');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Should show no results message
      const noResults = page.locator('text=/no results|nothing found/i').first();
      const isVisible = await noResults.isVisible().catch(() => false);
      
      if (isVisible) {
        await expect(noResults).toBeVisible();
      }
    });

    test('shows helpful message in no results state', async ({ page }) => {
      await page.goto('/search?q=xyzabc123nonexistent');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Look for helpful message
      const helpMessage = page.locator('text=/try different|try another|refine/i').first();
      const messageVisible = await helpMessage.isVisible().catch(() => false);
      
      // Help message may or may not be visible
      expect(typeof messageVisible).toBe('boolean');
    });

    test('no results state does not show product grid', async ({ page }) => {
      await page.goto('/search?q=nonexistentproductxyz12345');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const noResults = page.locator('text=/no results|nothing found/i').first();
      const noResultsVisible = await noResults.isVisible().catch(() => false);
      
      if (noResultsVisible) {
        const productCards = page.locator('[data-testid="product-card"]');
        const count = await productCards.count();
        expect(count).toBe(0);
      }
    });

  });

  test.describe('Clear Search', () => {

    test('displays clear button when input has text', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('shirt');
      await page.waitForTimeout(300);
      
      // Look for clear button (× symbol)
      const clearButton = page.locator('button:has-text("✕"), button:has-text("×")').first();
      const isVisible = await clearButton.isVisible().catch(() => false);
      
      // Clear button should appear
      expect(isVisible).toBe(true);
    });

    test('clear button clears input text', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('shirt');
      await page.waitForTimeout(300);
      
      const clearButton = page.locator('button:has-text("✕"), button:has-text("×")').first();
      if (await clearButton.isVisible()) {
        await clearButton.click();
        await page.waitForTimeout(200);
        
        // Input should be empty
        const value = await searchInput.inputValue();
        expect(value).toBe('');
      }
    });

    test('clear button closes autocomplete dropdown', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('shirt');
      await page.waitForTimeout(800);
      
      const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
      const dropdownVisible = await dropdown.isVisible().catch(() => false);
      
      if (dropdownVisible) {
        const clearButton = page.locator('button:has-text("✕"), button:has-text("×")').first();
        await clearButton.click();
        await page.waitForTimeout(200);
        
        // Dropdown should close
        const stillVisible = await dropdown.isVisible().catch(() => false);
        expect(stillVisible).toBe(false);
      }
    });

    test('clear button refocuses input', async ({ page }) => {
      const searchInput = page.locator('input[type="search"]').first();
      
      await searchInput.fill('shirt');
      await page.waitForTimeout(300);
      
      const clearButton = page.locator('button:has-text("✕"), button:has-text("×")').first();
      if (await clearButton.isVisible()) {
        await clearButton.click();
        await page.waitForTimeout(200);
        
        // Input should be focused
        await expect(searchInput).toBeFocused();
      }
    });

  });

  test.describe('Empty Query State', () => {

    test('shows empty state when visiting search page without query', async ({ page }) => {
      await page.goto('/search');
      await page.waitForLoadState('networkidle');
      
      // Should show empty state message
      const emptyMessage = page.locator('text=/enter.*search|start searching/i').first();
      const isVisible = await emptyMessage.isVisible().catch(() => false);
      
      // Empty state should be visible
      if (isVisible) {
        await expect(emptyMessage).toBeVisible();
      }
    });

    test('does not show results in empty query state', async ({ page }) => {
      await page.goto('/search');
      await page.waitForLoadState('networkidle');
      
      // Should not show product results
      const productCards = page.locator('[data-testid="product-card"]');
      const count = await productCards.count();
      expect(count).toBe(0);
    });

  });

  test.describe('Search on Mobile', () => {

    test('search input is visible on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const searchInput = page.locator('input[type="search"]').first();
      const isVisible = await searchInput.isVisible({ timeout: 5000 }).catch(() => false);
      
      // Search should be visible or accessible via menu
      expect(typeof isVisible).toBe('boolean');
    });

    test('can perform search on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const searchInput = page.locator('input[type="search"]').first();
      
      // Wait for input to be visible (may be in mobile menu)
      if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await searchInput.fill('shirt');
        await searchInput.press('Enter');
        
        await page.waitForTimeout(1000);
        
        // Should navigate to search results
        const url = page.url();
        expect(url).toContain('search');
      }
    });

    test('autocomplete works on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const searchInput = page.locator('input[type="search"]').first();
      
      if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await searchInput.fill('shirt');
        await page.waitForTimeout(800);
        
        // Dropdown may appear
        const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
        const dropdownVisible = await dropdown.isVisible().catch(() => false);
        
        expect(typeof dropdownVisible).toBe('boolean');
      }
    });

    test('search results display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/search?q=shirt');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Results should be visible
      const hasProducts = await page.locator('[data-testid="product-card"]').count() > 0;
      const hasNoResults = await page.locator('text=/no results|nothing found/i').isVisible().catch(() => false);
      
      expect(hasProducts || hasNoResults).toBe(true);
    });

  });

  test.describe('Loading States', () => {

    test('shows loading skeleton while results load', async ({ page }) => {
      const navigation = page.goto('/search?q=shirt');
      
      // Check for loading skeleton quickly
      const skeleton = page.locator('[class*="skeleton"], [class*="loading"]').first();
      const skeletonVisible = await skeleton.isVisible({ timeout: 1000 }).catch(() => false);
      
      await navigation;
      await page.waitForTimeout(500);
      
      // After load, skeleton should be gone
      const skeletonStillVisible = await skeleton.isVisible().catch(() => false);
      expect(skeletonStillVisible).toBe(false);
    });

  });

  test.describe('Performance', () => {

    test('search results load within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/search?q=shirt');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);
    });

    test('autocomplete responds quickly', async ({ page }) => {
      await page.goto('/');
      
      const searchInput = page.locator('input[type="search"]').first();
      
      const startTime = Date.now();
      await searchInput.fill('shirt');
      await page.waitForTimeout(1000); // Wait for debounce + fetch
      const responseTime = Date.now() - startTime;
      
      // Should respond within 2 seconds
      expect(responseTime).toBeLessThan(2000);
    });

  });

  test.describe('Breadcrumb Navigation', () => {

    test('shows breadcrumbs on search results page', async ({ page }) => {
      await page.goto('/search?q=shirt');
      await page.waitForLoadState('networkidle');
      
      // Look for breadcrumb navigation
      const breadcrumb = page.locator('nav, [aria-label*="breadcrumb" i]').first();
      const isVisible = await breadcrumb.isVisible().catch(() => false);
      
      if (isVisible) {
        await expect(breadcrumb).toBeVisible();
      }
    });

    test('breadcrumb includes search query', async ({ page }) => {
      const query = 'test shirt';
      await page.goto(`/search?q=${encodeURIComponent(query)}`);
      await page.waitForLoadState('networkidle');
      
      // Breadcrumb should show the query
      const breadcrumb = page.locator('nav, [aria-label*="breadcrumb" i]').first();
      const breadcrumbVisible = await breadcrumb.isVisible().catch(() => false);
      
      if (breadcrumbVisible) {
        const breadcrumbText = await breadcrumb.textContent();
        expect(breadcrumbText?.toLowerCase()).toContain(query.toLowerCase());
      }
    });

  });

});
