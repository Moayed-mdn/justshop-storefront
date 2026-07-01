# Playwright Testing Context - Complete Memory File

**Last Updated**: 2026-06-04 (audit-corrected and updated)
**Session**: Kiro audit — accurate state from disk verified
**Status**: Phases 1–4 Complete ✅ | **331 tests across 13 files** | Active work session in progress

This file contains EVERYTHING the next session needs to know to continue Playwright testing work.
All counts and statuses in this file are verified from disk, not from prior session claims.

---

## 📋 TABLE OF CONTENTS

1. [Project Summary](#project-summary)
2. [Tech Stack Details](#tech-stack-details)
3. [All Files on Disk](#all-files-on-disk)
4. [Codebase Investigation Findings](#codebase-investigation-findings)
5. [What Has Been Completed](#what-has-been-completed)
6. [What Still Needs to Be Done](#what-still-needs-to-be-done)
7. [Tests Directory Structure (Accurate)](#tests-directory-structure-accurate)
8. [Known Issues & Fixes Needed](#known-issues--fixes-needed)
9. [Important Decisions Made](#important-decisions-made)
10. [Quick Reference Commands](#quick-reference-commands)

---

## 📋 PROJECT SUMMARY

### What This Storefront Does

**JustShop Frontend** is a **multi-tenant e-commerce storefront** built with Nuxt 4 that serves as the customer-facing application for a Laravel-based e-commerce platform.

**Key Features**:
- 🛒 Complete shopping experience (browse products, add to cart, checkout, manage orders)
- 🌍 Multi-language support (English default, Arabic with RTL)
- 👤 User authentication (session-based with Laravel backend)
- 🛍️ Dual cart system (guest localStorage + authenticated server-synced)
- 💳 Stripe-powered checkout
- 🔍 GraphQL-powered search via Apollo Client
- 📄 Dynamic CMS pages via Storefront Runtime system
- 🔐 Google OAuth integration
- 🏢 Multi-tenant architecture (requires X-Tenant-Id header on all requests)
- 🎨 Theme support (light/dark mode)

**Target Users**: End customers shopping on the e-commerce platform

**Backend**: Laravel API (not in this repo)

---

## 🔧 TECH STACK DETAILS

### Core Framework
- **Nuxt 4** (`compatibilityVersion: 4`)
- **Vue 3.5.24**
- **TypeScript** (strict mode throughout)
- **Node.js 18+**

### Styling & UI
- **Tailwind CSS 4.2.1** via `@tailwindcss/vite`
- **@nuxt/ui 4.5.1** component library (used throughout)
- **@nuxt/icon 2.2.1** with Heroicons
- Custom CSS variables for theming (`--color-*`, `--header-*`)

### Data Layer & API
- **REST API**: Nitro server routes (`server/api/**`) proxy to Laravel backend
- **GraphQL**: Apollo Client 4.1.6 for search ONLY (not used for main data)
- **ofetch**: Underlying fetch wrapper for API calls

### State Management
- **Pinia 3.0.4** for state management
- **pinia-plugin-persistedstate**: Cookie-based persistence for auth and cart
- **Stores**:
  - `app/stores/auth.ts` - Authentication state
  - `app/stores/cart.ts` - Shopping cart state

### Internationalization
- **@nuxtjs/i18n 10.2.1**
- **Strategy**: `prefix_except_default`
- **Locales**:
  - English (default, no prefix in URL)
  - Arabic (`/ar` prefix, RTL layout)
- **Cookie**: `i18n_redirected` stores user's locale preference

### Testing Tools
- **Playwright 1.60.0** - E2E testing (installed and configured)
- **Vitest 3.2.6** - Unit testing (installed but not configured)

### Build & Dev Tools
- **Vite** (via Nuxt 4)
- **TypeScript strict mode**
- **ESLint** (project standard)

---

## 📁 ALL FILES ON DISK

### Root Files

| File | Size | Purpose |
|------|------|---------|
| `playwright.config.ts` | 3,450 bytes | Playwright configuration (8 browser projects) |
| `PLAYWRIGHT.md` | 58,079 bytes | Comprehensive E2E testing guide |
| `.playwrightrules` | 36,578 bytes | Project-specific Playwright rules |
| `PLAYWRIGHT_CONTEXT.md` | This file | Session memory / audit state |
| `PLAYWRIGHT_CHECKLIST.md` | 10,333 bytes | Implementation tracking checklist |
| `PLAYWRIGHT_FINAL_REVIEW.md` | 19,441 bytes | Final review report (Jun 4 session) |
| `PLAYWRIGHT_SETUP_SUMMARY.md` | ~477 lines | Setup summary |
| `PLAYWRIGHT_BASE_INFRASTRUCTURE.md` | ~474 lines | Base infrastructure docs |

### playwright.config.ts Key Configuration
- Test directory: `./tests/e2e`
- Base URL: `http://localhost:3000`
- 8 browser projects: Desktop Chromium/Firefox/WebKit, Mobile Pixel5/iPhone13, Tablet iPad Pro, Arabic RTL Desktop + Mobile
- `X-Tenant-Id` header set globally on ALL requests
- webServer: `npm run dev` on port 3000
- Screenshots/videos/traces on failure
- CI/CD ready (retries, GitHub Actions reporter)

### tests/pages/ — Page Object Models

| File | Class | Extends BasePage? | Status |
|------|-------|-------------------|--------|
| `BasePage.ts` | `BasePage` | N/A (IS BasePage) | ✅ |
| `LoginPage.ts` | `LoginPage` | ✅ Yes | ✅ |
| `RegisterPage.ts` | `RegisterPage` | ✅ Yes | ✅ |
| `ProductPage.ts` | `ProductPage` | ✅ Yes | ✅ |
| `ProductListingPage.ts` | `ProductListingPage` | ✅ Yes | ✅ |
| `CartPage.ts` | `CartPage` | ✅ Yes | ✅ |
| `CheckoutPage.ts` | `CheckoutPage` | ✅ Yes | ✅ |
| `OrdersPage.ts` | `OrdersPage` | ✅ Yes | ✅ |
| `index.ts` | exports | Exports multiple classes | ✅ |

#### BasePage.ts (40+ methods)
Key methods:
- **Navigation**: `goto()`, `goHome()`, `goToCart()`, `goToLogin()`, `search()`, `openMobileMenu()`, `closeMobileMenu()`
- **State Checking**: `isAuthenticated()`, `getCartCount()`, `getCurrentLocale()`, `getCurrentTheme()`, `isRTL()`, `isMobileMenuOpen()`
- **Interactions**: `toggleTheme()`, `switchLocale()`, `dismissNotification()`
- **Waiting**: `waitForPageLoad()`, `waitForNotification()`, `waitForCartUpdate()`
- **Assertions**: `assertPageLoaded()`, `assertAuthenticated()`, `assertNotAuthenticated()`, `assertNotificationShown()`, `assertCartCount()`, `assertLocale()`, `assertTheme()`, `assertRTL()`, `assertURL()`, `assertTitle()`
- **Utilities**: `screenshot()`, `reload()`, `getCurrentURL()`, `elementExists()`, `fillByLabel()`, `clickButtonByText()`, `clickLinkByText()`

### tests/helpers/ — Helper Functions

| File | Exported Functions |
|------|--------------------|
| `auth.ts` | `AUTH_COOKIES`, `loginViaUI`, `loginViaAPI`, `registerViaAPI`, `logoutViaUI`, `logoutViaAPI`, `getAuthState`, `waitForAuthentication`, `assertAuthenticated`, `assertNotAuthenticated`, `createTestUser`, `deleteTestUser` |
| `cart.ts` | `getGuestCartKey`, `addToCartViaUI`, `addToCartViaAPI`, `updateCartItemViaAPI`, `removeCartItemViaAPI`, `clearCartViaAPI`, `getCartViaAPI`, `getGuestCart`, `setGuestCart`, `clearGuestCart`, `waitForCartUpdate`, `assertCartItemCount`, `assertCartContainsProduct`, `assertCartEmpty`, `goToCart`, `goToCheckout`, `openCartDrawer`, `closeCartDrawer` |
| `search.ts` | `searchViaHeader`, `goToSearchResults`, `getAutocompleteSuggestions`, `selectAutocompleteSuggestion`, `selectAutocompleteSuggestionByText`, `clearSearch`, `applySearchFilters`, `clearSearchFilters`, `getSearchResultsCount`, `getSearchResults`, `sortSearchResults`, `changeResultsView`, `clickSearchResult`, `waitForSearchComplete`, `assertSearchHasResults`, `assertSearchNoResults`, `assertAutocompleteVisible`, `assertAutocompleteHasSuggestions`, `assertResultsContainQuery` |
| `orders.ts` | `goToOrdersList`, `goToOrderDetail`, `goToGuestOrderTracking`, `trackGuestOrder`, `getOrdersList`, `getOrderStatus`, `getOrderTotal`, `getOrderItemsCount`, `getOrderItems`, `clickOrder`, `cancelOrder`, `reorder`, `downloadInvoice`, `filterOrdersByStatus`, `searchOrders`, `sortOrders`, `loadMoreOrders`, `goToNextOrdersPage`, `goToPreviousOrdersPage`, `getShippingAddress`, `getBillingAddress`, `getPaymentMethod`, `waitForStatusUpdate`, `assertHasOrders`, `assertNoOrders`, `assertOrderStatus`, `assertOrderContainsItem`, `assertOrderTotal`, `assertCanCancel`, `assertCannotCancel` |
| `profile.ts` | `goToProfile`, `goToEditProfile`, `getProfileData`, `updateProfile`, `uploadAvatar`, `removeAvatar`, `changePassword`, `deleteAccount`, `getAvatarUrl`, `isEmailVerified`, `resendEmailVerification`, `goToOrdersFromProfile`, `goToAddressesFromProfile`, `logoutFromProfile`, `waitForProfileUpdateSuccess`, `waitForPasswordChangeSuccess`, `assertProfilePageLoaded`, `assertProfileData`, `assertProfileUpdated`, `assertProfileUpdateFailed`, `assertAvatarDisplayed`, `assertPasswordChanged`, `assertPasswordChangeFailed`, `assertEmailVerified`, `assertEmailNotVerified` |
| `mocks.ts` | `mockAuthAPI`, `mockCartAPI`, `mockOrdersAPI`, `mockOrderDetailAPI`, `mockProfileAPI`, `basicProduct`, `productWithVariants`, `saleProduct`, `outOfStockProduct`, `lowStockProduct`, `detailedProduct`, `testProducts` |
| `types.ts` | Type definitions: `AuthState`, `User`, `CartState`, `CartItem`, `Product`, `ProductVariant`, `Order`, `OrderItem`, `OrderStatus`, `Address`, `APIError`, `TestUser`, `TestProduct` |
| `index.ts` | Re-exports all of the above |

### tests/fixtures/

| File | Contents |
|------|----------|
| `products.ts` | `basicProduct`, `productWithVariants`, `saleProduct`, `outOfStockProduct`, `lowStockProduct`, `detailedProduct`, `testProducts`, `getProductById()`, `getProductBySlug()`, `getInStockProducts()`, `getSaleProducts()` |
| `users.ts` | `testUserCredentials` (from env), `adminUserCredentials`, `guestUser`, `mockAuthenticatedUser`, `unverifiedUser`, `newUserRegistration`, `invalidRegistrations`, `generateTestUser()`, `generateTestUsers(count)` |
| `index.ts` | Re-exports above + context setup: `setupAuthenticatedContext()`, `setupGuestCart()`, `setupTheme()`, `setupLocale()`, `clearTestState()`, `setupTestEnvironment()` |

### tests/e2e/ — Spec Files (VERIFIED COUNTS FROM DISK)

| File | Tests on Disk | Feature Area |
|------|--------------|--------------|
| `example.spec.ts` | 9 | Smoke / environment |
| `auth/login.spec.ts` | 12 | Authentication |
| `auth/register.spec.ts` | 17 | Authentication |
| `auth/logout.spec.ts` | 14 | Authentication |
| `cart/guest-cart.spec.ts` | 13 | Cart |
| `cart/authenticated-cart.spec.ts` | 19 | Cart |
| `cart/cart-ui.spec.ts` | 26 | Cart |
| `checkout/checkout.spec.ts` | 32 | Checkout |
| `products/product-listing.spec.ts` | 35 | Products |
| `products/product-detail.spec.ts` | 48 | Products |
| `search/search.spec.ts` | 43 | Search |
| `i18n/language-switching.spec.ts` | 28 | i18n |
| `i18n/rtl-layout.spec.ts` | 35 | i18n |
| **TOTAL** | **331** | |

### tests/ Root Support Files

| File | Purpose |
|------|---------|
| `.env.test` | ✅ Exists and configured (not committed) |
| `.env.test.example` | Template for env vars |
| `global-setup.ts.example` | Template — NOT yet renamed/implemented |
| `global-teardown.ts.example` | Template — NOT yet renamed/implemented |
| `README.md` | Tests directory documentation |
| `QUICK_START.md` | Quick start guide |

---

## 🔍 CODEBASE INVESTIGATION FINDINGS

### Auth Mechanism (VERIFIED IN CODE)

**Files Investigated**:
- `app/stores/auth.ts` - Auth store with Pinia
- `app/plugins/01.auth.client.ts` - Auth plugin (client-only)
- `server/api/auth/**` - Server API routes

**How Auth Works**:
1. **Session-based authentication** (NOT JWT)
2. **Backend**: Laravel API sets session cookies on login
3. **Frontend**: Pinia store persists auth state to cookies

**Cookies Used** (CRITICAL):
- `ecommerce_session` - Backend session (HttpOnly)
- `XSRF-TOKEN` - CSRF protection token
- `js_auth` - Persisted Pinia auth state (client-accessible)

**Auth Flow**:
1. User submits login → POST `/api/auth/login`
2. Backend validates → Sets `ecommerce_session` + `XSRF-TOKEN`
3. Frontend receives user data → Stores in Pinia → Persists to `js_auth` cookie
4. Subsequent requests include all 3 cookies
5. `app/plugins/01.auth.client.ts` restores auth state on page load from `js_auth` cookie

**Error Codes Found**:
- `AUTH_002` - Unverified email (triggers email verification notice in login.vue)

**Important**: Tests must handle session cookies correctly — use `setupAuthenticatedContext()` fixture helper.

### Cart Implementation (VERIFIED IN CODE)

**Files Investigated**:
- `app/stores/cart.ts` - Cart store with Pinia
- `app/plugins/02.cart.client.ts` - Cart plugin (client-only)
- `server/api/cart/**` - Server API routes

**Dual Cart System**:

**1. Guest Cart (Unauthenticated)**:
- Stored in **localStorage**
- Key format: `js_cart_{tenantId}` (e.g., `js_cart_demo`)
- Structure: Array of cart items
- Managed by: `app/stores/cart.ts` + `app/plugins/02.cart.client.ts`

**2. Authenticated Cart**:
- Stored on **backend server**
- Accessed via: GET `/api/cart`
- Modified via: POST/PUT/DELETE `/api/cart/items`
- Synced automatically when user logs in

**Cart Merge on Login**: Guest items sent to backend → merged → localStorage cleared.

**Important**: Always use `getGuestCartKey()` helper — key is tenant-specific.

### API Patterns (VERIFIED IN CODE)

**Architecture**: Nitro server routes proxy to Laravel backend. Client calls `/api/*` → Nitro → Laravel.

**Multi-Tenant Header** (CRITICAL): ALL requests must include `X-Tenant-Id: {tenant}`.
- Set globally in `playwright.config.ts` via `extraHTTPHeaders`
- Default test tenant: `demo`

**Routes** (from `shared/utils/routes.ts`):
- Auth: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`
- Cart: `/api/cart`, `/api/cart/items`, `/api/cart/items/{id}`
- Products: `/api/products`, `/api/products/{id}`
- Orders: `/api/orders`, `/api/orders/{id}`
- Profile: `/api/profile`, `/api/profile/avatar`
- Search: GraphQL via Apollo Client

### Component Patterns (VERIFIED IN CODE)

**Shell Structure**:
- `StorefrontShell.vue` — `data-storefront-shell="root"`
- `StorefrontShellHeader.vue` — `data-storefront-shell="header"`

**Header Components**:
- `HeaderActions.vue` — cart-button, cart-badge (data-testid added)
- `HeaderSearchInput.vue` — `input[type="search"]`
- Burger menu: `#burger-menu-trigger`, `aria-controls="header-mobile-nav"`

**Theme System**:
- localStorage key: `theme`
- Attribute: `document.documentElement.setAttribute('data-theme', 'light|dark')`

**i18n System**:
- Cookie: `i18n_redirected`
- HTML attrs: `<html lang="en|ar" dir="ltr|rtl">`
- URL: no prefix for English, `/ar` for Arabic

### Storefront Routes (Canonical)

```
/                              Home
/shop                          Product listing
/shop/category/{slug}          Category listing
/shop/product/{slug}           Product detail  ← NOTE: /shop/product/ (singular)
/search                        Search results
/cart                          Cart
/login                         Login
/register                      Register
/profile                       Profile (auth required)
/orders                        Orders list (auth required)
/orders/{orderNumber}          Order detail (auth required)
/orders/track                  Guest order tracking
/checkout/success              Checkout success
/checkout/cancel               Checkout cancel
/ar/{any above}                Arabic prefix for all routes
```

### Store Shapes (VERIFIED)

```typescript
// app/stores/auth.ts
interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
}

// app/stores/cart.ts
interface CartState {
  items: CartItem[]
  itemCount: number
  subtotal: string
  isLoading: boolean
}
```

---

## ✅ WHAT HAS BEEN COMPLETED

### Phase 1: Infrastructure Setup ✅ COMPLETE

- [x] `playwright.config.ts` — 8 browser projects, multi-tenant header, webServer config
- [x] All documentation files (PLAYWRIGHT.md, .playwrightrules, PLAYWRIGHT_SETUP_SUMMARY.md, etc.)
- [x] `tests/pages/BasePage.ts` — 40+ methods
- [x] `tests/pages/LoginPage.ts` extends BasePage
- [x] `tests/pages/ProductPage.ts` extends BasePage
- [x] All helper modules (auth, cart, search, orders, profile, types, index)
- [x] All fixture modules (products, users, index with setup utilities)
- [x] Directory structure: tests/e2e/{auth,cart,checkout,products,search,orders,profile,storefront,i18n}
- [x] Template files (.env.test.example, global-setup/teardown.example)
- [x] 8 npm scripts added to package.json

### Phase 2: Environment Setup ✅ COMPLETE

- [x] Playwright browsers installed (`npx playwright install`)
- [x] `tests/.env.test` exists and configured
- [x] Backend running on port 8000, frontend on port 3000
- [x] example.spec.ts — 9/9 tests passed (45.2s on Chromium)

### Phase 3: Add data-testid Attributes ✅ COMPLETE (106 attributes across 28 files)

**Auth components** (50 attributes):
- `app/pages/login.vue` (10), `app/pages/register.vue` (16), `app/pages/forgot-password.vue` (7), `app/pages/reset-password.vue` (8)
- `app/components/auth/AuthFormInput.vue` (3), `AuthSubmitButton.vue` (1), `AuthAlert.vue` (1), `AuthFooterLink.vue` (1), `AuthEmailVerificationNotice.vue` (2), `AuthGoogleButton.vue` (1)

**Cart components** (24 attributes):
- `app/components/header/HeaderActions.vue` (2: cart-button, cart-badge)
- `app/pages/cart.vue` (5), `CartPageItem.vue` (7), `CartItemsList.vue` (1), `CartSummary.vue` (3), `CartEmpty.vue` (1), `CartMobileCheckout.vue` (1), `CartHeader.vue` (2), `CartClearModal.vue` (2)

**Product components** (32 attributes):
- `ProductCard.vue` (5), `ProductHeader.vue`, `ProductPrice.vue` (2), `ProductQuantitySelector.vue` (4), `ProductVariantSelector.vue` (5), `ProductActionButtons.vue` (3), `ProductImageGallery.vue` (7), `ProductGrid.vue` (1), `ProductNoResults.vue` (2)

**⚠️ STILL MISSING** (identified in PLAYWRIGHT_FINAL_REVIEW.md — needs verification and addition):
- `data-testid="user-menu-trigger"` — header user/account menu
- `data-testid="logout-button"` — logout menu item
- `data-testid="profile-dropdown-trigger"` — profile dropdown in header
- `data-testid="confirm-remove"` — item remove confirmation (guest-cart.spec.ts)
- `data-testid="confirm-clear"` — cart clear confirmation (guest-cart.spec.ts)
- `data-testid="google-login-button"` — Google OAuth button (login.spec.ts)
- `data-testid="update-cart-button"` — cart quantity update button (guest-cart.spec.ts)

### Phase 4: Write Core Tests ✅ COMPLETE (298 tests across 12 files)

**Auth** (43 tests, 3 files):
- `auth/login.spec.ts` (12): login flow, i18n, CSRF security
- `auth/register.spec.ts` (17): registration, validation, edge cases
- `auth/logout.spec.ts` (14): logout flow, cookie cleanup, protected routes

**Cart** (58 tests, 3 files):
- `cart/guest-cart.spec.ts` (13): localStorage, multi-tenant, edge cases
- `cart/authenticated-cart.spec.ts` (19): CRUD, merge, sync, session
- `cart/cart-ui.spec.ts` (26): badge, navigation, empty state, checkout, clear

**Checkout** (32 tests, 1 file):
- `checkout/checkout.spec.ts` (32): checkout button, mobile checkout, success page, cancel page, full flow

**Products** (83 tests, 2 files):
- `products/product-listing.spec.ts` (35): listing, sort, pagination, responsive
- `products/product-detail.spec.ts` (48): detail, variants, add to cart, 404

**Search** (43 tests, 1 file):
- `search/search.spec.ts` (43): input, autocomplete, results, mobile, performance

**i18n** (63 tests, 2 files):
- `i18n/language-switching.spec.ts` (28): switching, persistence, URL prefix
- `i18n/rtl-layout.spec.ts` (35): RTL layout, header/cart/forms/products in Arabic

**Example** (9 tests, 1 file):
- `example.spec.ts` (9): smoke, multi-tenant header, env verification

**New Page Objects Created in Phase 4**:
- `tests/pages/RegisterPage.ts` extends BasePage ✅
- `tests/pages/ProductListingPage.ts` extends BasePage ✅
- `tests/pages/CartPage.ts` extends BasePage ✅
- `tests/pages/CheckoutPage.ts` extends BasePage ✅
- `tests/pages/OrdersPage.ts` extends BasePage ✅

---

## ❌ WHAT STILL NEEDS TO BE DONE

### Immediate Fixes (Before New Tests) — ACTIVE WORK SESSION

#### Fix 1: Hardcoded Credentials in `rtl-layout.spec.ts` ⚠️
**File**: `tests/e2e/i18n/rtl-layout.spec.ts` lines 316–323
**Problem**: Uses hardcoded `'test@example.com'` and `'password123'` directly.
**Fix**: Replace with `testUserCredentials` from `tests/fixtures/users.ts`.

Other files using hardcoded credentials (lower priority, already use env fallback):
- `tests/e2e/auth/login.spec.ts` lines 23–24: uses `process.env.TEST_USER_EMAIL || 'test@example.com'` — acceptable, uses env
- `tests/e2e/auth/register.spec.ts` lines 101, 172–173, 265–266: uses `'Password123!'` for test registration data — this is intentional test data, not login credentials

#### Fix 2: Missing data-testid Attributes ⚠️
Verify and add the 7 attributes listed in Phase 3 "STILL MISSING" section above.
Components to check: `HeaderActions.vue`, `HeaderProfile.vue` (or equivalent), cart modals.

#### Fix 3: Product Slug Dependencies ⚠️
Some product/search tests use hardcoded slugs like `'test-product'` that may not exist in the test database.
**Resolution options**:
- Option A: Add a `global-setup.ts` that seeds test products before the suite runs
- Option B: Mock the product API in tests that need specific slugs
- Option C: Use `page.route()` to intercept product API calls and return fixture data
Recommended: Option C (mock API) for product detail tests, Option A for listing/search tests that need real data.

### Pending Test Suites — HIGH PRIORITY

#### Auth Sub-Features (0 tests each)
- `tests/e2e/auth/forgot-password.spec.ts` — request reset, success message, form validation
- `tests/e2e/auth/reset-password.spec.ts` — reset with token, token expiry, invalid token, success redirect

#### Checkout (✅ COMPLETE — 32 tests)
**File**: `tests/e2e/checkout/checkout.spec.ts` ✅
**Coverage**:
- Cart checkout button (guest & authenticated)
- Mobile checkout button
- Checkout success page (`/checkout/success`)
- Checkout cancel page (`/checkout/cancel`)
- Full checkout flow (cart → checkout → success/cancel)
- API endpoint verification (guest vs auth)
- Loading states
- Error handling

#### Orders (0 tests — directory exists but empty)
**File to create**: `tests/e2e/orders/orders.spec.ts`
**Coverage needed**:
- Order history list (authenticated)
- Order detail view
- Order status display
- Order cancellation flow
- Reorder functionality (adds items back to cart)
- Guest order tracking (`/orders/track`)
- Pagination
- Filter by status
- Empty orders state
- Protected route redirect when unauthenticated

#### Profile (0 tests — directory exists but empty)
**File to create**: `tests/e2e/profile/profile.spec.ts`
**Coverage needed**:
- View profile page (authenticated)
- Update name/email/phone
- Upload avatar
- Remove avatar
- Change password (current + new + confirm)
- Account deletion
- Email verified state display
- Protected route redirect when unauthenticated

### Pending Test Suites — MEDIUM PRIORITY

#### Storefront (0 tests — directory exists but empty)
**File to create**: `tests/e2e/storefront/storefront.spec.ts`
**Coverage needed**:
- Homepage loads with expected sections
- Main navigation links work
- Theme toggle (light ↔ dark)
- 404 page displays correctly
- Footer links

### Optional (Low Priority)
- `global-setup.ts` — implement for test database seeding
- CI/CD GitHub Actions workflow
- Accessibility (a11y) tests
- Visual regression tests
- Performance benchmarks

---

## 📁 TESTS DIRECTORY STRUCTURE (ACCURATE — verified from disk)

```
tests/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts          ✅  12 tests
│   │   ├── register.spec.ts       ✅  17 tests
│   │   ├── logout.spec.ts         ✅  14 tests
│   │   ├── forgot-password.spec.ts ❌  MISSING
│   │   └── reset-password.spec.ts  ❌  MISSING
│   ├── cart/
│   │   ├── guest-cart.spec.ts      ✅  13 tests
│   │   ├── authenticated-cart.spec.ts ✅ 19 tests
│   │   └── cart-ui.spec.ts        ✅  26 tests
│   ├── checkout/
│   │   └── checkout.spec.ts       ✅  32 tests
│   ├── products/
│   │   ├── product-listing.spec.ts ✅  35 tests
│   │   └── product-detail.spec.ts  ✅  48 tests
│   ├── search/
│   │   └── search.spec.ts         ✅  43 tests
│   ├── orders/
│   │   └── (empty dir)            ❌  PENDING
│   ├── profile/
│   │   └── (empty dir)            ❌  PENDING
│   ├── storefront/
│   │   └── (empty dir)            ❌  PENDING
│   ├── i18n/
│   │   ├── language-switching.spec.ts ✅ 28 tests
│   │   └── rtl-layout.spec.ts     ✅  35 tests ⚠️ hardcoded creds
│   └── example.spec.ts            ✅   9 tests (passing)
├── fixtures/
│   ├── products.ts                ✅
│   ├── users.ts                   ✅
│   └── index.ts                   ✅
├── helpers/
│   ├── auth.ts                    ✅  12 exports
│   ├── cart.ts                    ✅  18 exports
│   ├── search.ts                  ✅  19 exports
│   ├── orders.ts                  ✅  30 exports
│   ├── profile.ts                 ✅  25 exports
│   ├── mocks.ts                   ✅  17+ exports
│   ├── types.ts                   ✅
│   └── index.ts                   ✅
├── pages/
│   ├── BasePage.ts                ✅  40+ methods
│   ├── LoginPage.ts               ✅  extends BasePage
│   ├── RegisterPage.ts            ✅  extends BasePage
│   ├── ProductPage.ts             ✅  extends BasePage
│   ├── ProductListingPage.ts      ✅  extends BasePage
│   ├── CartPage.ts                ✅  extends BasePage
│   ├── CheckoutPage.ts            ✅  extends BasePage
│   ├── OrdersPage.ts              ✅  extends BasePage
│   └── index.ts                   ✅  exports all POMs
├── .env.test                      ✅  configured (gitignored)
├── .env.test.example              ✅
├── global-setup.ts.example        ⚠️  not yet implemented
├── global-teardown.ts.example     ⚠️  not yet implemented
├── README.md                      ✅
└── QUICK_START.md                 ✅
```

---

## ⚠️ KNOWN ISSUES & FIXES NEEDED

### 1. Hardcoded credentials in rtl-layout.spec.ts
**Severity**: Medium
**File**: `tests/e2e/i18n/rtl-layout.spec.ts:316-323`
**Problem**: `'test@example.com'` and `'password123'` hardcoded directly in test
**Fix**: Import `testUserCredentials` from `tests/fixtures/users.ts`

### 2. tests/pages/index.ts incomplete exports
**Severity**: RESOLVED ✅
**Status**: All page objects are now properly exported

### 3. Missing data-testid attributes (7 items)
**Severity**: High (tests will fail or skip without them)
**Attributes needed**:
- `data-testid="user-menu-trigger"` (header account/profile menu)
- `data-testid="logout-button"` (inside profile dropdown)
- `data-testid="profile-dropdown-trigger"` (opens profile menu)
- `data-testid="confirm-remove"` (cart item remove confirmation)
- `data-testid="confirm-clear"` (cart clear confirmation modal button)
- `data-testid="google-login-button"` (Google OAuth button)
- `data-testid="update-cart-button"` (cart quantity update)
**Action**: Audit actual component files before adding — some may already exist or have different naming.

### 4. Product slug dependencies in tests
**Severity**: Medium
**Problem**: Product detail and search tests assume products exist in the live test database with specific slugs
**Fix**: Use `page.route()` API mocking for product-slug-dependent tests

### 5. global-setup.ts not implemented
**Severity**: Low (tests run fine without it)
**Status**: Template exists at `tests/global-setup.ts.example`
**If needed for**: database seeding, test user creation before suite runs

### 6. Inflated test count in old docs
**Severity**: Informational
**Note**: PLAYWRIGHT_FINAL_REVIEW.md claimed 376 tests. Actual disk count was **298**, now updated to **331** after checkout tests were found. Always verify with `grep -c` on disk.

---

## 📝 IMPORTANT DECISIONS MADE

1. **POM Pattern**: All pages extend `BasePage.ts`
2. **Selector Priority**: `data-testid` > ARIA roles > semantic HTML > text content
3. **Auth Strategy**: Cookie-based (NOT localStorage for auth state)
4. **Guest Cart Key**: `js_cart_{tenantId}` — always use `getGuestCartKey()` helper, never hardcode
5. **Multi-tenant**: ALL requests need `X-Tenant-Id` header — set globally in config, not per test
6. **i18n Routes**: English = no prefix, Arabic = `/ar` prefix (strategy: `prefix_except_default`)
7. **Test isolation**: Each test uses `clearTestState()` in `beforeEach` — no shared state
8. **API login**: Use `loginViaAPI()` in `beforeEach` for speed; use UI only when testing the login flow itself
9. **No shared state**: Tests MUST NOT depend on other tests or execution order
10. **Product routes**: Canonical route is `/shop/product/{slug}` (singular), not `/shop/products/`

---

## 🚀 QUICK REFERENCE COMMANDS

```bash
# Install browsers (first time only)
npx playwright install

# Run all tests
npm run test:e2e

# Run specific file
npm run test:e2e tests/e2e/auth/login.spec.ts

# Run specific project
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Debug mode (opens browser)
npm run test:e2e:debug

# UI mode (visual runner)
npm run test:e2e:ui

# Headed mode (see browser)
npm run test:e2e:headed

# View last HTML report
npm run test:e2e:report

# Count tests in a file quickly
grep -cP "^\s+test\(" tests/e2e/auth/login.spec.ts

# Count total tests across all specs
find tests/e2e -name "*.spec.ts" | xargs grep -cP "^\s+test\(" | awk -F: '{sum+=$2} END {print sum}'
```

### Test Environment Variables (tests/.env.test)

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/v1
NUXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
NUXT_PUBLIC_SITE_URL=http://demo.justshop.test:3000
TEST_TENANT_ID=demo
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=Password123!
TEST_API_BASE=http://localhost:8000/api/v1
TEST_API_TOKEN=your-test-api-token
```

---

## 📊 COVERAGE SUMMARY

| Feature Area | Files | Tests | Coverage | Next Action |
|---|---|---|---|---|
| Auth (login/register/logout) | 3 | 43 | 🟢 High | Add forgot-password, reset-password specs |
| Cart (guest/auth/UI) | 3 | 58 | 🟢 High | Fix missing data-testid, then run |
| Checkout (cart/success/cancel) | 1 | 32 | 🟢 High | Ready to run |
| Products (listing/detail) | 2 | 83 | 🟢 High | Fix slug dependencies |
| Search | 1 | 43 | 🟢 High | Ready |
| i18n (switching/RTL) | 2 | 63 | 🟢 High | Fix hardcoded creds in rtl-layout |
| Example/smoke | 1 | 9 | 🟢 Passing | Done |
| **Subtotal** | **13** | **331** | | |
| Orders | 0 | 0 | 🔴 None | Write orders.spec.ts |
| Profile | 0 | 0 | 🔴 None | Write profile.spec.ts |
| Storefront | 0 | 0 | 🟡 Low pri | Write storefront.spec.ts |
| Auth (forgot/reset pwd) | 0 | 0 | 🔴 None | Write specs |
| **GRAND TOTAL** | **12** | **298** | ~55% user flows | |
