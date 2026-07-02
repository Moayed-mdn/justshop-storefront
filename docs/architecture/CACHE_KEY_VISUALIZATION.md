# Cache Key Visualization

## The Problem: Locale Mixing 🐛

```
┌─────────────────────────────────────────────────────────┐
│ User views site in ENGLISH                              │
│ Cache Key: 'store-theme'                                │
│ Data: { colors: {...}, fonts: {...} } (English)         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ User switches to ARABIC                                  │
│ Cache Key: 'store-theme' ← SAME KEY!                    │
│ Returns: { colors: {...}, fonts: {...} } (English) ❌   │
│ Expected: Arabic data ✅                                 │
└─────────────────────────────────────────────────────────┘
```

**Result**: Arabic users see English content! 🐛

---

## The Solution: Locale-Aware Keys ✅

```
┌─────────────────────────────────────────────────────────┐
│ User views site in ENGLISH                              │
│ Cache Key: 'en:123:store-theme'                         │
│ Data: { colors: {...}, fonts: {...} } (English)         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ User switches to ARABIC                                  │
│ Cache Key: 'ar:123:store-theme' ← DIFFERENT KEY!        │
│ Fetches: Fresh Arabic data ✅                            │
│ Returns: { colors: {...}, fonts: {...} } (Arabic) ✅    │
└─────────────────────────────────────────────────────────┘
```

**Result**: Each language has its own cache! ✅

---

## Cache Key Structure

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   {locale}:{tenantId}:{resource}:{identifier}:{params}    │
│      │         │          │           │          │         │
│      │         │          │           │          └─ Optional filters
│      │         │          │           └─ ID/slug           │
│      │         │          └─ Resource type                 │
│      │         └─ Tenant isolation                         │
│      └─ Language isolation                                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Examples

```
English Product:    en:123:product:laptop-x1
Arabic Product:     ar:123:product:laptop-x1
                    ↑  ↑   ↑        ↑
                    │  │   │        └─ Same slug
                    │  │   └─ Same resource
                    │  └─ Same tenant
                    └─ DIFFERENT LOCALE ← Separate cache!

English Categories: en:123:categories:page
Arabic Categories:  ar:123:categories:page

English Search:     en:search:laptop:q=gaming
Arabic Search:      ar:search:laptop:q=gaming
```

---

## Current vs Fixed State

### Current (BROKEN) 🐛

```
app.vue
├─ useAsyncData('store-theme', ...)          ❌ Static key
│  └─ EN user: 'store-theme' → English data
│  └─ AR user: 'store-theme' → English data (WRONG!)

categories.vue
├─ useAsyncData('categories-page', ...)      ❌ Static key
│  └─ EN user: 'categories-page' → English
│  └─ AR user: 'categories-page' → English (WRONG!)

search.vue
├─ useAsyncData(`search-${term}-${locale}`)  ✅ Locale-aware
│  └─ EN user: 'search-laptop-en' → English
│  └─ AR user: 'search-laptop-ar' → Arabic (CORRECT!)
```

### Fixed (WORKING) ✅

```
app.vue
├─ useAsyncData(getCacheKey({ resource: 'store-theme' }))
│  └─ EN user: 'en:123:store-theme' → English data ✅
│  └─ AR user: 'ar:123:store-theme' → Arabic data ✅

categories.vue
├─ useAsyncData(getCacheKey({ resource: 'categories', variant: 'page' }))
│  └─ EN user: 'en:123:categories:page' → English ✅
│  └─ AR user: 'ar:123:categories:page' → Arabic ✅

search.vue
├─ useAsyncData(getCacheKey({ resource: 'search', identifier: term }))
│  └─ EN user: 'en:search:laptop' → English ✅
│  └─ AR user: 'ar:search:laptop' → Arabic ✅
```

---

## Network Deduplication Benefit

### Without Deduplication (Current) ❌

