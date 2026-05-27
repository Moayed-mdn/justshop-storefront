# Getting Started Overview

## Purpose

This document introduces the current JustShop frontend application and the fastest path for a new developer to understand what the repo does before making changes.

Code surfaces this overview aligns with:

- `README.md`
- `app/pages/**`
- `server/api/**`
- `app/plugins/apollo.client.ts`
- `shared/utils/routes.ts`

## What This App Does

The repository is a Nuxt 4 storefront frontend with localized customer-facing pages, internal Nitro proxy routes, and a mix of REST-backed application flows plus GraphQL-backed search.

Current user-facing areas visible in `app/pages/`:

- home page with hero and best-seller sections
- product catalog, category listing, and product detail pages
- cart and checkout success/cancel pages
- login, register, Google auth callback, and email verification flows
- profile management
- order history, order detail, and guest order tracking
- search results

## Runtime Shape

At a high level, the app currently works like this:

1. Nuxt renders the application and auto-loads pages, layouts, middleware, plugins, composables, and stores.
2. Most application data flows through internal `server/api` routes that proxy to an external backend API.
3. Search uses Apollo on the client through `app/plugins/apollo.client.ts` and `app/graphql/queries/search.ts`.
4. Auth state and cart state live in Pinia stores, with different behavior for logged-in and guest users.
5. Localization is configured with English as the default locale and Arabic as the second active locale.

## Main Feature Areas

| Area | Primary entry points | Notes |
|---|---|---|
| Storefront browsing | `app/pages/index.vue`, `app/pages/products/**` | Covers homepage, listing, category, and detail flows |
| Search | `app/pages/search.vue` | Uses Apollo GraphQL client and locale-aware query variables |
| Auth | `app/pages/login.vue`, `app/pages/register.vue`, `app/pages/auth/google/callback.vue`, `app/pages/verify-email/**` | Includes guest-only pages, email verification, and Google sign-in |
| Cart and checkout | `app/pages/cart.vue`, `app/pages/checkout/**` | Supports guest and authenticated carts with checkout session flows |
| Account and orders | `app/pages/profile.vue`, `app/pages/orders/**` | Profile uses auth middleware; orders include history, detail, and tracking |

## Recommended Onboarding Path

Read these files in order:

1. `README.md`
2. `docs/getting-started/prerequisites.md`
3. `docs/getting-started/installation.md`
4. `docs/getting-started/running-locally.md`
5. `docs/getting-started/project-structure.md`

Then inspect these implementation anchors:

- `nuxt.config.ts`
- `package.json`
- `shared/utils/routes.ts`
- `app/plugins/`
- `app/stores/`
- `server/api/`

## Boundaries To Keep In Mind

- Keep deep runtime explanations in the future `docs/architecture/*` files.
- Keep env and module details in the future `docs/configuration/*` files.
- Treat `server/api` as the current backend integration boundary for app flows.
- Treat GraphQL search as a separate integration path from the REST-backed proxy routes.
