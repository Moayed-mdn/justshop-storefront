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

`shared/utils/routes.ts` currently owns three route groups:

- `APP_ROUTES` for frontend navigation
- `API_ROUTES` for internal `server/api` paths
- `EXTERNAL_API_ROUTES` for backend proxy mappings

Prefer these shared constants over repeating path strings when a matching constant already exists.

## Current Page Route Families

| Route family | Page files |
|---|---|
| Home | `app/pages/index.vue` |
| Auth | `app/pages/login.vue`, `app/pages/register.vue`, `app/pages/auth/google/callback.vue`, `app/pages/verify-email/[id]/[hash].vue` |
| Products | `app/pages/products/index.vue`, `app/pages/products/category/[slug].vue`, `app/pages/products/product/[slug].vue` |
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
