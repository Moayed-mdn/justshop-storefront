/**
 * Search Testing Helpers
 * 
 * Utilities for search testing in JustShop Frontend.
 * Based on actual search implementation:
 * - Apollo Client GraphQL search (app/plugins/apollo.client.ts)
 * - HeaderSearchInput component (app/components/header/HeaderSearchInput.vue)
 * - GraphQL autocomplete query (graphql/queries/search.ts)
 * - Search results page (pages/shop/search/[query].vue)
 */

import { Page, expect } from '@playwright/test';

/**
 * Suggestion types from actual GraphQL schema
 */
export type SuggestionType = 'PRODUCT' | 'CATEGORY' | 'BRAND';

export interface SearchSuggestion {
  type: SuggestionType;
  text: string;
  slug: string;
  image?: string;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  inStock?: boolean;
  onSale?: boolean;
}

/**
 * Perform search via header search input
 */
export async function searchViaHeader(
  page: Page,
  query: string
): Promise<void> {
  // Find search input (HeaderSearchInput.vue has input[type="search"])
  const searchInput = page.locator('input[type="search"]').first();
  
  await searchInput.fill(query);
  await searchInput.press('Enter');
  
  // Wait for navigation to search results page
  await page.waitForURL(/\/shop\/search/);
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate directly to search results page
 */
export async function goToSearchResults(
  page: Page,
  query: string
): Promise<void> {
  await page.goto(`/shop/search/${encodeURIComponent(query)}`);
  await page.waitForLoadState('networkidle');
}

/**
 * Get autocomplete suggestions
 * Waits for dropdown to appear after typing
 */
export async function getAutocompleteSuggestions(
  page: Page,
  query: string
): Promise<string[]> {
  const searchInput = page.locator('input[type="search"]').first();
  
  // Clear and type query
  await searchInput.clear();
  await searchInput.fill(query);
  
  // Wait for autocomplete dropdown (SearchDropdown component)
  const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
  await dropdown.waitFor({ state: 'visible', timeout: 5000 });
  
  // Get suggestion items
  const suggestions = dropdown.locator('[data-suggestion-item], li, button');
  const count = await suggestions.count();
  
  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    const text = await suggestions.nth(i).textContent();
    if (text) {
      results.push(text.trim());
    }
  }
  
  return results;
}

/**
 * Select autocomplete suggestion by index
 */
export async function selectAutocompleteSuggestion(
  page: Page,
  index: number
): Promise<void> {
  const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
  await dropdown.waitFor({ state: 'visible' });
  
  const suggestions = dropdown.locator('[data-suggestion-item], li, button');
  await suggestions.nth(index).click();
  
  await page.waitForLoadState('networkidle');
}

/**
 * Select autocomplete suggestion by text
 */
export async function selectAutocompleteSuggestionByText(
  page: Page,
  text: string
): Promise<void> {
  const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
  await dropdown.waitFor({ state: 'visible' });
  
  const suggestion = dropdown.locator(`text=${text}`).first();
  await suggestion.click();
  
  await page.waitForLoadState('networkidle');
}

/**
 * Clear search input
 */
export async function clearSearch(page: Page): Promise<void> {
  const searchInput = page.locator('input[type="search"]').first();
  
  // Look for clear button (HeaderSearchInput has × button)
  const clearButton = searchInput.locator('..').locator('button:has-text("×")');
  
  if (await clearButton.isVisible()) {
    await clearButton.click();
  } else {
    await searchInput.clear();
  }
}

/**
 * Apply search filters
 * Based on actual filter UI implementation
 */
export async function applySearchFilters(
  page: Page,
  filters: SearchFilters
): Promise<void> {
  if (filters.category) {
    const categoryFilter = page.locator(`[data-filter="category"] input[value="${filters.category}"], button:has-text("${filters.category}")`);
    await categoryFilter.click();
  }
  
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    if (filters.minPrice !== undefined) {
      const minPriceInput = page.locator('[data-filter="min-price"], input[name="min_price"]');
      await minPriceInput.fill(String(filters.minPrice));
    }
    
    if (filters.maxPrice !== undefined) {
      const maxPriceInput = page.locator('[data-filter="max-price"], input[name="max_price"]');
      await maxPriceInput.fill(String(filters.maxPrice));
    }
  }
  
  if (filters.brands && filters.brands.length > 0) {
    for (const brand of filters.brands) {
      const brandCheckbox = page.locator(`[data-filter="brand"] input[value="${brand}"]`);
      await brandCheckbox.check();
    }
  }
  
  if (filters.inStock) {
    const inStockCheckbox = page.locator('[data-filter="in-stock"], input[name="in_stock"]');
    await inStockCheckbox.check();
  }
  
  if (filters.onSale) {
    const onSaleCheckbox = page.locator('[data-filter="on-sale"], input[name="on_sale"]');
    await onSaleCheckbox.check();
  }
  
  // Wait for results to update
  await page.waitForLoadState('networkidle');
}

