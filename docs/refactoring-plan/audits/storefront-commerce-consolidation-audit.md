# JustShop Storefront Commerce Consolidation Audit

## Scope

- Repository audited: `justshop-frontend`
- Cross-check sources used for route/runtime validation: `laratenant-backend`
- Audit mode: inspect-only, current-state inventory, no refactors, no proposals
- Date: `2026-05-29`

## Executive Summary

The storefront is not a unified commerce experience. It is a hybrid storefront with a working runtime page renderer bolted beside a legacy Nuxt commerce application. The runtime can resolve and SSR content pages, category pages, product pages, navigation, and theme payloads, but it does not own the core commerce shell or the customer journey. Auth, cart, orders, profile, search, checkout outcomes, and account verification still live in a separate file-based app layer.

The result is not "runtime complete storefront." It is "runtime page rendering complete, commerce experience incomplete."

The biggest current truth:

- Runtime routes exist.
- Runtime SSR exists.
- Runtime sections exist.
- Runtime navigation/theme APIs exist.
- Commerce state is still legacy-first.
- Search is isolated.
- Auth is partially SSR-aware only on protected legacy pages.
- Cart is shared only where runtime pages reuse legacy product cards.
- Routing is internally inconsistent enough that multiple components still point to routes the runtime no longer uses.

## 1. Current Storefront Architecture Map

### Runtime-rendered pages

Runtime page rendering is owned by the catch-all page `app/pages/[...slug].vue` and the backend runtime route resolver in `laratenant-backend/app/Services/Storefront/Runtime/StorefrontRuntimeService.php`.

#### Frontend runtime entry path

- Catch-all page: `app/pages/[...slug].vue`
- Route resolver composable: `src/core/runtime/router/useRouteResolver.ts`
- Payload loader composable: `src/core/runtime/router/useStorefrontPayload.ts`
- Layout switcher: `src/core/rendering/LayoutManager.vue`
- Section renderer: `src/core/rendering/SectionRenderer.vue`
- Runtime shell components: `app/components/runtime/RuntimeHeader.vue`, `app/components/runtime/RuntimeFooter.vue`
- Runtime layouts: `app/layouts/runtime-default.vue`, `app/layouts/catalog.vue`, `app/layouts/marketing.vue`, `app/layouts/product.vue`
- Runtime context/state: `src/core/tenant/composables.ts`
- Runtime tenant middleware: `server/middleware/01.tenant.ts`
- Runtime headers: `src/core/api/headers.ts`
- Runtime cache key builder: `src/core/cache/createTenantCacheKey.ts`
- Runtime rollout gate: `src/core/runtime/rollout/useStorefrontRuntimeRollout.ts`

#### Runtime API surface

- Route resolve: `/api/storefront/runtime/resolve` -> `server/api/storefront/runtime/resolve.get.ts`
- Page payload: `/api/storefront/runtime/page/:id` -> `server/api/storefront/runtime/page/[id].get.ts`
- Navigation payload: `/api/storefront/runtime/navigation` -> `server/api/storefront/runtime/navigation.get.ts`
- Theme payload: `/api/storefront/runtime/theme` -> `server/api/storefront/runtime/theme.get.ts`
- Preview validation: `/api/storefront/runtime/preview/validate` -> `server/api/storefront/runtime/preview/validate.post.ts`

#### Runtime route patterns actually supported

These patterns are backed by `StorefrontRuntimeService::resolveRouteData()` in the backend:

- Home: `/` and locale-prefixed `/ar`
- Shop landing: `/shop` and `/ar/shop`
- Category page: `/products/category/:slug`
- Product page: `/products/:slug`
- Marketing pages: `/:slug` and localized equivalents, backed by `StoreMarketingPage`
- Redirects:
  - `/products` -> `/shop` via 301
  - `/old-about` -> localized `/about-us`

#### Runtime section inventory actually registered on the frontend

Registered in `src/core/rendering/registry.ts`:

- `HeroSection`
- `FeatureListSection`
- `CategoryGridSection`
- `CategorySummarySection`
- `ProductGridSection`
- `ProductSummarySection`

#### Runtime payload builders actually shipped by the backend

Backed by `StorefrontRuntimeService.php`:

- Home page payload: hero + category grid + product grid
- Shop page payload: category grid only
- Category page payload: category summary + product grid
- Product page payload: product summary only
- Marketing page payload: mapped CMS sections
- Navigation payload: header and footer arrays
- Theme payload: theme tokens, branding, direction, radius

#### Runtime page-to-layout mapping

- Home -> `default`
- Shop -> `catalog`
- Category -> `catalog`
- Product -> `product`
- Marketing page -> `marketing`

#### Runtime dependencies

- Uses `useStorefrontApi()` for all runtime frontend fetches in `src/core/api/client.ts`
- Injects `X-Tenant-Id`, `X-Storefront-Locale`, `X-Storefront-Version`, `X-Request-Id`, optional `X-Preview-Token`
- Uses Nitro proxy handlers for all runtime API calls
- Uses `useRuntimeServerApi()` in `server/utils/api.ts` for low-level Node requests so the request `Host` header reaches Laravel unchanged
- Depends on `server/middleware/01.tenant.ts` to bootstrap SSR tenant context before rendering

### Legacy file-based pages

The remaining legacy pages are:

- `app/pages/login.vue`
- `app/pages/register.vue`
- `app/pages/profile.vue`
- `app/pages/cart.vue`
- `app/pages/search.vue`
- `app/pages/orders/index.vue`
- `app/pages/orders/[orderNumber].vue`
- `app/pages/orders/track.vue`
- `app/pages/checkout/success.vue`
- `app/pages/checkout/cancel.vue`
- `app/pages/verify-email/[id]/[hash].vue`
- `app/pages/auth/google/callback.vue`

There are no file-based product pages or category pages in `app/pages/`. That surface has already moved to runtime resolution.

### Why these legacy pages still exist

This is not guesswork. The frontend middleware explicitly preserves them.

`server/middleware/01.tenant.ts` treats these prefixes as `legacyPassthrough`:

- `/login`
- `/register`
- `/cart`
- `/checkout`
- `/orders`
- `/profile`
- `/verify-email`
- `/auth`

The catch-all page `app/pages/[...slug].vue` throws a 404 whenever the runtime resolver returns `legacyPassthrough`. That means runtime does not bridge into those flows. It exits and lets file-based routing own them.

### How legacy pages integrate with runtime pages

- They share the same app instance in `app/app.vue`
- They share some composables and stores:
  - `useAuth()`
  - `useCart()`
  - `useCheckout()`
  - `useOrders()`
  - `useProfile()`
- They do not share one shell
- They do not share one navigation system
- They do not share one route contract
- They do not share one theme system
- They do not share one search implementation

### Where the UX disconnects occur

- Runtime pages use `RuntimeHeader` and `RuntimeFooter`; legacy pages use `Topbar` + `Header` + `Footer`
- Runtime product pages render a stripped-down summary section; legacy commerce components still assume richer product detail flows
- Runtime shop route is `/shop`; legacy header and breadcrumb logic still points to `/products`
- Search results and autocomplete point to `/products/product/:slug`; runtime product pages live at `/products/:slug`
- Runtime pages have no account indicator, no cart badge, no locale switcher, and no theme toggle
- Auth/account/cart/order flows are not embedded into the runtime shell at all

## 2. Application Shell Analysis

### Shells that actually exist

#### Shell A: legacy default shell

- Layout: `app/layouts/default.vue`
- Components:
  - `app/components/topbar/Topbar.vue`
  - `app/components/header/Header.vue`
  - `app/components/footer/Footer.vue`
- This is the main shell for cart, search, profile, orders, and checkout outcome pages

#### Shell B: auth shell

- Layout: `app/layouts/auth.vue`
- Components:
  - `app/components/footer/FooterAuth.vue`
- `HeaderAuth` is commented out in `app/layouts/auth.vue`
- Result: login, register, and Google callback pages render with no shared storefront header

#### Shell C: runtime shell

- Layouts:
  - `app/layouts/runtime-default.vue`
  - `app/layouts/catalog.vue`
  - `app/layouts/marketing.vue`
  - `app/layouts/product.vue`
- Components:
  - `app/components/runtime/RuntimeHeader.vue`
  - `app/components/runtime/RuntimeFooter.vue`

#### Shell D: standalone no-layout pages

- `app/pages/[...slug].vue` sets `layout: false` and manually mounts runtime layout management
- `app/pages/verify-email/[id]/[hash].vue` sets `layout: false` and renders a one-off screen

### Is there one unified shell?

No.

There are at least four shell modes:

- legacy default shell
- auth shell
- runtime shell
- standalone one-off shell

This is not cosmetic drift. It is structural shell fragmentation.

### Headers

#### Legacy header

- `app/components/header/Header.vue`
- Desktop nav from `HeaderLinks.vue`
- Search bar from `HeaderSearchInput.vue`
- Account/cart/theme actions from `HeaderActions.vue`
- Profile dropdown from `HeaderProfileDropdown.vue`
- Mobile menu from `HeaderBurger.vue`

#### Runtime header

- `app/components/runtime/RuntimeHeader.vue`
- Only shows:
  - logo or store name
  - runtime navigation items from `storefrontContext.navigation.header`
- Missing:
  - auth indicator
  - customer account dropdown
  - cart badge
  - cart entry point
  - search UI
  - locale switcher
  - theme toggle
  - mobile nav implementation beyond simple nav list rendering

### Navigation

#### Legacy navigation

- `HeaderLinks.vue` uses a hardcoded computed array:
  - `/`
  - `/products`
  - `#`
- This is not runtime-backed
- This does not match actual runtime shop/product routing

#### Runtime navigation

- Comes from backend runtime payloads
- Frontend reads `storefrontContext.navigation`
- Backend `resolveNavigationData()` builds:
  - `Home`
  - `Shop`
  - top-level category children
  - published marketing pages
  - a minimal footer about link

### Mobile menus

- Legacy mobile nav: `HeaderBurger.vue`
- Runtime shell: no equivalent mobile menu component found

### Footer

#### Legacy footer

- `app/components/footer/Footer.vue`
- Large static footer with hardcoded translation keys and fixed content groupings

#### Auth footer

- `app/components/footer/FooterAuth.vue`
- Minimal footer-only shell

#### Runtime footer

- `app/components/runtime/RuntimeFooter.vue`
- Only shows tenant name, optional tagline, and runtime footer nav

### Theme handling

There are two unrelated theme systems:

#### Legacy client theme

- `app/composables/useTheme.ts`
- `app/plugins/theme.client.ts`
- `app/app.vue`
- Uses `localStorage['theme']`
- Writes `data-theme` on `document.documentElement`
- Sets a theme-color meta tag in `app/app.vue`

