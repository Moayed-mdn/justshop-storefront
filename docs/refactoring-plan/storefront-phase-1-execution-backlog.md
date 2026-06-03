# Phase 1 Execution Backlog — Storefront Commerce Consolidation

## Status

- Program: Storefront Commerce Consolidation
- Phase: 1 — Product Alignment And Canonical Model (Master Plan Phase 1)
- Corresponding execution phases: Phase 0 (Guardrails) + Phase 1 (Route Consolidation) + Phase 2 (Shell Architecture) start
- Active owner docs: `docs/architecture/storefront-routes.md`, `docs/architecture/storefront-shell.md`
- Execution baseline: code-backed canonical routes (`shared/utils/storefront-routes.ts`) and shell model (`app/components/shell/`) exist but are not yet wired into all layouts and legacy surfaces.

---

## Target Storefront Information Architecture

### IA Layers

```
Home            / and /{locale}
├── Shop       /shop
│   ├── Category  /shop/category/:slug
│   └── Product   /shop/product/:slug
├── Search     /search?q=
├── Cart       /cart
├── Auth
│   ├── Login        /login
│   ├── Register     /register
│   ├── Forgot pwd   /forgot-password
│   └── Verify email /verify-email/:id/:hash
├── Profile    /profile
├── Orders
│   ├── List       /orders
│   ├── Detail     /orders/:orderNumber
│   └── Track      /orders/track
└── Checkout returns
    ├── Success  /checkout/success
    └── Cancel   /checkout/cancel
```

### Principles

- One canonical path per surface, enforced by `STOREFRONT_ROUTE_PATHS` in `shared/utils/storefront-routes.ts`.
- Legacy paths (`/products/*`, `/products/product/:slug`) resolve via explicit 301 redirects in `resolveStorefrontLegacyRedirect()`.
- No new hardcoded storefront path families. All internal links use `useStorefrontRoutes()`.

---

## Canonical Route Families

| Surface | Canonical path template | Builder |
|---|---|---|
| Home | `/` | `useStorefrontRoutes().home()` |
| Shop landing | `/shop` | `useStorefrontRoutes().shop()` |
| Category | `/shop/category/:slug` | `useStorefrontRoutes().category(slug)` |
| Product detail | `/shop/product/:slug` | `useStorefrontRoutes().product(slug)` |
| Search | `/search` | `useStorefrontRoutes().search(query?)` |
| Cart | `/cart` | `useStorefrontRoutes().cart()` |
| Login | `/login` | `useStorefrontRoutes().login()` |
| Register | `/register` | `useStorefrontRoutes().register()` |
| Forgot password | `/forgot-password` | `useStorefrontRoutes().forgotPassword()` |
| Reset password | `/reset-password` | `useStorefrontRoutes().resetPassword()` |
| Profile | `/profile` | `useStorefrontRoutes().profile()` |
| Orders list | `/orders` | `useStorefrontRoutes().orders()` |
| Order detail | `/orders/:orderNumber` | `useStorefrontRoutes().orderDetail(number)` |
| Order tracking | `/orders/track` | `useStorefrontRoutes().orderTrack()` |
| Checkout success | `/checkout/success` | `useStorefrontRoutes().checkoutSuccess()` |
| Checkout cancel | `/checkout/cancel` | `useStorefrontRoutes().checkoutCancel()` |
| Email verification | `/verify-email/:id/:hash` | `useStorefrontRoutes().verifyEmail(id, hash)` |

Legacy redirects (all 301, logged in dev):

| From | To |
|---|---|
| `/products` | `/shop` |
| `/products/category/:slug` | `/shop/category/:slug` |
| `/products/product/:slug` | `/shop/product/:slug` |
| `/products/:slug` | `/shop/product/:slug` |

---

## Shell Ownership Rules

### Canonical shell model

Defined in `app/composables/useStorefrontShell.ts` using provide/inject (SSR-safe):

| Variant | Topbar | Search | Cart | Account | Footer | Runtime nav |
|---|---|---|---|---|---|---|
| `full` | yes | yes | yes | yes | yes | yes |
| `minimal` | no | no | yes | yes | no | no |
| `runtime-bridge` | no | yes | yes | yes | yes | yes |

### Layout ownership

| Layout | Shell variant | Route surfaces | Target |
|---|---|---|---|
| `default` | `full` | Legacy commerce | Delegates to `StorefrontShell` |
| `auth` | `minimal` | Login, register, forgot/reset password | Uses `FooterAuth` (legacy), no header |
| `storefront` | `full` | Canonical legacy commerce | Wraps `StorefrontShell` |
| `runtime-default` | `runtime-bridge` | Runtime home, shop, category, product, marketing | Delegates to shell with commerce affordances |
| `catalog` | `runtime-bridge` | Catalog browse | Same as above |
| `marketing` | `runtime-bridge` | Content pages | Same as above |
| `product` | `runtime-bridge` | Product detail | Same as above |

