# Routing And Navigation

## Purpose

This document defines the current page route families, middleware behavior, and shared route contract usage.

Code surfaces this file aligns with:

- `app/pages/**`
- `app/middleware/**`
- `shared/utils/routes.ts`
- `nuxt.config.ts`

## Locale Routing

Current i18n routing behavior from `nuxt.config.ts`:

- default locale: `en`
- second locale: `ar`
- strategy: `prefix_except_default`
- browser-language cookie: `i18n_redirected`

That means default English routes are unprefixed while non-default locale routes are prefixed.

## Shared Route Owners

`shared/utils/routes.ts` owns API and transitional `APP_ROUTES` aliases.

**Storefront navigation** must use the canonical contract:

- `shared/utils/storefront-routes.ts` — locale-neutral path constants and legacy redirect rules
- `app/composables/useStorefrontRoutes.ts` — locale-aware builders (`localePath`)

See `docs/architecture/storefront-routes.md` for the canonical path table.

`API_ROUTES` and `EXTERNAL_API_ROUTES` remain in `shared/utils/routes.ts` for Nitro proxy paths.

## Current Page Route Families

| Route family | Page files |
|---|---|
| Home | `app/pages/index.vue` |
| Auth | `app/pages/login.vue`, `app/pages/register.vue`, `app/pages/auth/google/callback.vue`, `app/pages/verify-email/[id]/[hash].vue` |
| Runtime catalog | `app/pages/[...slug].vue` (home, shop, category, product, marketing) |
| Legacy commerce | `app/pages/cart.vue`, `app/pages/search.vue`, orders, profile, auth |
| Cart and checkout | `app/pages/cart.vue`, `app/pages/checkout/success.vue`, `app/pages/checkout/cancel.vue` |
| Orders | `app/pages/orders/index.vue`, `app/pages/orders/[orderNumber].vue`, `app/pages/orders/track.vue` |
| Profile | `app/pages/profile.vue` |
| Search | `app/pages/search.vue` |

## Middleware Rules Visible Today

| Middleware | Current behavior |
|---|---|
| `auth` | Redirects unauthenticated users to localized login and fetches user data if token exists but user state is missing |
| `guest` | Redirects authenticated users away from guest-only auth pages |
| `google-auth` | Processes token or error query params from Google callback flow |

## Current Protection State

Route protection is not fully uniform today:

- `login.vue` and `register.vue` use guest middleware.
- `profile.vue` and `orders/[orderNumber].vue` use auth middleware.
- `orders/index.vue` currently has its auth middleware commented out.
- `orders/track.vue` is the guest order lookup flow.

Document this as the current live state and clarify it further if route policy changes.

The preferred single-owner direction for Google callback handling is recorded in `docs/reference/adr-003-google-callback-owner.md`.

## Navigation Patterns

- Pages commonly use `useLocalePath()` for locale-aware redirects and internal navigation.
- Product category and product detail pages use slug-based routes.
- Orders use both authenticated history/detail pages and a guest lookup page.
- Search reads the `q` query parameter from the route.
