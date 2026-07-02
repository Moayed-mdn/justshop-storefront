# ✅ CRITICAL FIX: Reactive Cache Keys for Language Switching

## 🚨 Problem Identified

When users switch languages using the language switcher, **data was not refetching** because `useAsyncData` was not detecting locale changes. This forced users to manually reload the page - a critical UX bug!

### Root Cause

Using `useAsyncData(key.value, ...)` instead of `useAsyncData(() => key, ...)` breaks Vue's reactivity:

```typescript
// ❌ WRONG - Vue won't detect locale changes
const key = computed(() => `${locale.value}:product:${slug}`)
useAsyncData(key.value, ...) // Static evaluation - loses reactivity!

// ✅ CORRECT - Vue tracks locale changes
const key = computed(() => `${locale.value}:product:${slug}`)
useAsyncData(() => key.value, ...) // Reactive getter - refetches on locale change!
```

## 🔧 Files Fixed

### 1. ✅ `/app/pages/[...slug].vue` - Runtime Page Loader
**Before:**
```typescript
const { data: runtimeData, pending, error } = await useAsyncData(
  runtimeDataKey.value,  // ❌ Static - won't react to locale changes
  async () => { ... }
)
```

**After:**
```typescript
const { data: runtimeData, pending, error } = await useAsyncData(
  () => runtimeDataKey.value,  // ✅ Reactive - refetches on locale change
  async () => { ... }
)
```

**Impact:** Product pages, category pages, all runtime-rendered pages now refetch when locale changes.

---

### 2. ✅ `/app/pages/search.vue` - Search Results
**Before:**
```typescript
const { data, pending, error: fetchError } = await useAsyncData(
  `search-${searchTerm.value}-${locale.value}`,  // ❌ Static string
  async () => { ... }
)
```

**After:**
```typescript
const { data, pending, error: fetchError } = await useAsyncData(
  () => `search-${searchTerm.value}-${locale.value}`,  // ✅ Reactive getter
  async () => { ... }
)
```

**Impact:** Search results now update when users switch languages.

---

### 3. ✅ `/app/pages/categories.vue` - Categories List
**Before:**
```typescript
const { data: categories, pending } = await useAsyncData(
  getCacheKey({ resource: CacheResources.CATEGORIES_LIST, variant: 'page' }),  // ❌ Static call
  () => api('/storefront/categories', { method: 'GET' }),
)
```

**After:**
```typescript
const { data: categories, pending } = await useAsyncData(
  () => getCacheKey({ resource: CacheResources.CATEGORIES_LIST, variant: 'page' }),  // ✅ Reactive getter
  () => api('/storefront/categories', { method: 'GET' }),
)
```

**Impact:** Category list now shows translated categories when language switches.

---

### 4. ✅ `/app/app.vue` - Theme Data
**Before:**
```typescript
const { data: themeData } = await useAsyncData(
  getCacheKey({ resource: CacheResources.STORE_THEME }),  // ❌ Static call
  async () => { ... }
)
```

**After:**
```typescript
const { data: themeData } = await useAsyncData(
  () => getCacheKey({ resource: CacheResources.STORE_THEME }),  // ✅ Reactive getter
  async () => { ... }
)
```

**Impact:** Theme data now refetches when locale changes (important for RTL/LTR and locale-specific themes).

---

### 5. ✅ `/app/composables/useProductDetail.ts` - Already Correct!
This composable was already using the correct reactive pattern:

```typescript
const { data: product } = useAsyncData(
  () => getCacheKey({  // ✅ Already reactive
    resource: CacheResources.PRODUCT_DETAIL,
    identifier: productSlug.value,
  }),
  async () => { ... }
)
```

**Status:** No changes needed - pattern was correct from the start.

## 📊 Pattern Comparison

| Pattern | Reactive? | Use Case |
|---------|-----------|----------|
| `useAsyncData(key.value, ...)` | ❌ No | Never use this |
| `useAsyncData(() => key.value, ...)` | ✅ Yes | When key is computed |
| `useAsyncData(() => 'static-key', ...)` | ✅ Yes | Static keys (but getter still works) |
| `useAsyncData(() => fn(), ...)` | ✅ Yes | When key comes from function |

## 🎯 Expected Behavior After Fix

### Before Fix ❌
1. User views page in English: `/en/shop/product/laptop`
2. User switches to Arabic using language switcher
3. URL changes to `/ar/shop/product/laptop`
4. **BUG:** English data still shows (wrong locale cached data)
5. User forced to manually reload page

### After Fix ✅
1. User views page in English: `/en/shop/product/laptop`
2. User switches to Arabic using language switcher
3. URL changes to `/ar/shop/product/laptop`
4. **FIXED:** `useAsyncData` detects locale change in cache key
5. Automatically refetches data with Arabic locale
6. Arabic data displays immediately - no reload needed!

## 🔍 How It Works

When `useAsyncData` receives a **function** as the key parameter:

```typescript
useAsyncData(
  () => `${locale.value}:product:${slug}`,  // Function getter
  //  ^^^ Arrow function wraps the key
  async () => { ... }
)
```

Vue's reactivity system:
1. **Tracks** all reactive dependencies inside the getter (`locale.value`)
2. **Watches** for changes to those dependencies
3. **Re-executes** the getter when dependencies change
4. **Compares** old key vs new key
5. **Refetches** data if key changed

Without the arrow function, the key is evaluated once at component setup and becomes static.

## 🧪 Testing Checklist

- [x] All files using `useAsyncData` updated to reactive pattern
- [x] TypeScript compilation passes
- [ ] **MANUAL TEST:** Switch language from EN → AR on product page
- [ ] **MANUAL TEST:** Switch language from AR → EN on categories page
- [ ] **MANUAL TEST:** Switch language while on search results page
- [ ] **MANUAL TEST:** Verify no console errors during language switch
- [ ] **MANUAL TEST:** Verify data refetches (check Network tab in DevTools)
- [ ] **MANUAL TEST:** Verify correct locale data displays after switch

## 📝 Developer Guidelines

**RULE:** Always use arrow function wrapper for reactive cache keys:

```typescript
// ✅ ALWAYS DO THIS
const { data } = useAsyncData(
  () => getCacheKey({ resource: 'product', identifier: slug.value }),
  //  ^^^ Arrow function makes it reactive
  async () => { ... }
)

// ❌ NEVER DO THIS
const { data } = useAsyncData(
  getCacheKey({ resource: 'product', identifier: slug.value }),
  // Missing arrow function - NOT reactive!
  async () => { ... }
)
```

## 🎉 Result

All `useAsyncData` calls in the project now follow the **reactive pattern**, ensuring:
- ✅ Automatic refetch on locale changes
- ✅ No manual page reloads needed
- ✅ Smooth language switching UX
- ✅ Proper cache key deduplication per locale
- ✅ No EN/AR data mixing

## 📚 Related Documentation

- `CACHE_DEDUPLICATION_INDEX.md` - Full cache implementation overview
- `docs/architecture/cache-deduplication.md` - Architecture documentation
- `src/core/cache/createCacheKey.ts` - Core cache key utility
