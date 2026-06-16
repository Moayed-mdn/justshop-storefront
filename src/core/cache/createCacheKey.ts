/**
 * Centralized Cache Key Generation for Network/Data Deduplication
 * 
 * All cache keys MUST include locale to prevent mixing EN/AR data.
 * Multi-tenant keys SHOULD include tenantId for data isolation.
 * 
 * Format: `{locale}:{tenantId}:{resource}:{identifier}:{variant}`
 * 
 * Examples:
 * - en:123:product:laptop-slug
 * - ar:123:categories:page
 * - en:456:cart:items
 * - ar:789:user:profile
 */

import type { StorefrontContext } from '../tenant/types'
import { useStorefrontContext } from '../tenant/composables'

export interface CacheKeyOptions {
  locale: string
  tenantId?: string | number | null
  resource: string
  identifier?: string | number
  variant?: string
  params?: Record<string, unknown>
}

/**
 * Generate a structured cache key for useAsyncData
 * 
 * @example
 * createCacheKey({ locale: 'en', tenantId: 123, resource: 'product', identifier: 'laptop-x1' })
 * // => 'en:123:product:laptop-x1'
 * 
 * @example
 * createCacheKey({ locale: 'ar', resource: 'categories', variant: 'page' })
 * // => 'ar:categories:page'
 * 
 * @example
 * createCacheKey({ 
 *   locale: 'en', 
 *   resource: 'products', 
 *   params: { category: 'electronics', page: 2 } 
 * })
 * // => 'en:products:category=electronics:page=2'
 */
export const createCacheKey = (options: CacheKeyOptions): string => {
  const parts: string[] = []

  // 1. Locale (REQUIRED - prevents EN/AR data mixing)
  parts.push(options.locale)

  // 2. Tenant ID (optional but recommended for multi-tenant data)
  if (options.tenantId) {
    parts.push(String(options.tenantId))
  }

  // 3. Resource type (REQUIRED)
  parts.push(options.resource)

  // 4. Identifier (optional - slug, id, etc.)
  if (options.identifier !== undefined && options.identifier !== null) {
    parts.push(String(options.identifier))
  }

  // 5. Variant (optional - 'page', 'list', 'detail', etc.)
  if (options.variant) {
    parts.push(options.variant)
  }

  // 6. Query params (optional - for filtered lists)
  if (options.params && Object.keys(options.params).length > 0) {
    const sortedEntries = Object.entries(options.params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .sort(([a], [b]) => a.localeCompare(b))
    
    for (const [key, value] of sortedEntries) {
      if (Array.isArray(value)) {
        parts.push(`${key}=${value.join(',')}`)
      } else {
        parts.push(`${key}=${String(value)}`)
      }
    }
  }

  return parts.join(':')
}

/**
 * Helper to create cache keys from storefront context
 * Automatically extracts locale and tenantId
 * 
 * @example
 * const context = useStorefrontContext()
 * const key = createContextCacheKey(context.value, {
 *   resource: 'product',
 *   identifier: 'laptop-x1'
 * })
 */
export const createContextCacheKey = (
  context: StorefrontContext,
  options: Omit<CacheKeyOptions, 'locale' | 'tenantId'>
): string => {
  return createCacheKey({
    locale: context.locale || 'en',
    tenantId: context.tenant?.id,
    ...options,
  })
}

/**
 * Composable wrapper for easy cache key generation
 * 
 * @example
 * const { getCacheKey } = useCacheKey()
 * const key = getCacheKey({ resource: 'product', identifier: slug })
 */
export const useCacheKey = () => {
  // Lazy evaluation - only call composables when getCacheKey is called
  const getCacheKey = (
    options: Omit<CacheKeyOptions, 'locale' | 'tenantId'>
  ): string => {
    const context = useStorefrontContext()
    const { locale } = useI18n()
    
    return createCacheKey({
      locale: locale.value,
      tenantId: context.value.tenant?.id,
      ...options,
    })
  }

  return {
    getCacheKey,
  }
}

/**
 * Cache key patterns for common resources
 * Use these constants for consistency
 */
export const CacheResources = {
  // Products
  PRODUCT_DETAIL: 'product',
  PRODUCT_LIST: 'products',
  PRODUCT_RELATED: 'product-related',
  PRODUCT_SEARCH: 'product-search',
  
  // Categories
  CATEGORIES_LIST: 'categories',
  CATEGORY_DETAIL: 'category',
  
  // Cart
  CART_ITEMS: 'cart',
  CART_SUMMARY: 'cart-summary',
  
  // User/Auth
  USER_PROFILE: 'user',
  USER_ORDERS: 'orders',
  USER_ORDER_DETAIL: 'order',
  
  // Store/Theme
  STORE_THEME: 'store-theme',
  STORE_NAVIGATION: 'navigation',
  STORE_SETTINGS: 'store-settings',
  
  // Search
  SEARCH_RESULTS: 'search',
  SEARCH_AUTOCOMPLETE: 'search-autocomplete',
  
  // Content
  HERO_BANNERS: 'hero-banners',
  
  // Runtime
  RUNTIME_PAGE: 'runtime-page',
  RUNTIME_ROUTE: 'runtime-route',
} as const

/**
 * Helper to invalidate cache for a specific resource
 * 
 * @example
 * // After adding to cart, invalidate cart cache
 * await clearResourceCache('cart')
 * 
 * @example
 * // After updating product, invalidate all related caches
 * await clearResourceCache(['product', 'products', 'product-related'])
 */
export const clearResourceCache = (resource: string | string[]) => {
  const resources = Array.isArray(resource) ? resource : [resource]
  const { locale } = useI18n()
  const context = useStorefrontContext()
  
  // Build pattern to match all keys for these resources
  const patterns = resources.flatMap(r => [
    `${locale.value}:${r}:`,
    `${locale.value}:${context.value.tenant?.id}:${r}:`,
  ])
  
  // Clear matching keys
  for (const pattern of patterns) {
    clearNuxtData((key) => key.startsWith(pattern))
  }
}

/**
 * Helper to refresh cache for a specific resource
 * Useful after mutations to refetch fresh data
 * 
 * @example
 * // After adding to cart, refresh cart data
 * await refreshResourceCache('cart')
 */
export const refreshResourceCache = async (resource: string | string[]) => {
  const resources = Array.isArray(resource) ? resource : [resource]
  const { locale } = useI18n()
  const context = useStorefrontContext()
  
  const patterns = resources.flatMap(r => [
    `${locale.value}:${r}:`,
    `${locale.value}:${context.value.tenant?.id}:${r}:`,
  ])
  
  for (const pattern of patterns) {
    await refreshNuxtData((key) => key.startsWith(pattern))
  }
}
