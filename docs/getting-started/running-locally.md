# Running Locally

## Purpose

This document explains how to start the JustShop frontend locally and what to verify once it is running.

Code surfaces this file aligns with:

- `package.json`
- `nuxt.config.ts`
- `server/api/**`
- `app/plugins/01.auth.client.ts`
- `app/plugins/02.cart.client.ts`
- `app/pages/**`

## Start The Dev Server

```bash
npm run dev
```

Expected default local URL:

```text
http://localhost:3000
```

## Useful Runtime Commands

| Command | When to use it |
|---|---|
| `npm run dev` | Normal development with Nuxt dev server |
| `npm run build` | Validate that the production build still compiles |
| `npm run preview` | Validate the production build locally |
| `npm run generate` | Static generation checks when needed |

## What Needs To Be Working

For a useful local session, all of these should be available:

- the Nuxt app on `localhost:3000`
- a reachable backend API for `server/api` proxy routes
- a reachable GraphQL endpoint for search
- valid `.env` values matching those services

## First Smoke Checks

After the dev server starts, manually verify these routes:

- `/` for homepage sections
- `/products` and `/products/category/<slug>` for catalog browsing
- `/products/product/<slug>` for product detail
- `/search?q=<term>` for search results
- `/cart` for guest cart rendering and hydration
- `/login` and `/register` for guest auth screens
- `/profile` for protected account behavior
- `/orders` and `/orders/track` for order flows

## Runtime Notes

- `01.auth.client.ts` runs on the client and tries to fetch the user if a persisted auth token exists.
- `02.cart.client.ts` runs on the client and initializes cart state.
- `app/pages/search.vue` depends on the client-only Apollo plugin and GraphQL endpoint.
- Guest cart behavior depends on browser storage, so cart behavior is hydration-sensitive by design.
- Internal app requests still pass through `server/api`, even during local development.

## Local Troubleshooting Checks

If the app does not behave correctly, check these first:

- `.env` values point to the expected backend and GraphQL services
- the backend API responds to requests triggered through `server/api`
- the GraphQL endpoint accepts search queries
- browser cookies are enabled for locale and auth persistence behavior

This file intentionally stays focused on startup and local validation. Deeper failure analysis belongs in the future troubleshooting and architecture docs.
