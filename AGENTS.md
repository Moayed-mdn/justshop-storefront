# AI Agent Rules for JustShop Frontend

## Purpose

This file is automatically loaded by AI-powered IDEs (Cursor, GitHub Copilot, etc.) to understand the mandatory operating rules for this repository.

**Repository:** JustShop Frontend - Multi-tenant E-commerce Storefront  
**Framework:** Nuxt 4 + Vue 3 + TypeScript  
**Architecture:** Multi-lingual (EN/AR), Multi-tenant, SSR-enabled

## 🚨 Critical Rules - Read First

### 1. Network/Data Deduplication Keys (Cache Keys)

**MANDATORY:** All cache keys MUST include locale to prevent mixing English/Arabic data.

```typescript
// ❌ WRONG - Static key causes EN/AR data mixing
const { data } = await useAsyncData('product-list', async () => { ... })

// ❌ WRONG - Composable called in arrow function breaks SSR
const { getCacheKey } = useCacheKey()
const { data } = await useAsyncData(() => getCacheKey({ resource: 'product' }), ...)

// ✅ CORRECT - Locale-aware, reactive, SSR-safe
const storefrontContext = useStorefrontContext()
const { locale } = useI18n()
const { data } = await useAsyncData(
  () => createCacheKey({
    locale: locale.value,              // Required for EN/AR separation
    tenantId: storefrontContext.value.tenant?.id, // Required for multi-tenant
    resource: 'product'
  }),
  async () => { ... }
)
```

**Key Requirements:**
- ✅ Always include `locale` (prevents EN/AR data mixing)
- ✅ Always include `tenantId` (multi-tenant isolation)
- ✅ Use reactive arrow function: `() => createCacheKey({...})`
- ✅ Extract composables in setup(), access `.value` in arrow function
- ✅ In pages: Use `createCacheKey()` directly
- ✅ In composables: `useCacheKey()` wrapper is safe

**Why:** Without locale in keys, switching EN→AR shows stale English data until manual page reload.

### 2. Runtime Route Resolution - Locale Extraction

**MANDATORY:** When calling runtime route resolution APIs, always extract the locale from the path if it contains a locale prefix.

```typescript
// ❌ WRONG - Using stale context locale
const resolveRoute = async (path: string) => {
  const response = await api('/runtime/resolve', {
    query: {
      path: path,
      locale: context.value.locale  // Stale! May not match path
    }
  })
}

// ✅ CORRECT - Extract locale from path first
const resolveRoute = async (path: string) => {
  let requestLocale = context.value.locale
  const pathParts = path.split('/').filter(Boolean)
  if (pathParts.length > 0 && ['en', 'ar'].includes(pathParts[0])) {
    requestLocale = pathParts[0] as 'en' | 'ar'
  }
  
  const response = await api('/runtime/resolve', {
    query: {
      path: path,
      locale: requestLocale  // Matches the path locale
    }
  })
}
```

**Key Requirements:**
- ✅ Extract locale from path before making route resolution API calls
- ✅ Check if path starts with `/en/` or `/ar/` prefix
- ✅ Fall back to context locale only if no prefix found
- ✅ Ensure locale parameter matches the path locale

**Why:** When switching languages (e.g., EN → AR), the context locale may be stale during route resolution. If you send `{path: '/ar/shop', locale: 'en'}`, the backend caches with wrong locale and returns 'not_found', causing "Page not found" errors.

**Example Error Without This Rule:**
- User visits `/en/shop` (works fine)
- User clicks language switch to Arabic → navigates to `/ar/shop`
- Frontend sends: `{path: '/ar/shop', locale: 'en'}` ❌ (stale context)
- Backend caches route with key: `en:/ar/shop` (mismatch!)
- Backend returns `status: 'not_found'`
- Frontend throws: "Unhandled error during execution of setup function"

**Real-World Implementation:** See `src/core/runtime/router/useRouteResolver.ts` for the correct pattern.

### 3. SSR Safety Rules

- Guard all `window`, `document`, `localStorage`, browser APIs with SSR checks
- Use `import.meta.client`, `import.meta.server`, or `process.client` guards
- Keep plugin ordering: `01.auth.client.ts` before `02.cart.client.ts`
- Use `ClientOnly` only for minimal non-SEO UI (badges, toggles, widgets)
- Never wrap main content, layouts, or navigation in `ClientOnly`

### 3. Multilingual Project Rules

- This project is **multilingual** (English + Arabic)
- **All** data fetching must respect locale
- **All** cache keys must include locale prefix
- Use `useI18n()` for locale management
- Keep translations in `i18n/locales/<locale>/`
- Test language switching: EN ↔ AR must refetch data automatically

