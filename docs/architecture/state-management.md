# State Management

## Purpose

This document defines the current global state ownership in the JustShop frontend.

Code surfaces this file aligns with:

- `app/stores/auth.ts`
- `app/stores/cart.ts`
- `app/plugins/01.auth.client.ts`
- `app/plugins/02.cart.client.ts`

## Current Stores

| Store | File | Current responsibility |
|---|---|---|
| `auth` | `app/stores/auth.ts` | Holds token and current user state |
| `cart` | `app/stores/cart.ts` | Holds cart items, totals, loading state, and guest/auth cart behavior |

## Auth Store

Current auth store behavior:

- store id: `auth`
- state: `token`, `user`
- computed state: `isLoggedIn`
- actions: `setToken`, `setUser`, `clearAuth`
- persisted field: `token`
- persistence medium: `piniaPluginPersistedstate.cookies()`

The auth bootstrap plugin reads this persisted token on the client and fetches the user when needed.

## Cart Store

Current cart store behavior:

- store id: `cart`
- keeps items, totals, loading flags, error state, and `initialized`
- uses local storage for guest cart persistence
- uses internal API routes when the user is authenticated
- merges guest cart items into the server cart on login
- clears local guest cart storage on logout

## State Boundaries

- Auth token persistence is cookie-backed through Pinia persisted state.
- Guest cart persistence is browser-local and must stay client-guarded.
- User profile data is fetched through composables and stored via the auth store.
- Global application state is currently limited to auth and cart; other domains use page-local or composable-local state.

## Boot Sequence Effects

- `01.auth.client.ts` attempts to hydrate user state from a persisted token.
- `02.cart.client.ts` initializes cart state after auth bootstrap.
- Cart fetch behavior depends on whether auth state is already present.

## Safety Rules

- Do not move guest cart storage into unguarded server code.
- Do not add a new global store without updating this document.
- Keep persisted and hydration-sensitive logic documented with the plugin and auth docs.
