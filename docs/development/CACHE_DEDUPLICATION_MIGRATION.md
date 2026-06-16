# Cache Deduplication Migration Checklist

**Date**: June 16, 2026  
**Priority**: 🔥 High - Fixes critical locale mixing bugs  
**Status**: 📋 Planning

---

## Goal

Migrate all data fetching to use locale and tenant-aware cache keys to:
1. ✅ Prevent English/Arabic data mixing
2. ✅ Enable network request deduplication
3. ✅ Improve SSR hydration
4. ✅ Add cache invalidation after mutations

---

## Migration Strategy

### Phase 1: Fix Critical Bugs (Immediate)
**Priority**: Locale-dependent data that's currently broken

- [ ] Fix `app.vue` - Theme fetching (currently static key `'store-theme'`)
- [ ] Fix `categories.vue` - Categories list (currently static key `'categories-page'`)
- [ ] Verify `search.vue` - Already has locale in key ✅
- [ ] Verify `[...slug].vue` - Already tenant-aware ✅

### Phase 2: Add Deduplication to Composables (Week 1)
**Priority**: High-traffic fetching composables

- [ ] `useProductDetail()` - Product detail pages
- [ ] `useProductFilters()` - Product listings
- [ ] `useStoreTheme()` - Theme data
- [ ] `useStoreNavigation()` - Navigation menus
- [ ] `useOrders()` - Order history
- [ ] `useProfile()` - User profile
- [ ] `useCheckout()` - Checkout flow

### Phase 3: Add Cache Invalidation (Week 2)
**Priority**: Mutations that cause stale data

- [ ] Cart operations (add, update, remove, clear)
- [ ] Auth operations (login, logout, register)
- [ ] Profile updates
- [ ] Order placement
- [ ] Product updates (admin)

### Phase 4: Session Storage Migration (Week 2)
**Priority**: Medium - Improve multi-tenant isolation

- [ ] Update theme session storage keys
- [ ] Update navigation session storage keys
- [ ] Document session storage patterns

---

## Detailed Migration Tasks

### Task 1: Fix app.vue Theme Key

**File**: `app/app.vue`

**Current**:
```typescript
const { data: themeData } = await useAsyncData('store-theme', async () => {
  await fetchTheme()
  // ...
})
```

**Fixed**:
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

**Impact**: 🔥 Critical - Fixes theme not updating on locale switch

---

### Task 2: Fix categories.vue Key

**File**: `app/pages/categories.vue`

**Current**:
```typescript
const { data: categories, pending } = await useAsyncData(
  'categories-page',
  () => api('/storefront/categories', { method: 'GET' }),
  {
    transform: (response: any) => response?.data || [],
  }
)
```

**Fixed**:
```typescript
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

**Impact**: 🔥 Critical - Fixes categories showing in wrong language

---

### Task 3: Migrate useProductDetail

**File**: `app/composables/useProductDetail.ts`

**Current**:
```typescript
export const useProductDetail = () => {
  const api = useApi()
  
  const fetchProduct = async (slug: string) => {
    try {
      const response = await api<ProductDetailResponse>(API_ROUTES.products.detail(slug))
      return response.data
    } catch (err) {
      console.error('Failed to fetch product:', err)
      throw err
    }
  }

  const fetchRelatedProducts = async (slug: string) => {
    try {
      const response = await api<ProductRelatedResponse>(API_ROUTES.products.related(slug))
      return response.data
    } catch (err) {
      console.error('Failed to fetch related products:', err)
      throw err
    }
  }

  return {
    fetchProduct,
    fetchRelatedProducts,
  }
}
```

**Fixed**:
```typescript
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

