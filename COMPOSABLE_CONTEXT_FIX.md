# 🚨 CRITICAL FIX: Composable Context Error in useAsyncData

## Problem

When using the reactive pattern `useAsyncData(() => key, ...)`, if the arrow function calls **ANY composable** (like `useStorefrontContext()`, `useState()`, etc.), Nuxt throws:

```
Error: [nuxt] A composable that requires access to the Nuxt instance was called 
outside of a plugin, Nuxt hook, Nuxt middleware, or Vue setup function.
```

## Root Cause

The `useCacheKey()` wrapper returns a `getCacheKey()` function that internally calls:
- `useStorefrontContext()` - Uses `useState()`
- `useI18n()` - Nuxt composable

When `useAsyncData(() => getCacheKey({...}), ...)` executes:
1. The arrow function is called by Nuxt internals during key computation
2. This happens **outside** the Vue setup context
3. Composables fail because they require Nuxt context

## Solution

**Use `createCacheKey()` directly** instead of the `useCacheKey()` wrapper, and extract composable values **in setup(), not in the arrow function**:

### ❌ WRONG (Causes Error):
```typescript
const { getCacheKey } = useCacheKey() // Calls composables inside

const { data } = await useAsyncData(
  () => getCacheKey({ resource: 'product' }), // ❌ Calls useStorefrontContext() here!
  async () => { ... }
)
```

### ✅ CORRECT:
```typescript
// Extract composable values in setup()
const storefrontContext = useStorefrontContext()
const { locale } = useI18n()

const { data } = await useAsyncData(
  () => createCacheKey({  // ✅ No composable calls, just value access
    locale: locale.value,
    tenantId: storefrontContext.value.tenant?.id,
    resource: 'product'
  }),
  async () => { ... }
)
```

## Files Fixed

### 1. ✅ `/app/app.vue`
```typescript
// Before:
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'
const { getCacheKey } = useCacheKey()
const { data: themeData } = await useAsyncData(
  () => getCacheKey({ resource: CacheResources.STORE_THEME }),
  async () => { ... }
)

// After:
import { createCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'
import { useStorefrontContext } from '~~/src/core/tenant/composables'
const storefrontContext = useStorefrontContext()
const { locale } = useI18n()
const { data: themeData } = await useAsyncData(
  () => createCacheKey({ 
    locale: locale.value,
    tenantId: storefrontContext.value.tenant?.id,
    resource: CacheResources.STORE_THEME 
  }),
  async () => { ... }
)
```

### 2. ✅ `/app/pages/categories.vue`
```typescript
// Before:
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'
const { getCacheKey } = useCacheKey()
const { data: categories } = await useAsyncData(
  () => getCacheKey({ resource: CacheResources.CATEGORIES_LIST, variant: 'page' }),
  () => api('/storefront/categories', { method: 'GET' })
)

// After:
import { createCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'
import { useStorefrontContext } from '~~/src/core/tenant/composables'
const storefrontContext = useStorefrontContext()
const { locale } = useI18n()
const { data: categories } = await useAsyncData(
  () => createCacheKey({
    locale: locale.value,
    tenantId: storefrontContext.value.tenant?.id,
    resource: CacheResources.CATEGORIES_LIST,
    variant: 'page'
  }),
  () => api('/storefront/categories', { method: 'GET' })
)
```

### 3. ✅ `/app/composables/useProductDetail.ts` - Already Correct!
This composable already works correctly because:
- It's a composable itself (has proper Nuxt context)
- When `getCacheKey()` is called, it's within the composable's execution context

```typescript
export const useProductDetail = (slug: MaybeRef<string>) => {
  const { getCacheKey } = useCacheKey() // ✅ Called in composable context
  
  const { data: product } = useAsyncData(
    () => getCacheKey({ ... }), // ✅ Still in composable context
    async () => { ... }
  )
}
```

## Key Principles

### When to Use `useCacheKey()`:
✅ **Inside composables** (functions starting with `use`)
✅ When the entire code runs in proper Vue/Nuxt context

### When to Use `createCacheKey()` Directly:
✅ **In page components** (`.vue` files in `/pages`)
✅ **In layout components**
✅ **In `app.vue`**
✅ Any top-level component setup where you use `useAsyncData`

## Why This Fixes Reactivity Too

The reactive pattern `() => key` ensures that when `locale.value` or `storefrontContext.value.tenant?.id` changes, the arrow function re-executes and produces a new key, triggering `useAsyncData` to refetch.

**Both problems solved:**
1. ✅ No composable context errors
2. ✅ Reactive cache keys that respond to locale changes

## Testing Checklist

- [x] App loads without errors
- [ ] Switch language EN → AR (should refetch with new cache key)
- [ ] Switch language AR → EN (should refetch with new cache key)
- [ ] Navigate between pages (should use proper locale-specific cache)
- [ ] Check Network tab: cache keys include locale prefix

## Related Documentation

- `REACTIVE_CACHE_KEY_FIX.md` - Language switching reactivity
- `src/core/cache/createCacheKey.ts` - Core cache utility
- `CACHE_DEDUPLICATION_INDEX.md` - Full implementation overview