```
Component A: useProductDetail('laptop')
    ↓
  API Request #1 → GET /api/products/laptop
    ↓
  Product Data

Component B: useProductDetail('laptop')  ← SAME PRODUCT
    ↓
  API Request #2 → GET /api/products/laptop  ← DUPLICATE!
    ↓
  Product Data

Component C: useProductDetail('laptop')  ← SAME PRODUCT
    ↓
  API Request #3 → GET /api/products/laptop  ← DUPLICATE!
    ↓
  Product Data

RESULT: 3 network requests for same data! ❌
```

### With Deduplication (Fixed) ✅

```
Component A: useAsyncData('en:123:product:laptop', ...)
    ↓
  API Request #1 → GET /api/products/laptop
    ↓
  Product Data → CACHED with key 'en:123:product:laptop'

Component B: useAsyncData('en:123:product:laptop', ...)
    ↓
  Cache Hit! Returns cached data (no network request)
    ↓
  Product Data

Component C: useAsyncData('en:123:product:laptop', ...)
    ↓
  Cache Hit! Returns cached data (no network request)
    ↓
  Product Data

RESULT: 1 network request, 2 cache hits! ✅
SAVINGS: 66% fewer requests!
```

---

## Cache Invalidation Flow

### Problem: Stale Data After Mutation

```
User clicks "Add to Cart"
    ↓
POST /api/cart/items
    ↓
Server adds item
    ↓
Header still shows "Cart (0)" ❌  ← Stale cache!
    ↓
User confused: "Did it work?"
```

### Solution: Clear Cache After Mutation

```
User clicks "Add to Cart"
    ↓
POST /api/cart/items
    ↓
Server adds item
    ↓
clearResourceCache('cart')  ← Invalidate cache
    ↓
Header refetches cart data
    ↓
Header shows "Cart (1)" ✅  ← Fresh data!
```

---

## Multi-Tenant Isolation

### Without Tenant in Key ❌

```
Tenant A (ID: 123):
  Cache Key: 'en:product:laptop'
  Data: Tenant A's product

Tenant B (ID: 456):
  Cache Key: 'en:product:laptop'  ← SAME KEY!
  Returns: Tenant A's product ❌  ← WRONG TENANT!
```

### With Tenant in Key ✅

```
Tenant A (ID: 123):
  Cache Key: 'en:123:product:laptop'
  Data: Tenant A's product

Tenant B (ID: 456):
  Cache Key: 'en:456:product:laptop'  ← DIFFERENT KEY!
  Data: Tenant B's product ✅  ← CORRECT!
```

---

## Implementation Impact

### Before

```typescript
// Manual fetching, no deduplication
const product = ref(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  product.value = await fetchProduct('laptop')
  loading.value = false
})
```

**Issues**:
- ❌ No SSR support
- ❌ Duplicate requests
- ❌ Manual loading state
- ❌ No locale awareness

### After

```typescript
// Automatic deduplication
const { data: product, pending } = useProductDetail('laptop')
```

**Benefits**:
- ✅ SSR support
- ✅ Automatic deduplication
- ✅ Built-in loading state
- ✅ Locale-aware caching

---

## Performance Metrics

### Expected Improvements

```
Network Requests:
  Before: 100 requests/page
  After:   60 requests/page
  Savings: 40% reduction ✅

Page Load Time:
  Before: 2.5s
  After:  1.8s
  Savings: 28% faster ✅

Server Load:
  Before: 1000 req/min
  After:  600 req/min
  Savings: 40% reduction ✅
```

---

## Quick Reference

### ✅ DO

```typescript
// Always include locale
const { getCacheKey } = useCacheKey()
const key = getCacheKey({ resource: 'product', identifier: slug })

// Use useAsyncData for fetching
const { data } = useAsyncData(key, fetcher)

// Clear cache after mutations
await clearResourceCache('cart')
```

### ❌ DON'T

```typescript
// Static keys (no locale)
useAsyncData('products', fetcher)  ❌

// Direct API calls (no deduplication)
const data = await api('/products')  ❌

// Forget cache invalidation
await api.post('/cart/items')  // No clearCache! ❌
```

---

**Ready to fix?** See `CACHE_DEDUPLICATION_IMPLEMENTATION_PLAN.md` for step-by-step guide!