export const useProductDetail = (slug: Ref<string> | string) => {
  const { getCacheKey } = useCacheKey()
  const api = useApi()
  const productSlug = isRef(slug) ? slug : ref(slug)

  // Product detail with caching
  const { data: product, pending, error, refresh } = useAsyncData(
    () => getCacheKey({
      resource: CacheResources.PRODUCT_DETAIL,
      identifier: productSlug.value,
    }),
    () => api<ProductDetailResponse>(API_ROUTES.products.detail(productSlug.value)),
    {
      transform: (response) => response?.data,
      watch: [productSlug],
    }
  )

  // Related products with caching
  const { data: relatedProducts, pending: relatedPending } = useAsyncData(
    () => getCacheKey({
      resource: CacheResources.PRODUCT_RELATED,
      identifier: productSlug.value,
    }),
    () => api<ProductRelatedResponse>(API_ROUTES.products.related(productSlug.value)),
    {
      transform: (response) => response?.data,
      watch: [productSlug],
    }
  )

  return {
    product,
    pending,
    error,
    refresh,
    relatedProducts,
    relatedPending,
  }
}
```

**Usage in pages/components**:
```vue
<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Automatic deduplication!
const { product, pending, relatedProducts } = useProductDetail(slug)
</script>
```

**Impact**: ⚠️ Breaking change - API changes from imperative to declarative

---

### Task 4: Add Cart Cache Invalidation

**File**: `app/stores/cart.ts`

**Add at top**:
```typescript
import { clearResourceCache, CacheResources } from '~~/src/core/cache/createCacheKey'
```

**Update methods**:
```typescript
// After addItem
const addItem = async (payload: AddToCartPayload) => {
  // ... existing logic ...
  
  // Invalidate cart cache
  await clearResourceCache(CacheResources.CART_ITEMS)
}

// After updateItem
const updateItem = async (id: number | string, quantity: number) => {
  // ... existing logic ...
  
  await clearResourceCache(CacheResources.CART_ITEMS)
}

// After removeItem
const removeItem = async (id: number | string) => {
  // ... existing logic ...
  
  await clearResourceCache(CacheResources.CART_ITEMS)
}

// After clear
const clear = async () => {
  // ... existing logic ...
  
  await clearResourceCache(CacheResources.CART_ITEMS)
}
```

**Impact**: Prevents stale cart counts in header

---

### Task 5: Add Auth Cache Invalidation

**File**: `app/composables/useAuth.ts`

**Add at top**:
```typescript
import { clearResourceCache, refreshResourceCache, CacheResources } from '~~/src/core/cache/createCacheKey'
```

**Update logout**:
```typescript
const logout = async () => {
  loading.value = true
  try {
    await api(API_ROUTES.auth.logout, { method: 'POST' })
  } catch {
    // ignore
  } finally {
    authStore.clearAuth()
    useCartStore().onLogout()
    
    // Clear all user-specific caches
    await clearResourceCache([
      CacheResources.USER_PROFILE,
      CacheResources.USER_ORDERS,
      CacheResources.CART_ITEMS,
    ])
    
    loading.value = false
    return navigateTo(storefrontRoutes.login())
  }
}
```

**Update login**:
```typescript
const login = async (credentials: Record<string, string>) => {
  loading.value = true
  try {
    const { data, error } = await api<AuthResponse>(API_ROUTES.auth.login, {
      method: 'POST',
      body: credentials,
    })

    if (error || !data) {
      throw error
    }

    authStore.setUser(data.data.user || null)

    const cartStore = useCartStore()
    await cartStore.onLogin()
    
    // Refresh user-specific data
    await refreshResourceCache([
      CacheResources.USER_PROFILE,
      CacheResources.CART_ITEMS,
    ])

    return navigateTo(storefrontRoutes.home())
  } finally {
    loading.value = false
  }
}
```

**Impact**: Prevents showing previous user's cached data

---

### Task 6: Update useStoreTheme Session Storage

**File**: `app/composables/useStoreTheme.ts`

**Current**:
```typescript
sessionStorage.setItem('store-theme', JSON.stringify(themeData))
sessionStorage.setItem('store-theme-timestamp', Date.now().toString())
```

**Fixed**:
```typescript
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

// In fetchTheme():
const { getCacheKey } = useCacheKey()
const storageKey = getCacheKey({ resource: CacheResources.STORE_THEME })

sessionStorage.setItem(storageKey, JSON.stringify(themeData))
sessionStorage.setItem(`${storageKey}-timestamp`, Date.now().toString())
```

**Impact**: Proper tenant/locale isolation in session storage

---

### Task 7: Update useStoreNavigation Session Storage

**File**: `app/composables/useStoreNavigation.ts`

**Current**:
```typescript
sessionStorage.setItem(`nav-${targetHandle}`, JSON.stringify(response.data))
sessionStorage.setItem(`nav-${targetHandle}-timestamp`, Date.now().toString())
```

**Fixed**:
```typescript
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

// In fetchMenu():
const { getCacheKey } = useCacheKey()
const storageKey = getCacheKey({ 
  resource: CacheResources.STORE_NAVIGATION,
  identifier: targetHandle,
})