/**
 * Clear all search filters
 */
export async function clearSearchFilters(page: Page): Promise<void> {
  const clearButton = page.locator('[data-filter-action="clear"], button:has-text("Clear")').first();
  
  if (await clearButton.isVisible()) {
    await clearButton.click();
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Get search results count
 */
export async function getSearchResultsCount(page: Page): Promise<number> {
  // Look for results count text or product grid items
  const resultsText = page.locator('[data-results-count], [class*="results-count"]').first();
  
  if (await resultsText.isVisible()) {
    const text = await resultsText.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
  
  // Fallback: count product cards
  const productCards = page.locator('[data-product-card], [class*="product-card"]');
  return await productCards.count();
}

/**
 * Get search results (product names)
 */
export async function getSearchResults(page: Page): Promise<string[]> {
  const productCards = page.locator('[data-product-card], [class*="product-card"]');
  const count = await productCards.count();
  
  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    const nameElement = productCards.nth(i).locator('[data-product-name], h2, h3').first();
    const name = await nameElement.textContent();
    if (name) {
      results.push(name.trim());
    }
  }
  
  return results;
}

/**
 * Sort search results
 */
export async function sortSearchResults(
  page: Page,
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'newest'
): Promise<void> {
  const sortSelect = page.locator('[data-sort-select], select[name="sort"]').first();
  await sortSelect.selectOption(sortBy);
  await page.waitForLoadState('networkidle');
}

/**
 * Change results view (grid/list)
 */
export async function changeResultsView(
  page: Page,
  view: 'grid' | 'list'
): Promise<void> {
  const viewButton = page.locator(`[data-view="${view}"], button[aria-label*="${view}"]`);
  await viewButton.click();
}

/**
 * Navigate to search result by index
 */
export async function clickSearchResult(
  page: Page,
  index: number
): Promise<void> {
  const productCards = page.locator('[data-product-card], [class*="product-card"]');
  await productCards.nth(index).click();
  await page.waitForLoadState('networkidle');
}

/**
 * Wait for search loading to complete
 */
export async function waitForSearchComplete(page: Page, timeout = 10000): Promise<void> {
  // Wait for loading spinner to disappear
  const spinner = page.locator('[class*="search-spinner"], [class*="loading"]').first();
  
  if (await spinner.isVisible({ timeout: 1000 }).catch(() => false)) {
    await spinner.waitFor({ state: 'hidden', timeout });
  }
  
  await page.waitForLoadState('networkidle');
}

/**
 * Assert search shows results
 */
export async function assertSearchHasResults(page: Page): Promise<void> {
  const count = await getSearchResultsCount(page);
  expect(count).toBeGreaterThan(0);
}

/**
 * Assert search shows no results
 */
export async function assertSearchNoResults(page: Page): Promise<void> {
  // Look for "no results" message
  const noResultsMessage = page.locator('text=/no results|nothing found/i').first();
  await expect(noResultsMessage).toBeVisible();
  
  const count = await getSearchResultsCount(page);
  expect(count).toBe(0);
}

/**
 * Assert autocomplete dropdown is visible
 */
export async function assertAutocompleteVisible(page: Page): Promise<void> {
  const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
  await expect(dropdown).toBeVisible();
}

/**
 * Assert autocomplete has suggestions
 */
export async function assertAutocompleteHasSuggestions(
  page: Page,
  minCount = 1
): Promise<void> {
  const dropdown = page.locator('[class*="SearchDropdown"], [data-component="search-dropdown"]').first();
  await expect(dropdown).toBeVisible();
  
  const suggestions = dropdown.locator('[data-suggestion-item], li, button');
  const count = await suggestions.count();
  
  expect(count).toBeGreaterThanOrEqual(minCount);
}

/**
 * Assert search results contain query
 */
export async function assertResultsContainQuery(
  page: Page,
  query: string
): Promise<void> {
  const results = await getSearchResults(page);
  const queryLower = query.toLowerCase();
  
  const hasMatch = results.some((result) =>
    result.toLowerCase().includes(queryLower)
  );
  
  expect(hasMatch).toBe(true);
}
