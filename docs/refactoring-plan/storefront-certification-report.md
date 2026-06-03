# Storefront Certification Report

**Date:** 2026-06-03
**Program:** Storefront Commerce Consolidation — Phase 9 (Legacy Retirement & Certification)
**Status:** Complete

---

## 1. What Was Completed

### Legacy Retirement (Phase 9 Cleanup)

Nine files confirmed dead via dependency audit and removed:

| File | Reason | Risk |
|---|---|---|
| `app/composables/useCachedData.ts` | No consumers; general-purpose cache wrapper never called | None |
| `app/composables/useProductByCategory.ts` | No consumers; legacy category product listing superseded by runtime | None |
| `app/composables/useProduct.ts` | No consumers; legacy product listing superseded by runtime | None |
| `app/components/header/HeaderAuth.vue` | Commented out in auth layout; no active imports | None |
| `src/core/rendering/sections/ProductDetailSection.vue` | Never registered in `registry.ts`; superseded by `RuntimeProductSummarySection` | None |
| `server/api/best_seller.get.ts` | Nitro endpoint with zero UI consumers | None |
| `server/api/hero.get.ts` | Nitro endpoint with zero UI consumers | None |
| `server/api/search.get.ts` | REST proxy endpoint never consumed by UI (search uses Apollo) | None |
| `app/config/cache.ts` | Only consumer was `useCachedData.ts` (also deleted); no other imports | None |

### Stale Route Constant Cleanup

Removed dead API route constants from `shared/utils/routes.ts`:

- `API_ROUTES.products.bestSeller`
- `API_ROUTES.products.hero`
- `API_ROUTES.search`
- `EXTERNAL_API_ROUTES.homepage` (entire block: `bestSeller`, `hero`)

All confirmed unreferenced in source code (zero imports or string matches).

### Prior Phase Work (Recap)

- **Phase 1-3:** Canonical routes unified via `useStorefrontRoutes()`, shell architecture wired into all 8 layouts, legacy 301 redirect middleware active, zero hardcoded path violations.
- **Phase 4:** 6+1 runtime sections registered and hardened (hero, category grid, product grid, category summary, product summary, feature list, shop grid). Product detail page upgraded with loading skeleton, stock badge, mobile sticky bar, related products.
- **Phase 5:** Cart/auth/account continuity audit completed; gaps documented but deferred.
- **Phase 6:** Search result page consolidated to use `ProductCard` (replacing `SearchProductCard`), breadcrumbs added, grid aligned with storefront design tokens.
- **Phase 8:** SEO metadata added to 9 storefront pages. Image `loading="lazy" decoding="async"` on product cards and galleries. Mobile safe-area padding on sticky bars.

### Documentation Updates

- `docs/refactoring-plan/README.md` — linked certification report and added Phase 9 to navigation table.
- `docs/index.md` — linked certification report in document index.
- `docs/refactoring-plan/storefront-phase-1-execution-backlog.md` — left in place as historical reference.

---

## 2. Remaining Open Items

The following gaps were identified but intentionally left open (not Phase 9 scope):

| Gap | Location | Notes |
|---|---|---|
| No register link in unauthenticated header | `StorefrontShellHeader.vue` | Low risk; login page already links to register |
| Logout redirects to login instead of home | `useAuth.ts` | Preference change, not a bug |
| Loading state not wired in header UI for auth | `HeaderActions.vue` | Minor UX gap |
| No mini-cart drawer | — | Enhancement, not baseline requirement |
| hreflang and canonical link tags not on all pages | — | SEO enhancement, not blocker |
| Nuxt Image module not configured | — | CLS improvement, not blocker |
| Search SSR via Apollo is client-only | `search.vue` | Search SEO known limitation |
| Cart SSR skeleton flash | `cart.vue` | Known hydration pattern |
| Auth/account state absent from runtime shell during SSR | `StorefrontShell.vue` | ClientOnly pattern covers post-hydration |
| Tenant-scoped persistence keys | `auth` cookie, `guest_cart` localStorage | Cross-tenant risk accepted for now |

---

## 3. Intentionally Deferred

These Phase 5-8 workstreams were identified during the audit but deliberately deferred to keep the current session focused on low-risk cleanup:

1. **Cart/auth continuity gaps** — register link, logout redirect, header loading state
2. **hreflang/canonical link tags** — remaining pages
3. **Nuxt Image module integration**
4. **Search SSR** — requires Apollo migration or REST proxy switch
5. **Tenant-scoped persistence keys** — breaking change that affects active sessions
6. **Runtime shell search entry** — search trigger currently in legacy header only

These are genuine gaps but do not block certification of the unified storefront baseline. They are tracked in the master plan's Phase 5-8 scope.

---

## 4. Risks Still Present

| Risk | Severity | Notes |
|---|---|---|
| Cross-tenant `guest_cart` leakage | Medium | Global localStorage key, no tenant scoping |
| Cross-tenant `auth` cookie reuse | Medium | Global cookie key, no tenant scoping |
| Cart merge-on-login swallows errors | Low | `mergeGuestCartToServer()` clears guest cart even on partial failure |
| Search client-only = no SEO | Low | Acceptable for current search volume |
| Runtime shell navigation reloads per page | Low | Navigation payload fetched on every runtime route |
| Deferred gaps may never be revisited | Medium | No tracking system outside this report |

---

## 5. Manual Verification Checklist

Use this checklist to verify the storefront baseline is intact after the cleanup:

### Route Integrity
- [ ] `/shop` resolves to runtime shop landing
- [ ] `/shop/category/:slug` resolves to runtime category page
- [ ] `/shop/product/:slug` resolves to runtime product detail page
- [ ] `/products` redirects 301 to `/shop`
- [ ] `/products/product/:slug` redirects 301 to `/shop/product/:slug`
- [ ] `/products/category/:slug` redirects 301 to `/shop/category/:slug`
- [ ] `/search?q=term` renders search results with `ProductCard` grid
- [ ] `/cart`, `/login`, `/register`, `/profile`, `/orders` resolve without 404

### Shell Continuity
- [ ] No shell jump between `/shop`, `/shop/product/:slug`, `/cart`, `/search`
- [ ] Auth state visible (login/register or account dropdown) on all storefront surfaces
- [ ] Cart badge visible on all storefront surfaces
- [ ] Search trigger available on all storefront surfaces
- [ ] Mobile navigation is unified across surfaces

### Auth & Cart
- [ ] Login flow completes and redirects to home
- [ ] Register flow completes and redirects to login
- [ ] Logout clears auth state and redirects
- [ ] Guest cart persists in localStorage across page navigations
- [ ] Guest cart merges on login

### Build & Runtime
- [ ] `npm run build` completes with zero errors
- [ ] Runtime pages SSR without console errors
- [ ] Legacy page paths SSR without console errors
- [ ] Locale switching works on all surfaces

---

## 6. Removal Summary

**Total files removed:** 9
**Total route constants removed:** 5
**Files confirmed NOT removed (ambiguous or used):** `server/api/auth/google/callback.get.ts` (imported by v1 handler), `app/composables/useProductFilters.ts` (used by 4 source files)

No existing storefront functionality, page rendering, navigation, auth, or cart behavior is affected by these deletions. All removed files were confirmed to have zero runtime consumers via cross-referencing imports, template references, and route consumer checks across `app/`, `src/`, `server/`, and `shared/`.
