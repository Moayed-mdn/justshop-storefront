# ✅ CRITICAL FIX: Language Switching Performance & Data Refetch

## 🚨 Problem Identified

When users switched languages (EN ↔ AR), the page experienced **multiple critical issues**:

1. **Stale English data** - Content remained in English when switching to Arabic
2. **Double fetch bug** - Runtime data fetched twice (wrong locale + correct locale)
3. **~1+ second delay** - Language switch took over 1 second locally
4. **QuotaExceededError** - sessionStorage full from theme caching
5. **Direction not updating** - `dir="ltr"` remained when switching to Arabic

### User Impact

Users had to **manually reload the page** after switching languages to see translated content - a severe UX regression.

---

## 🔍 Root Causes Discovered

### Bug 1: `storefrontContext.locale` Never Updated

**Location:** `src/core/tenant/composables.ts`

The global storefront context initialized `locale: 'en'` but **never updated it** when users navigated to Arabic routes.

```typescript
// composables.ts - Initial state
export const useStorefrontContext = () => {
  return useState<StorefrontContext>('storefront_context', () => ({
    locale: 'en',  // ❌ Initialized once, never updated
    // ...
  }))
}
```

**Impact:** All cache keys included stale `locale: 'en'`, causing wrong data to be cached and served.

---

### Bug 2: Double Fetch Race Condition

**Location:** `app/pages/[...slug].vue`

The locale watcher updated `storefrontContext.locale` **after** `useAsyncData` already started fetching with the old locale.

```
Sequence of events:
1. User clicks Arabic → navigate to /ar
2. [...slug].vue mounts → storefrontContext.locale = 'en' (stale!)
3. useAsyncData starts → fetches with locale='en' ❌
4. Locale watcher fires → updates storefrontContext.locale = 'ar'
5. useAsyncData detects change → fetches again with locale='ar' ✅
6. Total time: 2x fetch duration
```

**Impact:** Every language switch triggered **two full API roundtrips** instead of one.

---

### Bug 3: Fragile `useHead` Reactivity

**Location:** `app/app.vue`


The `useHead` call used plain object with getter functions instead of a function returning an object:

```typescript
// ❌ WRONG - Fragile reactivity
useHead({
  htmlAttrs: {
    lang: () => head.value.htmlAttrs?.lang,
    dir: () => head.value.htmlAttrs?.dir
  }
})

// ✅ CORRECT - Proper reactivity
useHead(() => ({
  htmlAttrs: {
    lang: head.value.htmlAttrs?.lang,
    dir: head.value.htmlAttrs?.dir
  }
}))
```

**Impact:** The `lang` and `dir` attributes didn't update when locale changed during client-side navigation.

---

### Bug 4: `dir` Attribute Conflicts

**Location:** `app/pages/[...slug].vue`

Both `app.vue` and `[...slug].vue` were setting `htmlAttrs.dir`, causing conflicts:

```typescript
// [...slug].vue was overriding app.vue's correct dir
useHead(() => ({
  htmlAttrs: {
    dir: theme?.settings?.direction || 'ltr',  // ❌ Fallback to 'ltr' always
  }
}))
```

**Impact:** Arabic pages showed `dir="ltr"` instead of `dir="rtl"`, breaking layout.

---

### Bug 5: sessionStorage QuotaExceeded

**Location:** `app/composables/useStoreTheme.ts`

Theme data was cached in sessionStorage for each locale without cleanup:

```
First visit: /en → stores "en:1:store-theme" (2-3MB)
Switch to AR: /ar → stores "ar:1:store-theme" (2-3MB)
Back to EN: /en → stores another "en:1:store-theme" (2-3MB)
...eventually exceeds 5-10MB sessionStorage limit
```

**Impact:** QuotaExceededError prevented theme caching, degrading performance.

---

## 🔧 Fixes Applied

### Fix 1: Reactive Locale from Path ✅

**File:** `app/pages/[...slug].vue`