#### Runtime tenant theme

- `app/pages/[...slug].vue`
- Uses backend theme payload tokens and branding
- Injects CSS variables and runtime `theme-color`
- Sets `html[dir]`, body font, favicon, and storefront token variables

These systems are not connected. Runtime theme is tenant content/theme driven. Legacy theme is local dark/light preference driven.

### Locale switching

- Legacy shell only: `app/components/topbar/TopbarLanguageSwitcher.vue`
- Runtime shell: no locale switcher UI found
- Runtime locale is still passed into runtime APIs, but users cannot switch locale from the runtime shell itself

### Auth indicators

- Legacy shell only:
  - login link in `HeaderActions.vue`
  - profile dropdown in `HeaderProfileDropdown.vue`
- Runtime shell has no auth awareness at all

### Cart indicators

- Legacy shell only:
  - cart badge in `HeaderActions.vue`
- Runtime shell has no cart indicator

### Duplicated and competing shell files

- `app/layouts/runtime-default.vue`, `app/layouts/catalog.vue`, `app/layouts/marketing.vue`, and `app/layouts/product.vue` are effectively duplicate wrappers around the same runtime header/footer shell
- `app/components/header/HeaderAuth.vue` exists but is not active in the auth layout
- `app/components/footer/Footer.vue`, `FooterAuth.vue`, and `app/components/runtime/RuntimeFooter.vue` are all separate footer systems

### Hydration inconsistencies and SSR/client mismatches

- `HeaderActions.vue` wraps account/cart/theme actions in `ClientOnly`, so header behavior changes after hydration
- `cart.vue` renders `CartSkeleton` until `isHydrated` becomes true, then mounts the real page inside `ClientOnly`
- `app/app.vue` injects a localStorage-driven theme script before hydration; runtime pages later override theme tokens and meta
- Public pages can render SSR without customer user data, then hydrate into a logged-in state after `01.auth.client.ts`

## 3. Authentication & Session Architecture

### Full auth flow

#### Login

- Page: `app/pages/login.vue`
- Composable: `app/composables/useAuth.ts::login()`
- Store: `app/stores/auth.ts`
- Nitro route: `server/api/auth/login.post.ts`
- Backend route family: `laratenant-backend/routes/api/v1/customer/account.php`

Flow:

1. `login.vue` calls `useAuth().login(form)`
2. `useAuth().login()` posts to `/api/auth/login`
3. Nitro forwards to external `auth/login`
4. On success, `authStore.setToken()` and `authStore.setUser()` run
5. `cartStore.onLogin()` merges guest cart into server cart
6. User is redirected to localized home

#### Register

- Page: `app/pages/register.vue`
- Composable: `useAuth().register()`
- Nitro route: `server/api/auth/register.post.ts`
- Redirects back to `/login?registered=true`

#### Logout

- Composable: `useAuth().logout()`
- Nitro route: `server/api/auth/logout.post.ts`
- Clears auth store
- Calls `useCartStore().onLogout()`
- Redirects to localized login page

#### Email verification

- Page: `app/pages/verify-email/[id]/[hash].vue`
- Nitro route: `server/api/auth/email/verify/[id]/[hash].get.ts`
- Page is standalone and not part of the auth layout or runtime shell

#### Verification email resend

- Handled inside login flow
- `useAuth().resendVerificationEmail()`
- Nitro route: `server/api/auth/email/resend.post.ts`

#### Password reset

- Backend/Nitro endpoint exists:
  - `server/api/auth/password/forgot.post.ts`
- Frontend page does not exist
- `login.vue` links to `/forgot-password`
- No `app/pages/forgot-password.vue` found
- No reset-password page found

Current state: password reset flow is route-linked but not actually implemented in the Nuxt pages layer.

#### Google/social auth

- Login page uses `window.location.href = /api/auth/google/redirect`
- Nitro redirect route: `server/api/auth/google/redirect.get.ts`
- Callback page: `app/pages/auth/google/callback.vue`
- Stub Nitro callback exists: `server/api/auth/google/callback.get.ts`, but it only returns `{ token }`

Current state:

- Social auth is page-driven, query-token based
- Callback handling is custom and separate from the rest of auth flow
- The Nitro callback handler is not a full integration; it is a stub

### Session persistence

- `app/stores/auth.ts` persists only `token`
- Persistence storage: `piniaPluginPersistedstate.cookies()`
- Cookie key: `auth`
- `user` is not persisted

This means:

- token survives reload
- user object does not
- user must be re-fetched

### Cookies

Explicitly observed in frontend code:

- `auth` cookie for persisted auth token
- `i18n_redirected` cookie for locale

### CSRF

No explicit CSRF token acquisition, storage, or header injection is present in the frontend code.

Observed auth behavior is bearer-token oriented:

- client `useStorefrontApi()` injects `Authorization: Bearer <token>` from `authStore.token`
- server `useServerApi()` parses the `auth` cookie and injects the same bearer token to backend calls

### SSR auth hydration

#### Public pages

- `app/plugins/01.auth.client.ts` runs only on the client
- If token exists, it calls `fetchUser()`
- Public legacy pages do not reliably know the user during SSR

#### Protected legacy pages

- `app/middleware/auth.ts` checks `isLoggedIn`
- If token exists but `user` is missing, it calls `fetchUser()`
- Since the request is to a local Nitro endpoint, SSR can still work for protected pages because `server/api/auth/me.get.ts` uses `useServerApi()` and reads the `auth` cookie server-side

