# Architecture Overview

## Purpose

This document describes the current top-level runtime architecture of the JustShop frontend.

Code surfaces this file aligns with:

- `app/`
- `server/`
- `shared/utils/routes.ts`
- `nuxt.config.ts`

## Main Runtime Layers

| Layer | Primary location | Current responsibility |
|---|---|---|
| Nuxt app shell | `app/app.vue`, `app/layouts/**`, `app/pages/**` | Renders the storefront UI, localized routes, and page-level behavior |
| Shared frontend logic | `app/composables/**`, `app/stores/**`, `app/plugins/**` | Coordinates auth, cart, checkout, orders, search, and startup behavior |
| Nitro server layer | `server/api/**`, `server/middleware/**`, `server/utils/api.ts` | Provides app-facing internal API routes and server-side backend proxy logic |
| Shared route contract | `shared/utils/routes.ts` | Centralizes frontend, internal API, and external backend path definitions |
| External services | backend API, GraphQL endpoint | Serve storefront data, auth, orders, checkout, and search |

## Current Flow Summary

1. Nuxt auto-loads pages, layouts, middleware, plugins, composables, and stores.
2. Browser requests render storefront pages under `app/pages/`.
3. Most app-side data calls use `useApi()` against internal `server/api` endpoints.
4. Nitro route handlers proxy those requests to the external backend API using `useServerApi(event)`.
5. Search is the main exception: the client-side Apollo plugin talks directly to the configured GraphQL endpoint.

## Key Domain Areas

| Area | Core files |
|---|---|
| Auth | `app/stores/auth.ts`, `app/composables/useAuth.ts`, `app/middleware/auth.ts`, `server/api/auth/**` |
| Cart and checkout | `app/stores/cart.ts`, `app/composables/useCheckout.ts`, `server/api/cart/**`, `server/api/checkout/**` |
| Catalog and products | `app/pages/products/**`, `server/api/products/**`, `server/api/hero.get.ts`, `server/api/best_seller.get.ts` |
| Orders and profile | `app/pages/orders/**`, `app/pages/profile.vue`, `server/api/orders/**`, `server/api/profile*` |
| Search | `app/pages/search.vue`, `app/graphql/queries/search.ts`, `app/plugins/apollo.client.ts` |

## Related Docs

Use the owner docs for detail:

- `docs/architecture/rendering-strategy.md`
- `docs/architecture/routing-and-navigation.md`
- `docs/architecture/data-fetching.md`
- `docs/architecture/state-management.md`
- `docs/architecture/auth-and-security.md`
- `docs/architecture/api-integration.md`