### Migration rule

- `RuntimeHeader.vue` / `RuntimeFooter.vue` → delegate to `StorefrontShellHeader` / `StorefrontShellFooter` during Wave 2.
- `Header.vue` / `Footer.vue` → remain in repo; their child components are reused by shell.
- Shell component files under `app/components/shell/` own the final storefront header and footer. Legacy header files are consumed-by-reference, not forked.

### Runtime-to-legacy shell transition

- The server middleware `server/middleware/01.tenant.ts` legacy-passthrough prefix list (`/login`, `/register`, `/cart`, `/checkout`, `/orders`, `/profile`, `/verify-email`, `/auth`) controls which paths reach file-based pages.
- Runtime catch-all (`app/pages/[...slug].vue`) returns 404 for passthrough paths.
- During Wave 2 the shell must unify these two sides so layout swapping is invisible to the user.

---

## State Ownership Rules

### Auth

| Concern | Owner | Persistence | SSR |
|---|---|---|---|
| Token | `authStore` (`app/stores/auth.ts`) | Cookie (`auth`) via `piniaPluginPersistedstate` | Available server-side via `server/utils/api.ts` cookie read |
| User object | `authStore` | NOT persisted | Fetched fresh via `01.auth.client.ts` or `middleware/auth.ts` |
| Login flow | `useAuth().login()` → Nitro `/api/auth/login` | Sets token cookie | N/A |
| Logout flow | `useAuth().logout()` → Nitro `/api/auth/logout` | Clears token, calls `cartStore.onLogout()` | N/A |
| Registration | `useAuth().register()` → Nitro `/api/auth/register` | N/A (redirects to login) | N/A |
| Email verification | `app/pages/verify-email/[id]/[hash].vue` | N/A | SSR-safe (standalone page) |
| Password reset | **MISSING** — `login.vue` links to `/forgot-password` but no page exists | N/A | N/A |
| Google auth | `app/pages/auth/google/callback.vue` | Sets token via query param | N/A |

**Rules:**
- Auth bootstrap must become singular (currently scattered across `01.auth.client.ts`, `middleware/auth.ts`, `useProfile().fetchProfile()`, Google callback).
- Runtime shell must consume `authStore` for account entry visibility.
- Token cookie must become tenant-scoped (currently global key `auth`).

### Cart

| Concern | Owner | Persistence | SSR |
|---|---|---|---|
| Authenticated cart | `cartStore` → Nitro `/api/cart` | Backend | SSR via Nitro proxy |
| Guest cart | `cartStore` | `localStorage` key `guest_cart` | NOT SSR-safe |
| Cart badge | `HeaderActions.vue` (legacy) | N/A | `ClientOnly` |
| Cart page | `app/pages/cart.vue` | N/A | `ClientOnly`-gated |
| Add to cart | `cartStore.addItem()` / `UiCartButton.vue` | Immediate local for guest | N/A |
| Merge on login | `cartStore.onLogin()` → `mergeGuestCartToServer()` | Item-by-item POST | N/A |

**Rules:**
- Runtime shell must consume `cartStore` for cart badge entry.
- Guest cart `localStorage` key must become tenant-scoped (currently global `guest_cart`).
- Cart merge failure handling must improve (currently swallows errors).
- Runtime product pages must eventually expose add-to-cart (Phase 6, not Phase 1).

### Search

| Concern | Owner | Persistence | SSR |
|---|---|---|---|
| Search page | `app/pages/search.vue` | N/A | Client-only (Apollo on `onMounted`) |
| Autocomplete | `HeaderSearchInput.vue` → Apollo | N/A | Client-only |
| GraphQL client | `app/plugins/apollo.client.ts` | N/A | Client-only |
| REST proxy | `server/api/search.get.ts` | N/A | Not consumed by UI |

**Rules:**
- Search must integrate into the runtime shell (search trigger, mobile search).
- Search result links must use canonical `/shop/product/:slug`, not stale `/products/product/:slug`.
- Search tenant propagation must be explicit (Apollo currently does not inject storefront headers).
- Search SSR is Phase 5; Wave 1 only fixes link correctness.

---

## Ordered Engineering Workstreams

Phase 1 covers 3 sequential waves. Each wave has its own acceptance criteria.

### Wave 1.1 — Canonical Route Recovery

