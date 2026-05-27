# Troubleshooting

## Purpose

This document collects the most likely setup and runtime failure modes visible in the current JustShop frontend codebase.

Code surfaces this file aligns with:

- `package.json`
- `nuxt.config.ts`
- `.env.example`
- `app/composables/useApi.ts`
- `app/plugins/apollo.client.ts`
- `app/stores/auth.ts`
- `app/stores/cart.ts`
- `server/utils/api.ts`
- `app/pages/**`

## Install Or Startup Issues

### Wrong Node Version

Symptoms:

- install or dev-server issues after dependency changes

Checks:

- confirm `.nvmrc` matches the active version
- run `nvm use`

Current expected version:

- `22.12.0`

### Missing Or Incorrect `.env`

Symptoms:

- backend requests fail
- search returns nothing
- localized URLs or base URL behavior is wrong

Checks:

- compare local `.env` against `.env.example`
- confirm `NUXT_PUBLIC_API_BASE`, `NUXT_PUBLIC_GRAPHQL_URL`, and `NUXT_PUBLIC_SITE_URL` are present

## API And Backend Proxy Issues

### Internal `/api` Requests Fail

Symptoms:

- auth, cart, orders, profile, or product requests fail from the app

Checks:

- confirm the backend API is reachable at `NUXT_PUBLIC_API_BASE`
- confirm the relevant request is going through `server/api/**` and not bypassing Nitro
- review `server/utils/api.ts` and the route mapping in `shared/utils/routes.ts`

### Locale Or Auth Headers Behave Unexpectedly

Symptoms:

- responses arrive in the wrong language
- authenticated requests act as guest requests

Checks:

- confirm `i18n_redirected` cookie behavior
- confirm the persisted `auth` cookie contains the expected token shape
- confirm the request path uses `useApi.ts` and the Nitro proxy flow rather than an alternate helper surface

## Search And GraphQL Issues

### Search Autocomplete Or Search Page Does Not Work

Symptoms:

- header autocomplete fails
- `/search?q=<term>` stays empty or logs client errors

Checks:

- confirm `NUXT_PUBLIC_GRAPHQL_URL` points to a reachable GraphQL endpoint
- confirm the Apollo plugin is available on the client
- remember search is client-oriented and depends on the client-only Apollo setup

## Auth Issues

### Login Persists Token But User State Looks Wrong

Symptoms:

- token exists after refresh but protected flows still fail temporarily

Checks:

- confirm `01.auth.client.ts` runs before `02.cart.client.ts`
- confirm `useAuth.ts` can fetch the current user through `/api/auth/me`
- confirm the auth cookie persistence behavior still matches `app/stores/auth.ts`

### Google Sign-In Flow Is Confusing

Symptoms:

- callback flow seems duplicated or inconsistent

Checks:

- note that Google callback handling currently exists in both route middleware and the callback page
- verify which path the user actually reached and whether `token` or `error` query params are present

## Cart And Hydration Issues

### Guest Cart Looks Wrong After Refresh

Symptoms:

- cart flashes, empties, or appears inconsistent before hydration

Checks:

- remember guest cart behavior is client-storage-backed
- confirm the relevant page uses `ClientOnly` or hydration guards as expected
- confirm local storage can be read and the cart store initializes successfully

### Cart Merge After Login Fails

Symptoms:

- guest items do not appear after login

Checks:

- verify `useAuth.ts` still calls `cartStore.onLogin()`
- verify `app/stores/cart.ts` still merges guest cart items before fetching server cart state

## Orders Issues

### Guest Order Tracking Fails Unexpectedly

Symptoms:

- guest order lookup returns not found or unexpected errors even with known-valid data

Checks:

- confirm the request payload shape to `/api/orders/guest/lookup`
- note the current live mismatch: `useOrders.ts` defines `guestLookup(email, orderNumber)`, while `orders/track.vue` calls it in the opposite order

## Theme Issues

### Theme Toggle Does Not Actually Toggle

Symptoms:

- UI remains light even though dark-theme tokens exist

Checks:

- note that `useTheme.ts` currently forces light mode
- do not treat the existence of dark-theme token overrides as proof that dark mode is fully active

## Build Issues

### Production Build Fails

Checks:

- run `npm run build`
- confirm env values are present and valid
- confirm no recent code or docs changes introduced unsupported assumptions
- review diagnostics for recently edited files

## Current Gaps

- The repo has overlapping request-helper surfaces, which can make debugging request behavior harder.
- Logging is minimal and mostly console-based, so debugging often depends on browser devtools, server logs, and reproducing the user flow manually.
- No automated test harness is present to narrow failures quickly.

## Escalation Rule

If troubleshooting points to a real code bug rather than a local setup issue, update the owner doc for that behavior when the fix lands.