### 4. Security Rules

- Never add real secrets, tokens, or credentials to the repository
- Never put real values in `.env.example`
- Don't bypass `server/api` proxy layer for backend calls
- Treat auth, cart, profile, checkout as sensitive areas

### 5. Testing Documentation Rules

**MANDATORY:** When adding new features, you MUST add corresponding test scenarios to `docs/testing/CUSTOMER_UX_MANUAL_CHROMIUM_SCENARIOS.md`.

**Required for:**
- New pages or routes
- New user flows (checkout, profile, etc.)
- New features or functionality
- Changes to existing user journeys
- Integration of third-party services

**Scenario Format:**
```markdown
## Scenario X: [Feature Name]

### Goal
Describe what this scenario validates from customer perspective.

### Steps
1. First action
2. Second action
3. ...

### Expected
- Expected outcome 1
- Expected outcome 2
- ...

### Watch For
- Common error 1
- Edge case 2
- ...
```

**Why:** Manual testing scenarios ensure QA and stakeholders can validate the complete customer experience. Without documented scenarios, features cannot be properly verified.

## 📚 Complete Documentation

For comprehensive rules, patterns, and examples:

### Primary Rules (Read Before Any Change)
- **`docs/development/AI_AGENT_RULES.md`** - Complete mandatory rules for AI agents
- **`docs/development/coding-standards.md`** - Code style, naming, patterns

### Architecture & Features
- **`docs/architecture/cache-deduplication.md`** - Cache system architecture
- **`docs/architecture/overview.md`** - System architecture overview
- **`docs/architecture/theme-system-architecture.md`** - Theme system
- **`docs/architecture/routing-and-navigation.md`** - Routing rules

### Setup & Getting Started
- **`README.md`** - Project overview, setup commands
- **`docs/getting-started/installation.md`** - Installation guide
- **`docs/getting-started/project-structure.md`** - Directory structure

### Technical Deep Dives
- **`COMPOSABLE_CONTEXT_FIX.md`** - SSR composable context errors (useAsyncData)
- **`REACTIVE_CACHE_KEY_FIX.md`** - Language switching reactivity
- **`CACHE_DEDUPLICATION_INDEX.md`** - Complete cache implementation guide

### Development Workflows
- **`CONTRIBUTING.md`** - Contributor workflow
- **`docs/development/composables.md`** - Composable patterns
- **`docs/development/testing.md`** - Testing standards
- **`docs/testing/CUSTOMER_UX_MANUAL_CHROMIUM_SCENARIOS.md`** - Manual test scenarios

### Refactoring Program
- **`docs/refactoring-plan/README.md`** - Active refactoring program map
- **`docs/refactoring-plan/storefront-commerce-consolidation-execution-plan.md`** - Current transformation plan

## 🎯 Quick Decision Tree

### "I need to fetch data in a page component"
→ Read: `AI_AGENT_RULES.md` → useAsyncData Cache Key Rules  
→ Pattern: Extract composables in setup, use `createCacheKey()` with locale + tenantId

### "I need to create a composable"
→ Read: `docs/development/composables.md` + `coding-standards.md`  
→ Pattern: Can use `useCacheKey()` wrapper safely inside composables

### "I need to add a new page"
→ Read: `coding-standards.md` → File Placement Rules  
→ Place in: `app/pages/` with proper route structure

### "I need to modify cache behavior"
→ Read: `docs/architecture/cache-deduplication.md`  
→ Check: `src/core/cache/createCacheKey.ts` for cache utilities

### "I need to add translations"
→ Read: `coding-standards.md` → UI, Styling, And Accessibility  
→ Add to: `i18n/locales/<locale>/<namespace>.json`

### "I'm getting SSR/hydration errors"
→ Read: `AI_AGENT_RULES.md` → SSR And Hydration Rules  
→ Check: `COMPOSABLE_CONTEXT_FIX.md` for composable errors

### "I need to modify theme system"
→ Read: `docs/architecture/theme-system-architecture.md`  
→ Check: `app/composables/useTheme.ts` and `app/composables/useStoreTheme.ts`

### "I need to add a new feature"
→ Read: `coding-standards.md` → Implementation patterns  
→ **REQUIRED:** Add test scenario to `docs/testing/CUSTOMER_UX_MANUAL_CHROMIUM_SCENARIOS.md`  
→ Format: Goal, Steps, Expected, Watch For (see existing scenarios for examples)

## 🔍 Important File Locations

### Core Configuration
- `nuxt.config.ts` - Nuxt configuration
- `package.json` - Dependencies and scripts
- `.env.example` - Environment variables template