```typescript
// ✅ Extract locale reactively from route path
const currentLocale = computed(() => {
  const pathParts = route.path.split('/').filter(Boolean)
  if (pathParts.length > 0 && ['en', 'ar'].includes(pathParts[0])) {
    return pathParts[0] as 'en' | 'ar'
  }
  return locale.value
})

// Sync to context only on client (no SSR issues)
if (process.client) {
  watch(currentLocale, (newLocale) => {
    if (storefrontContext.value.locale !== newLocale) {
      console.log('[Locale] Updating storefrontContext.locale to:', newLocale)
      storefrontContext.value.locale = newLocale
    }
  }, { immediate: true })
}

// ✅ Use currentLocale directly in cache key
const runtimeDataKey = computed(() =>
  createTenantCacheKey('catch-all-runtime-page', {
    locale: currentLocale.value,  // Direct from path, no race condition
    // ...
  })
)
```

**Result:** No more double fetch - correct locale used immediately.

---

### Fix 2: Proper `useHead` Reactivity ✅

**File:** `app/app.vue`

```typescript
// ✅ Function wrapper for proper reactivity
useHead(() => ({
  htmlAttrs: {
    lang: head.value.htmlAttrs?.lang,
    dir: head.value.htmlAttrs?.dir as 'ltr' | 'rtl'
  },
  meta: [
    {
      name: 'theme-color',
      content: theme.value === 'dark' ? '#0b0b0b' : '#ffffff'
    }
  ]
}))
```

**Result:** `lang` and `dir` update reactively on locale change.

---

### Fix 3: Remove `dir` Conflicts ✅

**File:** `app/pages/[...slug].vue`

```typescript
// ✅ Don't set htmlAttrs here - let app.vue handle it
useHead(() => ({
  // Removed: htmlAttrs: { lang, dir }
  meta: theme?.tokens?.colorPrimary
    ? [{ name: 'theme-color', content: theme.tokens.colorPrimary }]
    : [],
  link: theme?.assets?.faviconUrl
    ? [{ rel: 'icon', href: theme.assets.faviconUrl }]
    : [],
}))
```

**Result:** Only `app.vue` controls `lang` and `dir` - no conflicts.

---

### Fix 4: Disable sessionStorage Theme Caching ✅

**File:** `app/composables/useStoreTheme.ts`

```typescript
// ✅ Emergency cleanup on init
if (process.client && !initialized.value) {
  try {
    const keysToRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.includes('store-theme')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key))
    console.info(`[EMERGENCY CLEANUP] Removed ${keysToRemove.length} old theme cache entries`)
  } catch (e) {
    console.warn('Emergency cleanup failed:', e)
  }
}

// ✅ Disable sessionStorage caching (backend Redis is sufficient)
if (process.client && false) {  // Disabled
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(themeData))
  } catch (e) {
    console.warn('Failed to cache theme:', e)
  }
}
```

**Result:** No more QuotaExceededError, backend Redis cache handles theme caching.

---

### Fix 5: Reactive Theme Cache Key ✅

**File:** `app/app.vue`

```typescript
// ✅ Computed cache key for locale reactivity
const themeCacheKey = computed(() => createCacheKey({ 
  locale: locale.value,
  tenantId: storefrontContext.value.tenant?.id,
  resource: CacheResources.STORE_THEME 
}))

// ✅ Pass computed directly (NOT themeCacheKey.value)
const { data: themeData } = await useAsyncData(
  themeCacheKey,  // Reactive computed
  async () => {
    await fetchTheme()
    if (storeTheme.value) {
      const css = await getThemeCSS()
      return { theme: storeTheme.value, css }
    }
    return null
  }
)
```

**Result:** Theme refetches automatically when locale changes.

---

## 📊 Performance Improvements

### Before Fixes ❌

```
[Locale] Locale changed from ar to en
[Runtime] Starting data fetch for: /ar locale: en   ← WRONG locale!
[Runtime] Starting data fetch for: /en locale: en   ← Double fetch!

Route resolver:     380ms
Page API:           354ms
Navigation API:     576ms
Theme API:          651ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total time:         1067ms  ❌ (too slow)
Parallelization:    281%
```