#### Runtime pages

- Runtime catch-all path does not call `useAuth()`
- Runtime shell does not read `authStore`
- Runtime payloads do not include customer auth state

Answer: runtime pages cannot reliably know customer auth state during SSR because runtime rendering has no auth hydration path at all.

### Guest state

- Guest state is effectively:
  - no auth token
  - no user object
  - localStorage cart only

### Duplicated auth logic

- `01.auth.client.ts` fetches user after hydration
- `app/middleware/auth.ts` also fetches user when missing
- `useProfile().fetchProfile()` also overwrites auth store user
- Google callback path does custom token handling
- verify-email page bypasses auth composable entirely

### Middleware inconsistencies

- `guest.ts` only checks token presence, not whether user bootstrap finished
- `auth.ts` checks token, then conditionally fetches user
- Runtime pages have no auth middleware

### Redirect inconsistencies

- Login/logout use localized redirects
- Google callback uses localized `/`
- `verify-email` page uses `APP_ROUTES.login` and `APP_ROUTES.register` directly
- `login.vue` hardcodes `/forgot-password` instead of shared route constants

### Can runtime pages reliably know customer auth state during SSR?

No.

### Does cart survive login/logout?

- Login: guest cart is merged into authenticated cart, so login attempts to preserve cart
- Logout: cart is fully cleared via `useCartStore().onLogout()`

Answer: cart does not survive logout.

### Are there hydration flashes?

Yes.

- Customer identity on public pages arrives client-side
- Header auth/cart actions are client-only
- Cart page deliberately avoids SSR content and swaps after hydration

## 4. Cart System Audit

### Cart architecture

- Primary store: `app/stores/cart.ts`
- Thin wrapper composable: `app/composables/useCart.ts`
- Cart UI pages/components:
  - `app/pages/cart.vue`
  - `app/components/ui/CartButton.vue`
  - `app/components/cart/*`

### Cart storage

#### Guest cart

- Storage: `localStorage`
- Key: `guest_cart`
- Managed inside `app/stores/cart.ts`

#### Authenticated cart

- Source: backend via Nitro `/api/cart`
- Server forwarding: `server/api/cart.get.ts`, `server/api/cart/items.post.ts`, `server/api/cart/items/[itemId].patch.ts`, `server/api/cart/items/[itemId].delete.ts`, `server/api/cart/clear.delete.ts`

### Guest cart handling

- Server never owns guest cart state
- Store loads/saves guest cart directly from `localStorage`
- Guest cart is unavailable to SSR

### Authenticated cart handling

- `fetchCart()` uses `/api/cart`
- `addItem()`, `updateItem()`, `removeItem()`, `clear()` call REST cart endpoints
- On login, guest cart is merged item-by-item into server cart

### SSR compatibility

Cart is not SSR-complete.

- `02.cart.client.ts` initializes cart only on the client
- `cart.vue` hides the real cart behind `ClientOnly`
- Guest cart path cannot SSR because it depends on `localStorage`
- Header cart badge is also client-only

### Optimistic updates

- Server cart: no true optimistic UI, only loading flags
- Guest cart: immediate local mutation
- No reconciliation layer exists if server and guest disagree

### Mini-cart behavior

- No mini-cart drawer or shared mini-cart system was found
- Current cart indicator is only a badge in `HeaderActions.vue`

### Cart synchronization

Observed sync points:

- app startup: `02.cart.client.ts` -> `fetchCart()`
- after login: `useAuth().login()` -> `cartStore.onLogin()`
- after Google callback: `handleGoogleCallback()` -> `cartStore.onLogin()`
- after reorder: order pages call `cartStore.fetchCart()`
- after checkout success: `clearCartAfterCheckout()` calls `cartStore.onLogout()`

### Cart API endpoints in use

- `/api/cart`
- `/api/cart/items`
- `/api/cart/items/:itemId`
- `/api/cart/clear`

### Hydration issues

- `cart.vue` is intentionally hydration-deferred
- Header cart badge appears only after client mount
- Guest cart cannot exist during SSR

### Race conditions and stale state risks

- Guest-to-server merge is sequential and item-level failures are swallowed with `console.warn` in `cart.ts`
- `mergeGuestCartToServer()` clears the entire guest cart after the loop even if some item merges failed
- `user` is not persisted, so auth/cart coupling depends on startup rebootstrap
- `initialized` only exists client-side and resets on logout

### Tenant isolation concerns

- Guest cart key is global: `guest_cart`
- No tenant slug or domain is included in the localStorage key
- Logging out on one tenant clears guest cart globally for the browser

### Is cart globally reliable?

No.

It is serviceable inside the legacy flows, but it is not globally reliable across SSR, tenant boundaries, or the runtime shell.

### Do runtime and legacy share the same cart source of truth?

Partially.

- Runtime product grids reuse legacy `ProductGrid` -> `ProductCard` -> `UiCartButton`, so those runtime sections use the same Pinia cart store
- Runtime product detail does not. The registered runtime product page uses `RuntimeProductSummarySection.vue`, which has no add-to-cart logic
- Runtime shell header has no cart awareness

Answer: they do not share a complete cart source of truth at the storefront-shell level.

### Are there duplicated cart implementations?

There is one main store, but there are two materially different execution paths inside it:

