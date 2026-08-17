/**
 * Centralized Cache Key Generation for Network/Data Deduplication
 * 
 * All cache keys MUST include locale to prevent mixing EN/AR data.
 * Multi-tenant keys SHOULD include tenantSlug for data isolation.
 * 
 * Format: `{locale}:{tenantSlug}:{resource}:{identifier}:{variant}`
 * 
 * Examples:
 * - en:demo-store:product:laptop-slug
 * - ar:acme-shop:categories:page
 * - en:merchant-store:cart:items
 * - ar:fashion-store:user:profile
 */

import type { StorefrontContext } from '../tenant/types'
import { useStorefrontContext } from '../tenant/composables'

export interface CacheKeyOptions {
  locale: string
  tenantSlug?: string | null
  // ⚠️ Several call sites pass `tenantId` (e.g. app.vue, categories.vue,
  // ShopGridSection.vue) — accept it explicitly so tenant scoping doesn't
  // silently get dropped from the cache key when only an id (not a slug)
  // is available at the call site.
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
 * createCacheKey({ locale: 'en', tenantSlug: 'demo-store', resource: 'product', identifier: 'laptop-x1' })
 * // => 'en:demo-store:product:laptop-x1'
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

  // 2. Tenant Slug (optional but recommended for multi-tenant data)
  if (options.tenantSlug) {
    parts.push(String(options.tenantSlug))
  } else if (options.tenantId !== undefined && options.tenantId !== null) {
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
 * Automatically extracts locale and tenantSlug
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
  options: Omit<CacheKeyOptions, 'locale' | 'tenantSlug'>
): string => {
  return createCacheKey({
    locale: context.locale || 'en',
    tenantSlug: context.tenant?.slug,
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
    options: Omit<CacheKeyOptions, 'locale' | 'tenantSlug'>
  ): string => {
    const context = useStorefrontContext()
    const { locale } = useI18n()
    
    return createCacheKey({
      locale: locale.value,
      tenantSlug: context.value.tenant?.slug,
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
export const clearResourceCache = (resource: string | string[], options?: { locale?: string; tenantSlug?: string | null }) => {
  const resources = Array.isArray(resource) ? resource : [resource]
  const loc = options?.locale ?? ''
  const ts = options?.tenantSlug
  
  const patterns = resources.flatMap(r =>
    ts ? [`${loc}:${r}:`, `${loc}:${ts}:${r}:`] : [`${loc}:${r}:`]
  )
  
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
export const refreshResourceCache = async (resource: string | string[], options?: { locale?: string; tenantSlug?: string | null }) => {
  const resources = Array.isArray(resource) ? resource : [resource]
  const loc = options?.locale ?? ''
  const ts = options?.tenantSlug
  
  const patterns = resources.flatMap(r =>
    ts ? [`${loc}:${r}:`, `${loc}:${ts}:${r}:`] : [`${loc}:${r}:`]
  )
  
  for (const pattern of patterns) {
    await refreshNuxtData((key) => key.startsWith(pattern))
  }
}