**Dependency:** Shared route constants and redirect rules already exist in code.

**What must happen:**
1. Audit every storefront component for hardcoded `/products`, `/products/product/:slug`, `/products/category/:slug` and replace with `useStorefrontRoutes()` calls.
2. Normalize breadcrumb components (`CategoryHeader.vue`, `ProductBreadcrumb.vue`, `CartBreadcrumb.vue`, `OrdersBreadcrumb.vue`, `OrdersOrderBreadcrumb.vue`) to use canonical route builders.
3. Normalize search result links, cart item links, and order item links.
4. Normalize legacy header navigation (`HeaderLinks.vue` computed links — `/products` → `/shop`).
5. Remove stale route-constant drift in `shared/utils/routes.ts` that conflicts with `shared/utils/storefront-routes.ts`.
6. Ensure `useStorefrontRoutes()` is the only route-builder consumed in Vue components and middleware.

**Exit criteria:**
- No hardcoded `/products/product/:slug` paths remain in `app/components/` or `app/pages/`.
- Breadcrumbs across all surfaces use `useStorefrontRoutes()`.
- Legacy header nav links to `/shop` (not `/products`).
- Search results, cart items, and order items link to `/shop/product/:slug`.
- Route constants in `shared/utils/routes.ts` align with `STOREFRONT_ROUTE_PATHS` or are deprecated.

---

### Wave 1.2 — Unified Shell Foundation

**Dependency:** Wave 1.1 complete (correct routes exist so shell can link correctly).

**What must happen:**
1. Wire `StorefrontShell.vue` into `app/layouts/default.vue` as the primary wrapper for legacy commerce pages.
2. Wire `StorefrontShell.vue` into `app/layouts/runtime-default.vue`, `catalog.vue`, `marketing.vue`, `product.vue` as the `runtime-bridge` variant.
3. Ensure `RuntimeHeader.vue` and `RuntimeFooter.vue` delegate to shell components.
4. Ensure `Header.vue` and `Footer.vue` delegate to shell components or are consumed-by-reference.
5. Expose auth state in the runtime shell: login/register link when guest, account dropdown when authenticated.
6. Expose cart badge in the runtime shell (may use `ClientOnly` for the badge count, consistent with legacy pattern).
7. Expose search trigger in the runtime shell (navigates to `/search`).
8. Normalize mobile navigation across shell variants.

**Exit criteria:**
- No shell jump between runtime pages and legacy commerce pages.
- Auth state (login/account) visible consistently across all storefront surfaces.
- Cart badge visible consistently (with same `ClientOnly` treatment as legacy).
- Search trigger present on all storefront surfaces including runtime.
- Mobile navigation is unified.

---

### Wave 1.3 — Local Route & Navigation Hardening

**Dependency:** Wave 1.2 complete (shell surface exists, routing can be stress-tested).

**What must happen:**
1. Add `app/middleware/storefront-legacy-redirect.global.ts` (documented in `storefront-routes.md`) if not yet wired.
2. Remove stale route assumptions in `shared/utils/routes.ts` (`APP_ROUTES.products.detail` → deprecate or align).
3. Normalize locale-aware navigation in runtime pages (currently uses plain `NuxtLink`; must use `localePath` from `useStorefrontRoutes()` where appropriate).
4. Add `/forgot-password` and `/reset-password` page stubs at canonical paths (placeholders only; full auth flow is Wave 3).
5. Verify legacy-passthrough middleware (`server/middleware/01.tenant.ts`) remains correct for current page inventory.

**Exit criteria:**
- Legacy redirect middleware is active and logged.
- `shared/utils/routes.ts` stale constants are deprecated or realigned.
- Locale-aware links work correctly in runtime shell navigation.
- `/forgot-password` and `/reset-password` resolve to the correct shell variant without 404.

---

## Acceptance Criteria (Cross-Wave)

The following must be true after all 3 waves complete:

1. **Route unity:** Every storefront URL belongs to exactly one canonical family. Typing a legacy path produces a 301 redirect.
2. **Shell continuity:** Moving between `/shop`, `/shop/product/:slug`, `/cart`, `/search`, `/profile`, and `/orders` never swaps header/footer families.
3. **Auth entry:** Login/register links and account status are visible from every storefront page.
4. **Cart entry:** Cart badge is visible from every storefront page.
5. **Search entry:** Search trigger is visible from every storefront page.
6. **Navigation correctness:** All internal links, breadcrumbs, and redirects use `useStorefrontRoutes()` canonical builders.
7. **No new drift:** No hardcoded storefront path strings in new commits.
8. **Waves are small:** Each wave is 1-2 engineering sessions, not multi-week efforts.