- authenticated backend cart
- guest localStorage cart

There is also an abandoned richer product-detail cart experience in `src/core/rendering/sections/ProductDetailSection.vue` that is not registered in `src/core/rendering/registry.ts`.

## 5. Search System Audit

### Current search routes

- Search page: `app/pages/search.vue` -> `/search`
- Header autocomplete: `app/components/header/HeaderSearchInput.vue`
- Unused REST proxy route: `server/api/search.get.ts`

### APIs and GraphQL usage

#### Actual frontend search path in use

- Direct Apollo client from `app/plugins/apollo.client.ts`
- GraphQL endpoint from `runtimeConfig.public.graphqlUrl`
- Search query: `app/graphql/queries/search.ts::SEARCH_QUERY`
- Autocomplete query: `app/graphql/queries/search.ts::AUTOCOMPLETE_QUERY`

#### REST path that exists but is not used by storefront UI

- `/api/search` -> `server/api/search.get.ts`

### Search composables

No dedicated search composable was found.

Search logic is split between:

- `app/pages/search.vue`
- `app/components/header/HeaderSearchInput.vue`
- `app/components/search/SearchDropdown.vue`

### Filters and sorting

Current search has:

- text query
- locale
- limit

It does not have:

- server-backed facets
- sorting
- pagination
- SSR prefetch
- runtime-aware filters

### Indexing assumptions

The frontend assumes backend GraphQL resolvers `search` and `autocomplete` exist and are reachable at the public GraphQL URL. The frontend does not add storefront runtime headers, tenant headers, or auth headers to Apollo requests.

### Runtime integration gaps

- Runtime shell has no search UI
- Runtime pages do not consume `/api/search`
- Search page is not part of the runtime route/payload model
- Search results route into legacy-style product URLs

### SSR limitations

- `search.vue` fetches on `onMounted()`
- `HeaderSearchInput.vue` only queries on client input
- Both Apollo calls use `fetchPolicy: 'no-cache'`

Search is client-only in practice.

### SEO issues

- Search results content is absent during SSR
- `search.vue` only sets page title
- No canonical, description, robots, or structured data logic was found for search

### UX inconsistencies

- Search lives only in the legacy shell
- Runtime pages lose search entirely
- Search result product links go to `/products/product/:slug`
- Runtime product cards go to `/products/:slug`

### Is search runtime-aware?

No.

### Is search isolated from the runtime architecture?

Yes.

## 6. Navigation Consistency Audit

### Category navigation

- Runtime category navigation comes from backend runtime payloads
- Legacy category navigation and breadcrumbs are hardcoded to `/products` and `/products/category/:slug`

### Breadcrumbs

Legacy breadcrumb components:

- `app/components/layout/CategoryHeader.vue`
- `app/components/product/ProductBreadcrumb.vue`
- `app/components/cart/CartBreadcrumb.vue`
- `app/components/orders/OrdersBreadcrumb.vue`
- `app/components/orders/OrdersOrderBreadcrumb.vue`

Problems:

- Category and product breadcrumbs still use `/products` as the shop root
- Runtime shop root is `/shop`

### Mobile navigation

- Legacy mobile nav: `app/components/header/HeaderBurger.vue`
- Runtime shell: no dedicated mobile nav implementation found

### Account navigation

- Only exists in legacy shell via `HeaderProfileDropdown.vue`
- Runtime shell has none

### Merchant/store switching

No storefront UI for merchant/store switching was found in `app/`.

### Locale-aware navigation

- Legacy shell uses `NuxtLinkLocale` and `localePath()`
- Runtime shell uses plain `NuxtLink`, relying on backend runtime payloads to already contain localized paths
- Runtime shell still lacks a locale switcher control

### Inconsistent route systems and hardcoded URLs

#### Runtime route truth

- Product detail: `/products/:slug`
- Shop landing: `/shop`

#### Legacy route truth still embedded in components

- Product detail: `/products/product/:slug`
- Shop landing: `/products`

Observed in:

- `shared/utils/routes.ts`
- `app/components/search/SearchProductCard.vue`
- `app/components/header/HeaderSearchInput.vue`
- `app/components/cart/CartPageItem.vue`
- `app/components/order/OrderItem.vue`
- `app/components/layout/CategoryHeader.vue`
- `app/components/product/ProductBreadcrumb.vue`
- `app/components/header/HeaderLinks.vue`

### Runtime vs legacy routing conflicts

The routing split is explicit:

- Backend runtime redirects `/products` -> `/shop`
- Legacy header still links to `/products`
- Runtime product cards use `/products/:slug`
- Search/cart/orders components still use `/products/product/:slug`

This is not one route system with aliases. It is two route systems coexisting.

## 7. State Management Inventory

### Pinia stores

- `app/stores/auth.ts`
- `app/stores/cart.ts`

### Composables acting as stores or state owners

- `app/composables/useAuth.ts`
- `app/composables/useCart.ts`
- `app/composables/useTheme.ts`
- `app/composables/useProfile.ts`
- `app/composables/useOrders.ts`
- `app/composables/useCheckout.ts`
- `app/composables/useProductFilters.ts`
- `src/core/tenant/composables.ts` (`storefront_context`)

### Global `useState()` containers

- `theme` in `useTheme.ts`
- `auth_loading` in `useAuth.ts`
- `profile_loading` in `useProfile.ts`
- `productFilters` in `useProductFilters.ts`
- `filter-manufacture-preset` in `useProductFilters.ts`
- `filter-expiry-preset` in `useProductFilters.ts`
- `storefront_context` in `src/core/tenant/composables.ts`

