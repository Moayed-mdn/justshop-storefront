# Project Structure

## Purpose

This document explains where code belongs in the current JustShop frontend repository.

Code surfaces this file aligns with:

- `app/`
- `server/`
- `shared/`
- `types/`
- `i18n/`
- `public/`

## Top-Level Structure

```text
app/       Nuxt application code
server/    Nitro server code
shared/    Shared route and utility code imported by app and Nitro
types/     Shared TypeScript declarations and domain types
i18n/      Locale JSON bundles
public/    Static public assets
docs/      Repository documentation
```

## `app/`

The `app/` directory contains the main frontend application:

| Path | What belongs here |
|---|---|
| `app/pages/` | Route-backed page files |
| `app/layouts/` | Shared page shells such as `default.vue` and `auth.vue` |
| `app/middleware/` | Route middleware such as `auth`, `guest`, and Google callback handling |
| `app/components/` | Reusable UI and feature components |
| `app/composables/` | Reusable composition logic like auth, cart, checkout, orders, and API helpers |
| `app/stores/` | Pinia stores for global auth and cart state |
| `app/plugins/` | Nuxt plugins for app boot behavior and injected runtime helpers |
| `app/assets/` | CSS, icons, and image assets bundled with the app |
| `app/graphql/` | GraphQL query definitions for client-side search |
| `app/utils/` | Non-auto-import utility helpers currently used by the app |

Notable current details:

- `app/plugins/01.auth.client.ts` and `app/plugins/02.cart.client.ts` establish a meaningful client boot order.
- `app/pages/` is convention-based Nuxt routing and must not be treated as removable just because imports are sparse.
- `app/utils/serverApi.ts` exists as an additional helper surface and should be evaluated alongside the future API integration docs.

## `server/`

The `server/` directory contains Nitro server code:

| Path | What belongs here |
|---|---|
| `server/api/` | Internal request handlers that proxy or coordinate app-facing API behavior |
| `server/middleware/` | Request middleware such as server logging |
| `server/utils/` | Server-side helpers such as backend API fetch creation |

Current route families visible in `server/api/`:

- `auth`
- `cart`
- `checkout`
- `orders`
- `products`
- `profile`
- `search`
- homepage helper endpoints such as `hero` and `best_seller`

## `shared/`

`shared/utils/routes.ts` is the current shared route contract file for:

- app-facing API routes
- external backend route mappings
- frontend route constants

Prefer this shared surface over duplicating route strings.

## `types/`

The `types/` directory contains shared domain and integration types such as:

- auth
- cart
- checkout
- order
- product and product detail
- search
- API response shapes

There are also duplicate or review-required type declaration candidates already noted in `docs/implementation-plan.md`.

## `i18n/`

`i18n/locales/` currently contains English and Arabic translation bundles split by feature namespace, including:

- auth
- cart
- checkout
- footer
- header
- orders
- product
- profile
- search

## `public/`

`public/` contains runtime web assets served as-is, including:

- `favicon.ico`
- `robots.txt`

Keep browser-expected assets here rather than in `app/assets/`.
