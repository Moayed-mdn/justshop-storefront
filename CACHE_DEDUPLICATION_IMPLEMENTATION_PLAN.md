# 🎯 Cache Deduplication Implementation Plan

**Created**: June 16, 2026  
**Status**: Ready to Implement  
**Priority**: 🔥 Critical

---

## Executive Summary

Your Nuxt project currently has **critical locale mixing bugs** because cache keys don't include the locale. When users switch from English to Arabic (or vice versa), they see stale data in the wrong language.

**Example of the bug:**
```typescript
// ❌ CURRENT: Static key in app.vue
useAsyncData('store-theme', fetchTheme)

// User sees English theme → switches to Arabic → still sees English theme! 🐛
```

**The fix:**
```typescript
// ✅ FIXED: Locale-aware key
useAsyncData('en:123:store-theme', fetchTheme)  // English
useAsyncData('ar:123:store-theme', fetchTheme)  // Arabic (separate cache)
```

---

## What I've Created for You

### 1. ✅ Core Utility: `/src/core/cache/createCacheKey.ts`

A centralized cache key generator that:
- ✅ Always includes locale (prevents EN/AR mixing)
- ✅ Includes tenant ID for multi-tenant isolation
- ✅ Provides consistent key format across the app
- ✅ Includes cache invalidation helpers

**Usage**:
```typescript
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

const { getCacheKey } = useCacheKey()

const key = getCacheKey({ 
  resource: CacheResources.PRODUCT_DETAIL, 
  identifier: 'laptop' 
})
// Returns: 'en:123:product:laptop' or 'ar:123:product:laptop'
```

### 2. ✅ Documentation: `/docs/architecture/cache-deduplication.md`

Complete guide covering:
- The problem and solution
- Cache key format
- API reference
- Usage patterns
- Testing strategies
- Best practices

### 3. ✅ Migration Guide: `/docs/development/CACHE_DEDUPLICATION_MIGRATION.md`

Step-by-step migration plan with:
- Task breakdown
- Code examples (before/after)
- Testing checklist
- Rollout plan
- Risk assessment

---

## Critical Issues Found

### 🔥 Issue #1: Theme Cache (app.vue)

**File**: `app/app.vue:32`

**Current**:
```typescript
const { data: themeData } = await useAsyncData('store-theme', async () => {
  await fetchTheme()
  // ...
})
```

**Problem**: Static key `'store-theme'` doesn't include locale
**Impact**: Theme colors/fonts don't update when switching EN ↔ AR
**Severity**: 🔥 Critical

**Fix**:
```typescript
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

const { getCacheKey } = useCacheKey()

const { data: themeData } = await useAsyncData(
  getCacheKey({ resource: CacheResources.STORE_THEME }),
  async () => {
    await fetchTheme()
    // ...
  }
)
```

---

### 🔥 Issue #2: Categories Cache (categories.vue)

**File**: `app/pages/categories.vue:106`

**Current**:
```typescript
const { data: categories, pending } = await useAsyncData(
  'categories-page',
  () => api('/storefront/categories', { method: 'GET' }),
  // ...
)
```

**Problem**: Static key `'categories-page'`
**Impact**: Categories show in wrong language after locale switch
**Severity**: 🔥 Critical

**Fix**:
```typescript
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

const { getCacheKey } = useCacheKey()

const { data: categories, pending } = await useAsyncData(
  getCacheKey({ resource: CacheResources.CATEGORIES_LIST, variant: 'page' }),
  () => api('/storefront/categories', { method: 'GET' }),
  // ...
)
```

---

### ⚠️ Issue #3: No Network Deduplication in Composables

**Files**: 
- `app/composables/useProductDetail.ts`
- `app/composables/useAuth.ts`
- `app/composables/useCart.ts`
- `app/composables/useOrders.ts`
- `app/composables/useProfile.ts`
- Many others...

**Problem**: Using direct API calls instead of `useAsyncData`
**Impact**: 
- Multiple components fetching same product = duplicate network requests
- No SSR support
- Manual loading state management

**Example - useProductDetail.ts**:

**Current (No Caching)**:
```typescript
export const useProductDetail = () => {
  const api = useApi()
  
  const fetchProduct = async (slug: string) => {
    const response = await api(API_ROUTES.products.detail(slug))
    return response.data
  }

  return { fetchProduct }
}
```