### localStorage usage

- `guest_cart` in `app/stores/cart.ts`
- `theme` in `app/composables/useTheme.ts` and `app/app.vue`

### sessionStorage usage

- No `sessionStorage` usage found

### Cookie usage

- `auth` cookie via Pinia persisted state in `app/stores/auth.ts`
- `i18n_redirected` locale cookie via i18n config and server readers

### Ownership boundaries

#### Auth

- token: `auth` store
- user object: `auth` store, but populated by `useAuth`, `useProfile`, client plugin, and auth middleware

#### Cart

- all cart UI state: `cart` store
- guest persistence: localStorage
- server persistence: backend cart APIs

#### Runtime tenant/navigation/theme

- `storefront_context` state in `src/core/tenant/composables.ts`

#### Filters

- product filters in global `useState`, not scoped to an actual page component

### Duplicated state and overlapping responsibilities

- Auth user data is owned by `authStore.user`, but filled by multiple unrelated call sites
- Theme is split:
  - legacy `theme` state
  - runtime tenant theme payload
- Navigation is split:
  - legacy hardcoded header/footer links
  - runtime backend navigation payload
- Product routing assumptions are split across route constants and component-local strings

### SSR-safe vs client-only state

#### SSR-safe

- `storefront_context`
- auth token cookie availability server-side
- runtime route/page/navigation/theme fetches

#### Client-only

- guest cart
- dark/light theme preference
- header cart badge
- header profile dropdown interactions
- search/autocomplete data

### Anti-patterns

- Global localStorage keys are not tenant-scoped
- Runtime state and legacy commerce state are separate silos
- Product filter state survives outside any single page boundary
- Auth user hydration is distributed instead of centralized
- Runtime shell has no bridge to auth/cart state even though the app already has stores

## 8. API Integration Audit

### Storefront API layers present

#### Layer 1: frontend fetch wrapper

- `app/composables/useApi.ts`
- Thin alias over `src/core/api/client.ts::useStorefrontApi()`

#### Layer 2: shared fetch client

- `src/core/api/client.ts`
- Adds storefront headers
- Injects bearer auth only on client
- Shows toast errors on client unless suppressed

#### Layer 3: Nitro REST proxy

- Auth routes in `server/api/auth/**`
- Cart routes in `server/api/cart/**`
- Checkout routes in `server/api/checkout/**`
- Orders routes in `server/api/orders/**`
- Profile routes in `server/api/profile/**`
- Products routes in `server/api/products/**`
- Search route in `server/api/search.get.ts`

#### Layer 4: Nitro runtime proxy

- `server/api/storefront/runtime/**`
- Uses `useRuntimeServerApi()` instead of the normal `useServerApi()`

#### Layer 5: Direct GraphQL client

- `app/plugins/apollo.client.ts`
- Used directly by search page and autocomplete

### Auth injection

- Client: `useStorefrontApi()` reads `authStore.token`
- Server: `useServerApi()` reads the `auth` cookie and sets `Authorization`
- Apollo search client: no auth injection observed

### Tenant injection

- Runtime API fetches include storefront headers from `getStorefrontHeaders()`
- Standard Nitro proxy adds `X-Tenant-Id` from `event.context.tenantId`
- Runtime Nitro proxy preserves `Host` and runtime headers
- Apollo GraphQL path does not inject explicit tenant headers

### Inconsistent API clients

- REST via `useStorefrontApi()`
- Runtime via `useRuntimeServerApi()`
- GraphQL via Apollo client
- Direct browser redirect for Google auth

This is three different client models plus redirect-style auth.

### Duplicate HTTP layers

- Shared `useApi()` wrapper
- Runtime-specific `useRuntimeServerApi()`
- Standard `useServerApi()`
- Apollo client bypass

### Inconsistent error handling

- `useStorefrontApi()` normalizes errors and optionally shows toasts
- Apollo search just logs to console and nulls results
- Runtime low-level proxy throws `createError()`
- Google callback page uses local UI state and toasts
- Several pages swallow errors or redirect silently

### Missing runtime awareness

- Search bypasses runtime completely
- Legacy header navigation ignores runtime route canonical paths
- Runtime pages do not consume auth/cart awareness

### Mixed DTO/type standards

- Runtime contracts in `src/core/runtime/contracts/types.ts`
- REST response types in `types/*.ts`
- GraphQL types in `types/search.d.ts`
- DTO transforms in `src/core/api/dto/storefront.ts`
- Comments in several type files still describe assumptions or legacy endpoint names instead of current reality

### Route-contract drift

Observed stale or conflicting frontend route declarations:

- `shared/utils/routes.ts` declares `APP_ROUTES.products.detail = /products/product/:slug`
- Runtime backend resolves product pages at `/products/:slug`
- `shared/utils/routes.ts` declares `EXTERNAL_API_ROUTES.checkout.sessionAuth = checkout/session/auth`
- Backend storefront checkout routes in `laratenant-backend/routes/api/v1/storefront/checkout.php` expose store-scoped `/stores/{store}/checkout`, not `/checkout/session/auth`

The route-contract file is not a trustworthy single source of truth anymore.

## 9. UX Fragmentation Report

