# Network/Data Deduplication & Caching Strategy

**Last Updated**: June 16, 2026  
**Status**: ✅ Active

---

## Overview

This document describes JustShop's centralized caching and network deduplication strategy using Nuxt's built-in `useAsyncData` composable with locale and tenant-aware cache keys.

---

## The Problem

Without proper cache keys, multi-lingual applications face critical issues:

```typescript
// ❌ BAD: Static key mixes English and Arabic data
const { data } = await useAsyncData('product-laptop', () => fetchProduct('laptop'))

// User switches from EN → AR
// Still sees cached English data! 🐛
```

**Issues without locale-aware keys:**
1. Language switching shows stale data
2. Multiple components fetching same data create duplicate network requests
3. SSR hydration can mismatch server/client data
4. No way to invalidate specific resource caches

---

## The Solution

**Locale and tenant-aware cache keys:**

```typescript
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

const { getCacheKey } = useCacheKey()

// ✅ GOOD: Locale-aware key
const { data } = await useAsyncData(
  getCacheKey({ resource: CacheResources.PRODUCT_DETAIL, identifier: 'laptop' }),
  () => fetchProduct('laptop')
)
// EN: 'en:123:product:laptop'
// AR: 'ar:123:product:laptop'
// Separate caches! ✅
```

---

## Cache Key Format

### Standard Format

```
{locale}:{tenantId}:{resource}:{identifier}:{variant}:{params}
```

### Examples

| Scenario | Key | Components |
|----------|-----|------------|
| Product detail (EN) | `en:123:product:laptop-x1` | locale, tenant, resource, identifier |
| Product detail (AR) | `ar:123:product:laptop-x1` | Same resource, different locale |
| Categories page | `en:categories:page` | locale, resource, variant |
| Filtered products | `en:products:category=electronics:page=2` | locale, resource, params |
| User orders | `en:123:orders:list` | locale, tenant, resource, variant |
| Search results | `en:search:laptop:q=gaming` | locale, resource, identifier, params |

---

## Core API

### 1. `useCacheKey()` Composable

**Automatically includes locale and tenant from context:**

```typescript
const { getCacheKey } = useCacheKey()

const key = getCacheKey({
  resource: CacheResources.PRODUCT_DETAIL,
  identifier: productSlug,
})
// Returns: 'en:123:product:laptop-x1'
```

### 2. `createCacheKey()` Function

**Manual key generation with full control:**

```typescript
import { createCacheKey } from '~~/src/core/cache/createCacheKey'

const key = createCacheKey({
  locale: 'ar',
  tenantId: 456,
  resource: 'product',
  identifier: 'laptop-x1',
})
// Returns: 'ar:456:product:laptop-x1'
```

### 3. `CacheResources` Constants

**Standardized resource names:**

```typescript
import { CacheResources } from '~~/src/core/cache/createCacheKey'

// Products
CacheResources.PRODUCT_DETAIL       // 'product'
CacheResources.PRODUCT_LIST         // 'products'
CacheResources.PRODUCT_RELATED      // 'product-related'

// Categories
CacheResources.CATEGORIES_LIST      // 'categories'
CacheResources.CATEGORY_DETAIL      // 'category'

// Cart
CacheResources.CART_ITEMS           // 'cart'

// User
CacheResources.USER_PROFILE         // 'user'
CacheResources.USER_ORDERS          // 'orders'

// Store
CacheResources.STORE_THEME          // 'store-theme'
CacheResources.STORE_NAVIGATION     // 'navigation'

// Search
CacheResources.SEARCH_RESULTS       // 'search'
```

### 4. Cache Invalidation

**Clear cache after mutations:**

```typescript
import { clearResourceCache } from '~~/src/core/cache/createCacheKey'

// After adding to cart
await clearResourceCache(CacheResources.CART_ITEMS)

// After updating product, clear related caches
await clearResourceCache([
  CacheResources.PRODUCT_DETAIL,
  CacheResources.PRODUCT_LIST,
  CacheResources.PRODUCT_RELATED,
])
```