**Fixed (With Caching)**:
```typescript
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

export const useProductDetail = (slug: Ref<string> | string) => {
  const { getCacheKey } = useCacheKey()
  const api = useApi()
  const productSlug = isRef(slug) ? slug : ref(slug)

  const { data: product, pending, error } = useAsyncData(
    () => getCacheKey({
      resource: CacheResources.PRODUCT_DETAIL,
      identifier: productSlug.value,
    }),
    () => api(API_ROUTES.products.detail(productSlug.value)),
    {
      transform: (response) => response?.data,
      watch: [productSlug],
    }
  )

  return { product, pending, error }
}
```

---

### ⚠️ Issue #4: No Cache Invalidation After Mutations

**Problem**: After adding to cart, updating profile, etc., cached data becomes stale

**Example - Cart Operations**:

**Current**:
```typescript
// In useCartStore()
const addItem = async (payload) => {
  await api.post('/cart/items', payload)
  // ❌ Cart count in header still shows old value!
}
```

**Fixed**:
```typescript
import { clearResourceCache, CacheResources } from '~~/src/core/cache/createCacheKey'

const addItem = async (payload) => {
  await api.post('/cart/items', payload)
  
  // ✅ Invalidate cart cache
  await clearResourceCache(CacheResources.CART_ITEMS)
}
```

---

## Implementation Phases

### 🔥 Phase 1: Fix Critical Bugs (Day 1 - URGENT)

**Priority**: These are breaking user experience NOW

1. **Fix app.vue theme key**
   - File: `app/app.vue`
   - Time: 10 minutes
   - Risk: Low

2. **Fix categories.vue key**
   - File: `app/pages/categories.vue`
   - Time: 5 minutes
   - Risk: Low

3. **Test locale switching**
   - Switch EN → AR → EN
   - Verify theme updates
   - Verify categories update

**Deliverable**: No more locale mixing bugs ✅

---

### ⚠️ Phase 2: Add Network Deduplication (Days 2-3)

**Priority**: Performance improvement + better UX

1. **Migrate useProductDetail**
   - File: `app/composables/useProductDetail.ts`
   - Time: 30 minutes
   - Breaking change: Yes (API changes)

2. **Migrate useStoreTheme**
   - File: `app/composables/useStoreTheme.ts`
   - Time: 20 minutes

3. **Migrate useStoreNavigation**
   - File: `app/composables/useStoreNavigation.ts`
   - Time: 20 minutes

4. **Update all components using these composables**
   - Search for usages
   - Update from imperative to declarative API
   - Time: 1-2 hours

**Deliverable**: 30-50% reduction in network requests ✅

---

### 📊 Phase 3: Add Cache Invalidation (Day 4)

**Priority**: Prevents stale data bugs

1. **Cart operations** (`app/stores/cart.ts`)
   - After: addItem, updateItem, removeItem, clear
   - Time: 15 minutes

2. **Auth operations** (`app/composables/useAuth.ts`)
   - After: login, logout, register
   - Time: 15 minutes

3. **Profile operations** (`app/composables/useProfile.ts`)
   - After: updateProfile, updateAddress
   - Time: 10 minutes

4. **Order operations** (`app/composables/useOrders.ts`)
   - After: placeOrder, cancelOrder, reorder
   - Time: 10 minutes

**Deliverable**: Fresh data after every mutation ✅

---

### 🎨 Phase 4: Session Storage Migration (Day 5)

**Priority**: Improve multi-tenant isolation

1. **Update theme session storage**
   - File: `app/composables/useStoreTheme.ts`
   - Add locale/tenant to storage keys
   - Time: 15 minutes

2. **Update navigation session storage**
   - File: `app/composables/useStoreNavigation.ts`
   - Add locale/tenant to storage keys
   - Time: 15 minutes

**Deliverable**: Proper tenant/locale isolation in cache ✅

---

## Quick Start: Fix Critical Bugs NOW (15 minutes)

### Step 1: Fix app.vue (10 min)

```bash
# Open the file
code app/app.vue
```

**Replace lines 32-42**:

```typescript
// OLD
const { data: themeData } = await useAsyncData('store-theme', async () => {
  await fetchTheme()
  
  if (storeTheme.value) {
    const css = await getThemeCSS()
    return {
      theme: storeTheme.value,
      css: css
    }
  }
  
  return null
})

// NEW
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

const { getCacheKey } = useCacheKey()

const { data: themeData } = await useAsyncData(
  getCacheKey({ resource: CacheResources.STORE_THEME }),
  async () => {
    await fetchTheme()
    
    if (storeTheme.value) {
      const css = await getThemeCSS()
      return {
        theme: storeTheme.value,
        css: css
      }
    }
    
    return null
  }
)
```

### Step 2: Fix categories.vue (5 min)

```bash
# Open the file
code app/pages/categories.vue
```

**Replace lines 104-111**:

```typescript
// OLD
const { data: categories, pending } = await useAsyncData(
  'categories-page',
  () => api('/storefront/categories', { method: 'GET' }),
  {
    transform: (response: any) => response?.data || [],
  }
)

// NEW
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

const { getCacheKey } = useCacheKey()

const { data: categories, pending } = await useAsyncData(
  getCacheKey({ resource: CacheResources.CATEGORIES_LIST, variant: 'page' }),
  () => api('/storefront/categories', { method: 'GET' }),
  {
    transform: (response: any) => response?.data || [],
  }
)
```

### Step 3: Test (5 min)

```bash
# Start dev server
npm run dev

# Open browser
# 1. Go to http://localhost:3000
# 2. Switch language EN → AR
# 3. Verify theme updates
# 4. Go to /categories
# 5. Switch language AR → EN
# 6. Verify categories update
```

✅ **Done! Critical bugs fixed.**

---

## Testing Guide

### Manual Testing Checklist

**Locale Switching**:
- [ ] Homepage: Switch EN → AR → Theme updates
- [ ] Categories: Switch AR → EN → Categories in correct language
- [ ] Product detail: Switch EN → AR → Product name/description update
- [ ] Search: Switch locales → Results in correct language

**Network Deduplication**:
- [ ] Open DevTools Network tab
- [ ] Open product page with 3 components showing same product
- [ ] Should see only 1 network request (not 3)

**Cache Invalidation**:
- [ ] Add item to cart → Header cart count updates immediately
- [ ] Login → User-specific data loads fresh
- [ ] Logout → No stale user data visible
- [ ] Update profile → Changes reflected immediately

**Multi-Tenant**:
- [ ] Switch between tenant domains
- [ ] Verify data isolation (no cross-tenant data)

---

## Expected Benefits

### Performance
- 📉 **30-50% fewer network requests** (deduplication)
- 📉 **Faster page loads** (SSR caching)
- 📉 **Reduced server load** (fewer duplicate API calls)

### User Experience
- ✅ **No wrong language data** (locale-aware keys)
- ✅ **Instant updates** (cache invalidation)
- ✅ **Smoother navigation** (prefetched data)

### Developer Experience
- ✅ **Consistent patterns** (centralized utility)
- ✅ **Less boilerplate** (automatic loading states)
- ✅ **Better SSR** (automatic hydration)

---

## Risk Mitigation

### Breaking Changes
- **Risk**: Composable API changes break existing code
- **Mitigation**: Update all usages in same PR, provide migration guide

### Cache Never Invalidates
- **Risk**: Users see stale data forever
- **Mitigation**: Add manual refresh buttons, implement TTL fallback

### Keys Collide
- **Risk**: Different tenants share cache
- **Mitigation**: Always include tenantId, add automated tests

---

## Need Help?

### Documentation
- [Cache Deduplication Guide](./docs/architecture/cache-deduplication.md)
- [Migration Checklist](./docs/development/CACHE_DEDUPLICATION_MIGRATION.md)
- [Nuxt Data Fetching](https://nuxt.com/docs/getting-started/data-fetching)

### Code Examples
- See migration guide for before/after examples
- Check cache-deduplication.md for usage patterns

---

## Next Steps

1. ✅ Review this plan
2. 🔥 **START NOW**: Fix critical bugs (15 min)
3. ⚠️ Schedule Phase 2-4 over next week
4. 📊 Monitor metrics after deployment
5. 🎉 Celebrate improved performance!

---

**Ready to implement?** Start with the Quick Start section above! 🚀