| Issue | Severity | Frequency | Architectural Root Cause |
| --- | --- | --- | --- |
| Runtime pages render a different shell with no auth/cart/search/locale/theme controls | Critical | Always on runtime pages | Separate runtime shell components and no bridge into legacy commerce shell |
| Shop/product URLs conflict (`/shop`, `/products/:slug`, `/products/product/:slug`, `/products`) | Critical | Constant | Runtime route model and legacy route literals diverged |
| Search is only available in the legacy shell | High | Frequent | Search UI is tied to `Header.vue`, not the runtime shell |
| Cart badge disappears on runtime pages | High | Frequent | Runtime header does not consume cart store |
| Logged-in identity disappears on runtime pages | High | Frequent | Runtime header has no auth awareness |
| Cart page hard-switches from SSR skeleton to client-only content | High | Every cart visit | Guest cart and cart initialization are client-only |
| Search results, cart items, and order items still link to stale product URLs | High | Frequent | Multiple components hardcode `/products/product/:slug` |
| Auth pages have no normal storefront header | Medium | Every login/register visit | Separate auth shell with commented-out `HeaderAuth` |
| Profile and orders pages rely on mount-time data loading instead of SSR data ownership | Medium | Every profile/orders visit | Legacy commerce pages remain client-driven |
| Theme behavior changes across runtime and legacy pages | Medium | Frequent | Local dark/light theme and runtime tenant theme are separate systems |
| Search results are invisible to SSR and SEO | Medium | Every search visit | Apollo-only client fetch with `onMounted()` |
| Shell resets when moving between runtime pages and legacy commerce pages | Medium | Frequent | Competing layout families and inconsistent route ownership |

## 10. SSR & Hydration Audit

### Runtime vs client divergence

#### Runtime pages

- `app/pages/[...slug].vue` SSRs runtime content
- Runtime fetch path is SSR-capable
- Runtime shell still has no SSR customer commerce state

#### Legacy commerce pages

- `cart.vue` is hydration-gated and client-only for real content
- `search.vue` is client-only for results
- `profile.vue`, `orders/index.vue`, `orders/[orderNumber].vue`, `checkout/success.vue`, `verify-email/[id]/[hash].vue`, and `auth/google/callback.vue` all rely on `onMounted()`

### Auth hydration issues

- Public pages can render without user data then hydrate into logged-in state via `01.auth.client.ts`
- Protected pages may fetch user both in middleware and later through profile flow
- Runtime pages never hydrate auth into the shell

### Cart hydration issues

- `02.cart.client.ts` initializes cart after mount
- `HeaderActions.vue` cart badge is inside `ClientOnly`
- `cart.vue` hides page body until hydration

### Duplicated fetches

- `01.auth.client.ts` may fetch `/api/auth/me` after hydration
- `app/middleware/auth.ts` may also fetch `/api/auth/me`
- Runtime page load performs one resolve request plus three payload requests
- Orders reorder flows call `cartStore.fetchCart()` after reorder

### Layout flickering

- `app/app.vue` sets global theme and meta before hydration
- Runtime catch-all later injects tenant theme variables and head tags
- Moving between runtime and legacy pages changes header/footer families entirely

### Components/composables involved

- `app/pages/[...slug].vue`
- `src/core/runtime/router/useRouteResolver.ts`
- `src/core/runtime/router/useStorefrontPayload.ts`
- `app/plugins/01.auth.client.ts`
- `app/plugins/02.cart.client.ts`
- `app/components/header/HeaderActions.vue`
- `app/pages/cart.vue`
- `app/pages/search.vue`
- `app/app.vue`
- `app/composables/useTheme.ts`

## 11. Tenant Isolation Review

### Tenant propagation that exists

- SSR tenant bootstrap: `server/middleware/01.tenant.ts`
- Runtime client headers: `src/core/api/headers.ts`
- Standard server proxy tenant header: `server/utils/api.ts::useServerApi()`
- Runtime host-preserving proxy: `server/utils/api.ts::useRuntimeServerApi()`
- Runtime cache keys include tenant + locale + route + preview state: `src/core/cache/createTenantCacheKey.ts`

### Runtime cache isolation

Good on the frontend side:

- `createTenantCacheKey()` namespaces by tenant slug/id, locale, route, runtime version, artifact, preview state

### Auth isolation risks

- Auth persistence cookie key is global: `auth`
- No tenant-specific keying is applied in `app/stores/auth.ts`
- Server proxy reads `auth` cookie globally in `server/utils/api.ts`

### Cart isolation risks

- Guest cart localStorage key is global: `guest_cart`
- No tenant slug or host scoping

### Locale isolation risks

- Locale cookie key is global: `i18n_redirected`
- No tenant-specific scoping

### Search isolation risks

- Apollo search requests do not inject storefront tenant headers
- Search isolation depends on deployment host/backend behavior, not on explicit frontend tenant propagation

### Runtime tenant resolution risk

`src/core/tenant/resolver.ts` will fabricate an active tenant object for arbitrary non-localhost hosts by using the first hostname segment as the slug. The file itself says runtime APIs are the authority for actual tenant validity, but the frontend still treats unknown hosts as active before backend validation.

That means:

- the frontend shell context is optimistic, not authoritative
- invalid tenant hosts are not rejected at the frontend middleware layer unless `resolveTenant()` returns `null`

### Possible cross-tenant leakage risks

- guest cart leakage across tenants in one browser session
- auth token reuse across tenants if the backend accepts the same token and the browser keeps the same `auth` cookie
- locale preference bleeding across tenants
- theme preference bleeding across tenants

