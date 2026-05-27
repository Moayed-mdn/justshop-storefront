# Data Fetching

## Purpose

This document describes the current data access patterns used by the JustShop frontend.

Code surfaces this file aligns with:

- `app/composables/useApi.ts`
- `server/utils/api.ts`
- `app/plugins/apollo.client.ts`
- `app/graphql/queries/search.ts`
- `server/api/**`

## Current Fetch Paths

| Pattern | Primary files | Current use |
|---|---|---|
| App-side REST helper | `app/composables/useApi.ts` | Main fetch path for auth, cart, orders, profile, checkout, and verification flows |
| Internal API proxy | `server/api/**`, `server/utils/api.ts` | Nitro layer between the frontend and external backend API |
| Client-side GraphQL | `app/plugins/apollo.client.ts`, `app/graphql/queries/search.ts` | Search page and header autocomplete |

## Recommended Current Usage

Based on the live codebase today:

- Use `useApi()` for most application requests that should hit internal `server/api` routes.
- Keep backend integration logic inside Nitro route handlers instead of calling the backend API directly from pages.
- Use Apollo only for the dedicated GraphQL search path.

## `useApi()` Behavior

The current helper in `app/composables/useApi.ts`:

- creates a fresh `$fetch` instance per call
- sends `Accept: application/json`
- sends `Content-Type: application/json` unless the body is `FormData`
- forwards request cookies through `useRequestHeaders(['cookie'])`
- sends `Accept-Language` from the `i18n_redirected` cookie
- sends `Authorization: Bearer <token>` when the auth store has a token
- shows error toast messages for non-500 response errors

## Server Proxy Behavior

The current Nitro helper in `server/utils/api.ts`:

- reads runtime config through `useRuntimeConfig(event)`
- uses `config.apiBase` as the backend base URL
- forwards locale from cookie or request header
- reads the persisted auth token from the `auth` cookie when present
- sets `Accept`, `Accept-Language`, and `Authorization` headers for backend requests

## GraphQL Search Path

The current GraphQL path is separate from the REST proxy flow:

- `app/plugins/apollo.client.ts` injects `$apollo`
- `app/graphql/queries/search.ts` defines `SEARCH_QUERY` and `AUTOCOMPLETE_QUERY`
- `app/pages/search.vue` uses the search query on the client
- `app/components/header/HeaderSearchInput.vue` also references `$apollo`

## Overlapping Helper Surfaces

The repo currently contains more than one request-helper surface:

- `useApi.ts`
- injected `$api` from `app/plugins/api.ts`
- `useClientApi.ts`
- `app/utils/serverApi.ts`

The plan identifies `useApi.ts` as the primary documented fetch helper, so these overlapping helpers should be treated carefully and reconciled deliberately in future cleanup or refactor work.

The preferred consolidation direction for that cleanup is recorded in `docs/reference/adr-001-request-helper-consolidation.md`.