**Refresh cache (refetch):**

```typescript
import { refreshResourceCache } from '~~/src/core/cache/createCacheKey'

// After login, refresh user-specific data
await refreshResourceCache([
  CacheResources.USER_PROFILE,
  CacheResources.USER_ORDERS,
  CacheResources.CART_ITEMS,
])
```

---

## Usage Patterns

### Pattern 1: Simple Resource

**Single product detail:**

```typescript
// composables/useProductDetail.ts
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

export const useProductDetail = (slug: string) => {
  const { getCacheKey } = useCacheKey()
  const api = useApi()

  const { data: product, pending, error } = useAsyncData(
    getCacheKey({
      resource: CacheResources.PRODUCT_DETAIL,
      identifier: slug,
    }),
    () => api(API_ROUTES.products.detail(slug))
  )

  return { product, pending, error }
}
```

**Usage in component:**

```vue
<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// Automatic deduplication across components!
const { product, pending } = useProductDetail(slug)
</script>
```

### Pattern 2: Paginated List

**Products with filters:**

```typescript
export const useProductList = (filters: ProductFilters) => {
  const { getCacheKey } = useCacheKey()
  const api = useApi()

  const { data: products, pending } = useAsyncData(
    getCacheKey({
      resource: CacheResources.PRODUCT_LIST,
      params: {
        category: filters.category,
        page: filters.page,
        sort: filters.sort,
      },
    }),
    () => api(API_ROUTES.products.list, { query: filters })
  )

  return { products, pending }
}
```

### Pattern 3: Locale-Dependent Content

**Categories page:**

```typescript
export const useCategories = () => {
  const { getCacheKey } = useCacheKey()
  const api = useApi()

  const { data: categories, pending } = useAsyncData(
    getCacheKey({
      resource: CacheResources.CATEGORIES_LIST,
      variant: 'page',
    }),
    () => api(API_ROUTES.storefront.categories)
  )

  return { categories, pending }
}
```

### Pattern 4: Search Results

**GraphQL search with locale:**

```typescript
export const useSearch = (query: string) => {
  const { getCacheKey } = useCacheKey()
  const apollo = useNuxtApp().$apollo

  const { data: results, pending } = useAsyncData(
    getCacheKey({
      resource: CacheResources.SEARCH_RESULTS,
      identifier: query,
    }),
    () => apollo.query({
      query: SEARCH_QUERY,
      variables: { query, locale: useI18n().locale.value },
    })
  )

  return { results, pending }
}
```

### Pattern 5: Mutation with Cache Invalidation

**Add to cart:**

```typescript
export const useCart = () => {
  const { getCacheKey } = useCacheKey()
  const api = useApi()

  // Fetch cart
  const { data: cart, refresh } = useAsyncData(
    getCacheKey({ resource: CacheResources.CART_ITEMS }),
    () => api(API_ROUTES.cart.index)
  )

  // Add item
  const addItem = async (item: AddToCartPayload) => {
    await api(API_ROUTES.cart.add, {
      method: 'POST',
      body: item,
    })

    // Invalidate and refetch
    await clearResourceCache(CacheResources.CART_ITEMS)
    await refresh()
  }

  return { cart, addItem }
}
```

---

## SSR Considerations

### Server-Side Caching

Keys are the same on server and client, enabling SSR hydration:

```typescript
// Server renders with key: 'en:123:product:laptop'
// Client hydrates with same key: 'en:123:product:laptop'
// No double-fetch! ✅
```

### Watch for Locale Changes

```typescript
const { locale } = useI18n()

const { data } = await useAsyncData(
  getCacheKey({ resource: 'product', identifier: slug }),
  () => fetchProduct(slug),
  {
    watch: [locale], // Refetch when locale changes
  }
)
```

---

## Migration Guide

### Before (No Deduplication)