## 12. Performance & Runtime Analysis

### Duplicate or excessive API calls

- Runtime page request flow is at least four network calls:
  - resolve
  - page
  - navigation
  - theme
- Search page uses `no-cache` Apollo queries every time
- Header autocomplete uses `no-cache` Apollo queries for each debounced term
- Public startup may fetch `/api/auth/me` and `/api/cart` on every client boot

### Unnecessary hydration / client fetching

- Cart page cannot SSR actual content
- Search page does not SSR results
- Profile/orders pages fetch after mount instead of using page-level async data
- Checkout success page waits for mount, then fetches status, then may retry after 2 seconds

### Runtime waterfalls

- Runtime resolve and payload fetches are split into separate endpoints
- Navigation and theme are reloaded per runtime page instead of being clearly promoted to app-shell state

### Oversized / repeated layout work

- Runtime layouts are duplicated wrappers
- Legacy and runtime shells both mount distinct header/footer systems
- Moving between legacy and runtime routes forces a full shell swap

### Repeated navigation loads

- Runtime navigation payload is requested on every runtime page fetch path via `useStorefrontPayload()`

### Other frontend bottlenecks

- `mergeGuestCartToServer()` posts each guest item sequentially
- `server/middleware/log.ts` logs every request to the console
- Header search autocomplete has no shared cache layer

### Biggest frontend bottlenecks right now

- route/shell split causing duplicate state and fetch behavior
- client-only search and cart behavior
- runtime page waterfall design
- unscoped local persistence creating stale cross-tenant state

## 13. Technical Debt Inventory

### Safe to remove or consolidate with high confidence

These have no observed runtime consumer in the repo:

- `app/composables/useCachedData.ts`
- `app/config/cache.ts::CACHE_KEYS`
- `server/api/search.get.ts` as an active storefront search path
- `server/api/auth/google/callback.get.ts` as a real callback integration
- `app/components/header/HeaderAuth.vue` in the active auth shell
- `app/composables/useProductByCategory.ts`

### Risky to remove

- `app/components/product/ProductGrid.vue`
- `app/components/product/ProductCard.vue`
- `app/components/ui/CartButton.vue`
- `app/stores/cart.ts`
- `app/stores/auth.ts`
- `app/composables/useOrders.ts`
- `app/composables/useCheckout.ts`

These are legacy-owned, but runtime pages already reuse some of them indirectly.

### Unknown ownership / stale migration remnants

- `src/core/rendering/sections/ProductDetailSection.vue`
  - rich commerce product detail implementation exists
  - not registered in `src/core/rendering/registry.ts`
  - backend runtime product payload does not use it
- `server/api/best_seller.get.ts`
- `server/api/hero.get.ts`
- `app/composables/useProduct.ts`
- `app/composables/useProductFilters.ts`

These still represent a legacy catalog stack even though no `app/pages/products/**` pages exist.

### Duplicated layouts

- `app/layouts/runtime-default.vue`
- `app/layouts/catalog.vue`
- `app/layouts/marketing.vue`
- `app/layouts/product.vue`

Current duplication is mostly wrapper-level and not behavior-level.

### Legacy compatibility hacks / drift

- `server/middleware/01.tenant.ts` legacy passthrough prefix list
- `StorefrontRuntimeService::resolveRedirect()` redirecting `/products` -> `/shop`
- `shared/utils/routes.ts` still carrying legacy product detail route shape
- search/cart/order components hardcoding stale product URLs

## 14. Final Assessment

### Current maturity level

- Hybrid storefront
- Transitional architecture
- Runtime rendering complete enough for content and browse pages
- Commerce experience incomplete
- Shell consolidation not complete
- Route consolidation not complete

### Top 10 architectural problems

1. Two competing route systems are live at the same time
2. Runtime shell and legacy commerce shell are separate systems
3. Runtime rendering is not auth-aware
4. Runtime rendering is not cart-aware at the shell level
5. Search is completely outside the runtime architecture
6. Client persistence is not tenant-scoped
7. Route constants are no longer a trustworthy source of truth
8. Product detail runtime payload is commerce-light while legacy commerce components remain stranded
9. Auth/user bootstrap is distributed across plugin, middleware, and feature composables
10. API integration is fragmented across REST proxy, runtime proxy, Apollo GraphQL, and browser redirects

### Top 10 UX problems

1. The shell visibly changes between runtime and legacy pages
2. Runtime pages lose search
3. Runtime pages lose cart visibility
4. Runtime pages lose account visibility
5. Shop and product URLs are inconsistent depending on where the user clicks
6. Cart page does not feel SSR-native
7. Search results appear only after client fetch
8. Orders/profile pages are client-loaded instead of feeling integrated into the storefront runtime
9. Auth pages feel detached from the main storefront shell
10. Locale and theme affordances are inconsistent across page families

### Highest-risk systems

- Routing and route ownership
- Auth/session bootstrap
- Cart persistence and guest merge behavior
- Search integration
- Tenant-scoped client persistence
- Application shell continuity

### Recommended next program areas

Only categories, not plans:

- Routing consolidation
- Application shell consolidation
- Auth/session SSR alignment
- Cart source-of-truth consolidation
- Search architecture consolidation
- Runtime commerce capability parity
- Tenant-aware client persistence
- API client and contract normalization
- Legacy storefront surface retirement audit