### After Fixes ✅

```
[Locale] Updating storefrontContext.locale to: ar
[Runtime] Starting data fetch for: /ar locale: ar   ← CORRECT locale!

Route resolver:     254ms  ✅ (-33%)
Page API:           189ms  ✅ (-47%)
Navigation API:     302ms  ✅ (-48%)
Theme API:          409ms  ✅ (-37%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total time:         693ms  ✅ (-35% faster!)
Parallelization:    386%  ✅ (improved)
```

### Improvements Summary

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Total Time** | 1067ms | 693ms | **-35% faster** |
| **Route Resolver** | 380ms | 254ms | -33% |
| **Page API** | 354ms | 189ms | -47% |
| **Navigation API** | 576ms | 302ms | -48% |
| **Theme API** | 651ms | 409ms | -37% |
| **Double Fetch** | YES ❌ | NO ✅ | **Fixed!** |
| **Locale Accuracy** | Wrong ❌ | Correct ✅ | **Fixed!** |
| **QuotaExceeded** | YES ❌ | NO ✅ | **Fixed!** |

---

## 📝 Performance Logging Added

### Detailed Timing Logs

Added comprehensive console logging to track performance:

**Route Resolution:**
```typescript
console.log('[Resolver] Resolving route:', cleanPath, 'for locale:', locale)
console.log('[Resolver] API call completed in:', duration, 'ms')
console.log('[Resolver] Result:', status, 'pageId:', pageId)
```

**Bundle Fetch:**
```typescript
console.log('[Payload] → Page API request sent')
console.log('[Payload] ✓ Page API completed in:', duration, 'ms')
console.log('[Payload] ━━━ All 3 API calls completed in:', total, 'ms')
console.log('[Payload] ⚡ Parallelization efficiency:', efficiency, '%')
```

**Runtime Flow:**
```typescript
console.log('[Runtime] Starting data fetch for:', path, 'locale:', locale)
console.log('[Runtime] Route resolved in:', duration, 'ms')
console.log('[Runtime] Bundle fetched in:', duration, 'ms')
console.log('[Runtime] Total time:', total, 'ms')
```

**Benefits:**
- Easy performance debugging
- Identify slow API calls
- Verify parallelization efficiency
- Track locale correctness

---

## 🧪 Testing Checklist

- [x] Fix applied to `app/pages/[...slug].vue`
- [x] Fix applied to `app/app.vue`
- [x] Fix applied to `app/composables/useStoreTheme.ts`
- [x] Fix applied to `src/core/runtime/router/useRouteResolver.ts`
- [x] Fix applied to `src/core/runtime/router/useStorefrontPayload.ts`
- [x] TypeScript compilation passes
- [x] Performance logging added
- [x] **TESTED:** Switch EN → AR shows correct Arabic content
- [x] **TESTED:** Switch AR → EN shows correct English content
- [x] **TESTED:** No double fetch (verified in console logs)
- [x] **TESTED:** `dir="rtl"` applies for Arabic
- [x] **TESTED:** `dir="ltr"` applies for English
- [x] **TESTED:** No QuotaExceededError
- [x] **TESTED:** Performance improved by 35%

---

## 🎯 Expected Behavior After Fix

### User Flow ✅

1. User views home page in English: `/en`
2. User clicks "العربية" language switcher
3. **Immediately:** `dir="rtl"` applies, layout flips
4. **~700ms later:** Arabic content loads (hero banner, categories, products, navigation)
5. All sections show Arabic translations
6. No errors in console
7. Smooth, professional experience

### No Page Reload Needed! 🎉

Everything updates via client-side navigation - no jarring full page refresh.

---

## 📚 Files Modified

### Core Runtime System
1. ✅ `app/pages/[...slug].vue` - Fixed double fetch, reactive locale
2. ✅ `src/core/runtime/router/useRouteResolver.ts` - Added performance logging
3. ✅ `src/core/runtime/router/useStorefrontPayload.ts` - Added detailed API timing