```typescript
// ❌ OLD: Direct API call, no caching
export const useProductDetail = () => {
  const api = useApi()
  
  const fetchProduct = async (slug: string) => {
    const response = await api(API_ROUTES.products.detail(slug))
    return response.data
  }

  return { fetchProduct }
}

// Usage: Manual fetching in component
const { fetchProduct } = useProductDetail()
const product = ref(null)

onMounted(async () => {
  product.value = await fetchProduct(slug)
})
```

**Issues:**
- ❌ No SSR support
- ❌ Duplicate fetches if multiple components use same product
- ❌ No locale awareness
- ❌ Manual loading states

### After (With Deduplication)

```typescript
// ✅ NEW: useAsyncData with locale-aware key
export const useProductDetail = (slug: string) => {
  const { getCacheKey } = useCacheKey()
  const api = useApi()

  return useAsyncData(
    getCacheKey({
      resource: CacheResources.PRODUCT_DETAIL,
      identifier: slug,
    }),
    () => api(API_ROUTES.products.detail(slug))
  )
}

// Usage: Declarative in component
const { data: product, pending, error } = useProductDetail(slug)
```

**Benefits:**
- ✅ SSR support
- ✅ Automatic deduplication
- ✅ Locale-aware caching
- ✅ Built-in loading/error states

---

## Testing

### Test Cache Keys

```typescript
import { describe, it, expect } from 'vitest'
import { createCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

describe('createCacheKey', () => {
  it('includes locale in key', () => {
    const key = createCacheKey({
      locale: 'en',
      resource: CacheResources.PRODUCT_DETAIL,
      identifier: 'laptop',
    })
    
    expect(key).toBe('en:product:laptop')
  })

  it('generates different keys for different locales', () => {
    const enKey = createCacheKey({ locale: 'en', resource: 'product', identifier: 'laptop' })
    const arKey = createCacheKey({ locale: 'ar', resource: 'product', identifier: 'laptop' })
    
    expect(enKey).not.toBe(arKey)
  })
})
```

---

## Best Practices

### ✅ DO

1. **Always use locale-aware keys** for user-facing content
2. **Use `CacheResources` constants** for consistency
3. **Invalidate cache after mutations** (add to cart, update profile, etc.)
4. **Watch locale changes** for dynamic refetching
5. **Use `useAsyncData` for SSR-compatible fetching**

### ❌ DON'T

1. **Don't use static keys** for locale-dependent data
2. **Don't bypass cache keys** with direct `$fetch` calls
3. **Don't forget tenant isolation** for multi-tenant resources
4. **Don't manually manage loading states** (use `pending` from `useAsyncData`)
5. **Don't cache user-specific data** without including user ID in key

---

## Troubleshooting

### Issue: Seeing old data after language switch

**Cause**: Cache key doesn't include locale

**Fix**:
```typescript
// ❌ BAD
useAsyncData('products', () => fetchProducts())

// ✅ GOOD
useAsyncData(
  getCacheKey({ resource: CacheResources.PRODUCT_LIST }),
  () => fetchProducts()
)
```

### Issue: Multiple network requests for same data

**Cause**: Different components using different keys

**Fix**: Ensure all components use the same cache key format via composable

### Issue: Stale data after mutation

**Cause**: Cache not invalidated

**Fix**:
```typescript
await api.updateProduct(id, data)
await clearResourceCache(CacheResources.PRODUCT_DETAIL)
```

---

## Related Documentation

- [Nuxt Data Fetching](https://nuxt.com/docs/getting-started/data-fetching)
- [useAsyncData](https://nuxt.com/docs/api/composables/use-async-data)
- [useFetch](https://nuxt.com/docs/api/composables/use-fetch)
- [State Management](./state-management.md)
- [Internationalization](./internationalization.md)

---

**Next Steps:**
1. Migrate existing composables to use `useCacheKey`
2. Add cache invalidation after mutations
3. Update documentation for each composable
4. Add E2E tests for locale switching