sessionStorage.setItem(storageKey, JSON.stringify(response.data))
sessionStorage.setItem(`${storageKey}-timestamp`, Date.now().toString())
```

**Impact**: Proper tenant/locale isolation for navigation

---

## Testing Checklist

After migration, verify:

### Locale Switching
- [ ] Switch EN → AR on product page → See Arabic product name
- [ ] Switch AR → EN on categories page → See English categories
- [ ] Switch locale on search page → See localized results

### Deduplication
- [ ] Open same product in 2 components → Only 1 network request
- [ ] Navigate to product detail → Check network tab for duplicate requests

### Cache Invalidation
- [ ] Add to cart → Header cart count updates immediately
- [ ] Login → User-specific data loads fresh
- [ ] Logout → No stale user data visible

### Multi-Tenancy
- [ ] Switch between tenants → Data properly isolated
- [ ] Guest cart persists per tenant
- [ ] Theme loads per tenant

### SSR Hydration
- [ ] View page source → Data present (SSR worked)
- [ ] No hydration mismatch errors in console
- [ ] No double-fetch on page load

---

## Rollout Plan

### Step 1: Development (3 days)
1. Create cache utilities (Done ✅)
2. Fix critical bugs (app.vue, categories.vue)
3. Migrate 3 composables (product, theme, navigation)
4. Add E2E tests

### Step 2: Staging (2 days)
1. Deploy to staging
2. Manual QA testing
3. Performance testing
4. Fix issues

### Step 3: Production (1 day)
1. Deploy to production
2. Monitor error logs
3. Monitor performance metrics
4. Rollback plan ready

---

## Breaking Changes

### API Changes

**Before**:
```typescript
const { fetchProduct } = useProductDetail()
const product = await fetchProduct('laptop')
```

**After**:
```typescript
const { product, pending } = useProductDetail('laptop')
// product is a Ref
```

### Migration Guide for Consumers

Update all usages:

```typescript
// OLD
const { fetchProduct } = useProductDetail()
const product = ref(null)
onMounted(async () => {
  product.value = await fetchProduct(slug)
})

// NEW
const { product, pending } = useProductDetail(slug)
// product is already a reactive ref
```

---

## Performance Impact

### Expected Improvements

1. **Reduced Network Requests**: 30-50% reduction from deduplication
2. **Faster Page Loads**: SSR caching reduces hydration time
3. **Better UX**: No flashing content on locale switch
4. **Lower Server Load**: Fewer duplicate API calls

### Metrics to Track

- [ ] Network requests per page load (before/after)
- [ ] Time to Interactive (TTI)
- [ ] Largest Contentful Paint (LCP)
- [ ] Cumulative Layout Shift (CLS)
- [ ] API server load

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes in composables | High | Provide migration guide, update all usages in same PR |
| Cache never invalidates | Medium | Implement TTL fallback, monitor stale data reports |
| Keys collide between tenants | High | Include tenantId in all keys, add tests |
| SSR hydration mismatch | High | Test SSR/client key generation, add guards |

---

## Rollback Plan

If issues arise:

1. **Immediate**: Feature flag to disable cache (fallback to direct fetches)
2. **Short-term**: Revert PR, investigate issues
3. **Long-term**: Fix issues, re-deploy with more testing

---

## Success Criteria

- ✅ No locale mixing bugs reported
- ✅ Network requests reduced by 30%+
- ✅ All E2E tests pass
- ✅ No SSR hydration errors
- ✅ Cart/auth invalidation works correctly
- ✅ Documentation updated
- ✅ Team trained on new patterns

---

## Documentation Updates Needed

- [ ] Update `docs/architecture/data-fetching.md`
- [ ] Update `docs/development/composables.md`
- [ ] Update `docs/AI_PROMPT_TEMPLATE.md` with cache rules
- [ ] Create `docs/architecture/cache-deduplication.md` (Done ✅)
- [ ] Update `README.md` quick start

---

## Questions & Decisions

### Q: Should we cache authenticated requests?
**A**: Yes, but include user ID in cache key for user-specific data

### Q: What's the cache TTL?
**A**: Nuxt's useAsyncData caches for page lifetime. Session storage has 5-min TTL.

### Q: Should we cache POST/PUT/DELETE responses?
**A**: No, only GET requests. Mutations should invalidate related caches.

### Q: What about real-time data (cart count)?
**A**: Use WebSocket updates or short TTL + polling, with manual refreshes after mutations

---

**Status**: Ready for implementation
**Next Step**: Start with Phase 1 critical fixes
**Owner**: Development team
**Due Date**: End of week