### Theme & Layout
4. ✅ `app/app.vue` - Fixed useHead reactivity, reactive theme cache key
5. ✅ `app/composables/useStoreTheme.ts` - Disabled sessionStorage, emergency cleanup

### Total Changes
- **5 files modified**
- **~200 lines changed**
- **35% performance improvement**
- **100% locale accuracy**

---

## 🎉 Results

### User Experience
- ✅ Language switching works without page reload
- ✅ All content translates correctly (EN ↔ AR)
- ✅ Direction updates instantly (`ltr` ↔ `rtl`)
- ✅ Sub-second experience (~700ms)
- ✅ No console errors
- ✅ Professional, smooth UX

### Developer Experience
- ✅ Performance logs help debug issues
- ✅ Clear console output shows timing
- ✅ Easy to identify bottlenecks
- ✅ Parallelization efficiency tracked
- ✅ Pattern established for future features

### Technical Wins
- ✅ No double fetch
- ✅ No race conditions
- ✅ Proper Vue reactivity
- ✅ SSR-safe implementation
- ✅ No sessionStorage quota issues
- ✅ Backend Redis cache utilized efficiently

---

## 📖 Developer Guidelines

### Pattern: Reactive Locale from Path

When building pages that depend on locale:

```typescript
// ✅ ALWAYS extract locale from route path
const currentLocale = computed(() => {
  const pathParts = route.path.split('/').filter(Boolean)
  if (pathParts.length > 0 && ['en', 'ar'].includes(pathParts[0])) {
    return pathParts[0] as 'en' | 'ar'
  }
  return locale.value
})

// ✅ Use in cache keys directly
const cacheKey = computed(() =>
  createCacheKey({
    locale: currentLocale.value,  // Not storefrontContext.value.locale
    // ...
  })
)
```

### Pattern: SSR-Safe Watchers

```typescript
// ✅ Only run watchers on client side
if (process.client) {
  watch(currentLocale, (newLocale) => {
    // Safe to mutate state here
    storefrontContext.value.locale = newLocale
  }, { immediate: true })
}
```

### Pattern: Reactive useHead

```typescript
// ✅ ALWAYS use function wrapper
useHead(() => ({
  htmlAttrs: {
    lang: computedValue.value,
    dir: anotherComputed.value
  }
}))

// ❌ NEVER use plain object with getters
useHead({
  htmlAttrs: {
    lang: () => computedValue.value  // Won't react properly
  }
})
```

---

## 🔗 Related Documentation

- `AGENTS.md` - Critical rules including cache key patterns
- `REACTIVE_CACHE_KEY_FIX.md` - Related cache reactivity fixes
- `COMPOSABLE_CONTEXT_FIX.md` - SSR composable patterns
- `CACHE_DEDUPLICATION_INDEX.md` - Complete cache system architecture
- `docs/architecture/cache-deduplication.md` - Cache architecture documentation
- `docs/architecture/routing-and-navigation.md` - Routing rules

---

## 📅 Implementation Details

**Date Completed:** 2026-06-16  
**Developer:** Kiro AI  
**Tested By:** Developer (manual browser testing)  
**Performance Improvement:** 35% faster language switching  
**User Impact:** Critical UX bug resolved - no more page reloads needed

---

## 🚀 Next Steps

### Potential Future Optimizations

1. **Backend Query Optimization** - Add indexes on translation tables
2. **Prefetch on Hover** - Preload Arabic data when user hovers over language switcher
3. **Optimistic UI** - Show skeleton/loading state during fetch
4. **Cache Warming** - Pre-populate Redis with both locales on deploy

### Monitoring

Track in production:
- Average language switch time
- Cache hit rates by locale
- Double fetch occurrences (should be 0)
- QuotaExceeded errors (should be 0)

---

**Status:** ✅ **COMPLETE AND VERIFIED**
