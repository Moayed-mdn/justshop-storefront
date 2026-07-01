# Pages, Layouts, And Middleware

## Purpose

This document describes how route-backed pages, shared layouts, and route middleware are currently used in the JustShop frontend.

Code surfaces this file aligns with:

- `app/pages/**`
- `app/layouts/**`
- `app/middleware/**`
- `shared/utils/routes.ts`

## Current Layout Inventory

The live repo currently defines these layouts:

| Layout | Current use |
|---|---|
| `default.vue` | Main storefront shell with topbar, header, footer, and page slot |
| `auth.vue` | Auth-facing shell used by login, register, and Google callback pages |

There is also a special no-layout case:

- `app/pages/verify-email/[id]/[hash].vue` uses `definePageMeta({ layout: false })` for a standalone verification screen.

## Current Page Families

The route-backed pages currently group into these feature areas:

| Page family | Current files | Current responsibility |
|---|---|---|
| Home | `index.vue` | Entry page with hero and best-seller sections |
| Auth | `login.vue`, `register.vue`, `auth/google/callback.vue`, `verify-email/[id]/[hash].vue` | Sign-in, sign-up, Google callback handling, and email verification |
| Catalog | `products/index.vue`, `products/category/[slug].vue`, `products/product/[slug].vue` | Product listing, category listing, and product detail |
| Search | `search.vue` | Client-side GraphQL search results page |
| Cart and checkout | `cart.vue`, `checkout/success.vue`, `checkout/cancel.vue` | Cart management and Stripe return flows |
| Orders | `orders/index.vue`, `orders/[orderNumber].vue`, `orders/track.vue` | Authenticated order history/detail and guest order lookup |
| Profile | `profile.vue` | Authenticated profile management |

## Current Placement Rules

### What Belongs In Pages

- route-specific orchestration
- page metadata through `definePageMeta(...)`
- page-level `useHead(...)` usage
- composition of feature components and composables
- route param and query handling

### What Belongs In Layouts

- shared shell structure that wraps multiple pages
- top-level navigation or auth framing
- page slot composition

### What Belongs In Middleware

- navigation and access control rules
- route-entry logic that should run before page rendering
- redirects tied to auth or route-level flow control

## Current Middleware Inventory

| Middleware | Current use |
|---|---|
| `auth.ts` | Redirects unauthenticated users to login and fetches the user if the token exists but user data is missing |
| `guest.ts` | Redirects logged-in users away from guest-only pages |
<!-- google-auth middleware was removed per ADR-003; callback handling is in pages/auth/google/callback.vue -->

## Current Usage Pattern

- Auth pages such as `login.vue` and `register.vue` use the `auth` layout and `guest` middleware.
- `profile.vue` and `orders/[orderNumber].vue` use `auth` middleware for protected flows.
- `cart.vue`, `checkout/success.vue`, and `checkout/cancel.vue` use the default storefront layout.
- Product and category listing pages keep layout structure minimal and delegate rendering to feature components such as `LayoutShop`.

## Routing And Navigation Rules

- Keep frontend route contracts aligned with `APP_ROUTES` in `shared/utils/routes.ts`.
- Use route params and query values directly in the page layer, then hand derived data and actions down to components.
- Keep page links locale-aware where the repo already uses `NuxtLinkLocale` and `useLocalePath`.
- Avoid moving route protection logic into components when middleware already owns it.

## Current Flow Notes

### Auth Flows

- `login.vue` and `register.vue` are guest-only pages under the auth layout.
- `auth/google/callback.vue` currently handles Google callback flow inside the page.
- `verify-email/[id]/[hash].vue` is a standalone page that reads params and signature-related query values, then calls the verification API route.

### Catalog And Search

- `products/index.vue` and `products/category/[slug].vue` are listing pages that delegate most rendering to `LayoutShop`.
- `products/product/[slug].vue` keeps more direct page orchestration because it coordinates detail loading, variant selection, cart actions, and checkout entry.
- `search.vue` is client-oriented because it depends on the client-only Apollo plugin.

### Orders And Profile

- `profile.vue` is an authenticated page built from focused profile components and composables.
- `orders/index.vue` owns filters, pagination, reorder, and cancel orchestration for the orders list.
- `orders/[orderNumber].vue` handles protected order detail access.
- `orders/track.vue` remains the guest order tracking path.

## Current Inconsistencies To Preserve As Debt

- `orders/index.vue` still has auth middleware commented out, so route protection is not fully uniform across the orders area.
- Google callback handling exists in both `app/middleware/google-auth.ts` and `app/pages/auth/google/callback.vue`.
- Some pages still contain hardcoded route targets or route strings instead of consistently reusing shared route constants.
- `verify-email/[id]/[hash].vue` currently contains direct standalone UI and hardcoded text rather than following the same localization and layout patterns as the rest of the auth flow.

The preferred single-owner direction for the Google callback duplication is recorded in `docs/reference/adr-003-google-callback-owner.md`.

## Change Rules

- Update this document whenever new route families, layouts, or middleware files are added.
- If a page family changes protection level, document the new middleware ownership here and in the auth architecture docs if relevant.
- If callback or verification flows are consolidated later, remove the duplication note here in the same change set.