### Shared Contracts
- `shared/utils/routes.ts` - Route constants (use instead of hardcoding paths)
- `types/**` - TypeScript types

### State Management
- `app/stores/auth.ts` - Auth state (persisted)
- `app/stores/cart.ts` - Cart state (persisted)

### Composables
- `app/composables/useApi.ts` - API requests
- `app/composables/useAuth.ts` - Authentication
- `app/composables/useTheme.ts` - Theme management
- `src/core/cache/createCacheKey.ts` - Cache key utilities

### Backend Integration
- `server/api/**` - Nitro server routes (proxy to backend)
- `server/utils/api.ts` - Backend proxy helpers

### Testing
- `docs/testing/CUSTOMER_UX_MANUAL_CHROMIUM_SCENARIOS.md` - Manual test scenarios (update when adding features)

## ⚠️ Common Pitfalls to Avoid

1. **❌ Static cache keys without locale**
   - Results in: EN/AR data mixing, users see wrong language data

2. **❌ Route resolution with stale locale from context**
   - Results in: "Page not found" errors when switching languages, backend cache mismatches

3. **❌ Using `useCacheKey()` in page components**
   - Results in: "composable called outside setup" SSR errors

4. **❌ Hardcoding route strings instead of using `shared/utils/routes.ts`**
   - Results in: Maintenance burden, inconsistent URLs

5. **❌ Not guarding browser APIs in SSR context**
   - Results in: Server-side rendering failures

6. **❌ Wrapping main content in `ClientOnly` to fix hydration**
   - Results in: Poor SEO, flash of unstyled content, bad UX

7. **❌ Adding new request helpers when they already exist**
   - Results in: Multiple overlapping surfaces, confusion

8. **❌ Bypassing `server/api` to call backend directly**
   - Results in: CORS issues, auth problems, security risks

9. **❌ Adding features without test scenarios**
   - Results in: Incomplete QA coverage, untestable features, missing edge cases

## 🔄 Required Workflow

1. **Read before editing:** Check live source files you're about to change
2. **Follow documentation order:** Respect the documented phase order
3. **Update docs with code:** Always update documentation when changing:
   - Environment variables
   - Routes or route families
   - Stores, plugins, modules
   - Deployment or runtime behavior
   - External integrations
4. **Add test scenarios:** When adding new features, update `docs/testing/CUSTOMER_UX_MANUAL_CHROMIUM_SCENARIOS.md`:
   - Add scenario with Goal, Steps, Expected, Watch For
   - Include edge cases and error states
   - Reference existing scenarios for format consistency
5. **Run diagnostics:** After substantial edits, run and fix issues you introduced
6. **Test language switching:** For any data fetching changes, verify EN ↔ AR works

## 🎓 Learning Path for New Contributors

1. Read `README.md` - Understand project overview
2. Read `docs/development/AI_AGENT_RULES.md` - Learn mandatory rules
3. Read `docs/development/coding-standards.md` - Learn code patterns
4. Read `docs/getting-started/project-structure.md` - Understand file organization
5. Read `docs/architecture/overview.md` - Understand system architecture
6. Make a small change following the rules
7. Run `npm run build` and fix any issues

## 📞 Questions or Issues?

- Check `docs/reference/faq.md` for common questions
- Check `docs/reference/decisions.md` for architectural decisions
- Check `docs/development/troubleshooting.md` for common problems
- Check `CHANGELOG.md` for recent changes

## 🔗 Quick Links

- [AI Agent Rules](docs/development/AI_AGENT_RULES.md) - **Start here**
- [Coding Standards](docs/development/coding-standards.md)
- [Cache Architecture](docs/architecture/cache-deduplication.md)
- [Documentation Map](docs/index.md)
- [Project README](README.md)

---

**Last Updated:** 2026-06-16  
**Maintained By:** Development Team  
**Version:** 1.0.0

---

## Meta: About This File

This `AGENTS.md` file follows the convention used by AI-powered IDEs to automatically load project-specific rules and context. When you open this project in Cursor, GitHub Copilot Workspace, or similar tools, this file provides the AI with essential context about the project's architecture, rules, and patterns.

**Key Features:**
- Automatically loaded by compatible IDEs
- Provides critical "gotchas" upfront
- Links to comprehensive documentation
- Includes decision trees for common tasks
- Prevents common mistakes with explicit anti-patterns

**When to Update:**
- When adding major architectural rules
- When introducing new critical patterns
- When adding new documentation that AI agents should know about
- When fixing common mistakes repeatedly made by developers/AI