---

## Risk List

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Shell changes break existing legacy page behavior | Medium | High | Keep legacy header/footer components intact; shell delegates to them |
| Route replacement misses a component | Medium | Medium | Targeted grep for `/products` in `app/` after each wave |
| Legacy redirect middleware conflicts with runtime resolver | Low | High | Test `/products` → `/shop` round-trip after each change |
| Auth/cart `ClientOnly` usage creates hydration mismatch on runtime surfaces | Medium | Medium | Keep `ClientOnly` pattern from legacy; runtime bridge inherits same approach |
| Shell rewire breaks SSR rendering of runtime pages | Medium | High | Test `npm run build && npm run preview` after shell layout changes |
| Tenant persistence key changes break existing sessions | Low | High | Defer tenant-scoped keying to Phase 8; Phase 1 uses existing global keys |
| Wave scope creep into auth/cart/search refactoring | High | Medium | Enforce wave boundaries; only WAVE-specific changes allowed |

---

## Recommended Implementation Order (Next 4 Prompts)

### Prompt 1: Wave 1.1 — Hardcoded Route Audit & Replacement

**Scope:** Replace every stale `/products/product/:slug`, `/products`, `/products/category/:slug` in components with `useStorefrontRoutes()` builders.

**Files to touch:**
- `app/components/search/SearchProductCard.vue`
- `app/components/header/HeaderSearchInput.vue`
- `app/components/cart/CartPageItem.vue`
- `app/components/order/OrderItem.vue`
- `app/components/layout/CategoryHeader.vue`
- `app/components/product/ProductBreadcrumb.vue`
- `app/components/header/HeaderLinks.vue`
- `shared/utils/routes.ts` — deprecate or align stale constants
- Any other file found by grep for stale patterns

**Verification:** `npm run build` passes. Grep for `/products/product` returns 0 hits in `app/components` and `app/pages`.

### Prompt 2: Wave 1.2 — Shell Unification

**Scope:** Wire `StorefrontShell` into all layouts, expose auth/cart/search in runtime shell.

**Files to touch:**
- `app/layouts/default.vue` — delegate to `StorefrontShell`
- `app/layouts/runtime-default.vue`, `catalog.vue`, `marketing.vue`, `product.vue` — switch to `runtime-bridge` variant
- `app/components/runtime/RuntimeHeader.vue` — delegate to `StorefrontShellHeader`
- `app/components/runtime/RuntimeFooter.vue` — delegate to `StorefrontShellFooter`
- `app/components/shell/StorefrontShellHeader.vue` — add auth section (login/register/account), cart badge, search trigger
- `app/components/shell/StorefrontShell.vue` — ensure variant switching works

**Verification:** `npm run build` passes. Manual: navigate from `/shop` → `/cart` → `/profile` — no shell swap.

### Prompt 3: Wave 1.2 Completion + Wave 1.3 Start

**Scope:** Complete shell auth/cart wiring. Add legacy redirect middleware. Add `/forgot-password` + `/reset-password` stubs.

**Files to touch:**
- `app/components/shell/StorefrontShellHeader.vue` — finalize auth dropdown, cart badge integration
- `app/middleware/storefront-legacy-redirect.global.ts` — wire `resolveStorefrontLegacyRedirect()`
- `app/pages/forgot-password.vue` — page shell placeholder in auth layout
- `app/pages/reset-password.vue` — page shell placeholder in auth layout
- `shared/utils/routes.ts` — finalize deprecations

**Verification:** `npm run build` passes. `/forgot-password` and `/reset-password` render in auth shell.

### Prompt 4: Wave 1.3 Completion + Entry Into Wave 2

**Scope:** Hardening pass, verify legacy redirects, check mobile nav, confirm all acceptance criteria for Phase 1.

**Files to touch:**
- `server/middleware/01.tenant.ts` — verify legacy-passthrough list is correct
- `app/layouts/auth.vue` — verify shell variant is `minimal`
- `app/components/header/HeaderBurger.vue` — if used by shell, normalize mobile nav
- Diagnostics and fixes from build output

**Verification:** Full Phase 1 exit criteria check. `npm run build && npm run preview` — smoke test all canonical paths.

---

## Relationship To Other Documents

- Use `docs/architecture/storefront-routes.md` as the route authority.
- Use `docs/architecture/storefront-shell.md` as the shell authority.
- Use `shopify-like-storefront-master-plan.md` for product direction.
- Use `storefront-commerce-consolidation-execution-plan.md` for the full 12-phase program.
- Use `audits/storefront-commerce-consolidation-audit.md` for current-state problem details.
