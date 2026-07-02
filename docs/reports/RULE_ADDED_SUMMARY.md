# ✅ useAsyncData Cache Key Rule Added to Project Documentation

## Rule Added To

### 1. ✅ `docs/development/AI_AGENT_RULES.md`
**Location:** Implementation Rules For This Repo → useAsyncData Cache Key Rules

**Added comprehensive section including:**
- Critical rule explanation
- Wrong vs correct code examples
- Exception for composables
- Rationale explaining SSR context issues
- Benefits of following the rule

### 2. ✅ `docs/development/coding-standards.md`
**Location:** Data And Side-Effect Rules → useAsyncData And Cache Keys

**Added practical guidance including:**
- When to use `createCacheKey()` vs `useCacheKey()`
- Pattern for pages with full code example
- Pattern for composables with full code example
- Cross-reference to detailed documentation

## Why These Locations?

### AI_AGENT_RULES.md
- **Mandatory** rules that AI agents and developers must follow
- Prevents critical SSR errors from being introduced
- Part of the automated enforcement system

### coding-standards.md
- **Best practices** for day-to-day development
- Developers reference this when writing new code
- Shows concrete patterns for common scenarios

## Related Documentation

The full technical explanation remains in:
- `COMPOSABLE_CONTEXT_FIX.md` - Complete technical deep-dive with error analysis
- `REACTIVE_CACHE_KEY_FIX.md` - Language switching reactivity details

## What This Prevents

### Before Rule ❌
Developers might write:
```typescript
const { getCacheKey } = useCacheKey()
const { data } = await useAsyncData(
  () => getCacheKey({ resource: 'product' }),
  async () => { ... }
)
```
**Result:** App crashes with "composable called outside setup" error

### After Rule ✅
Developers write:
```typescript
const storefrontContext = useStorefrontContext()
const { locale } = useI18n()
const { data } = await useAsyncData(
  () => createCacheKey({
    locale: locale.value,
    tenantId: storefrontContext.value.tenant?.id,
    resource: 'product'
  }),
  async () => { ... }
)
```
**Result:** App works correctly with reactive, locale-aware caching

## Enforcement

- **AI Agents:** Must read AI_AGENT_RULES.md before making changes
- **Developers:** Should reference coding-standards.md during development
- **Code Review:** Reviewers should check for this pattern in PRs touching useAsyncData

## Files Implementing This Rule

Current implementations following this rule:
- ✅ `app/app.vue` - Theme data fetching
- ✅ `app/pages/categories.vue` - Categories list fetching
- ✅ `app/pages/[...slug].vue` - Runtime page fetching
- ✅ `app/pages/search.vue` - Search results fetching
- ✅ `app/composables/useProductDetail.ts` - Product detail (uses useCacheKey wrapper safely)

## Next Steps

When adding new pages or components that use `useAsyncData`:
1. Check if you're in a **page component** or a **composable**
2. Follow the appropriate pattern from coding-standards.md
3. Ensure cache keys include `locale` and optionally `tenantId`
4. Test language switching to verify reactivity works
