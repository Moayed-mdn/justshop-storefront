# External Services

## Purpose

This document summarizes the external services the JustShop frontend currently depends on and where their contracts are owned in the codebase.

Code surfaces this file aligns with:

- `nuxt.config.ts`
- `.env.example`
- `shared/utils/routes.ts`
- `server/utils/api.ts`
- `server/api/**`
- `app/composables/useAuth.ts`
- `app/plugins/apollo.client.ts`
- `app/graphql/queries/search.ts`

## Current Service Inventory

| Service | Current config source | Current access path | Primary consumers | Notes |
|---|---|---|---|---|
| Backend REST API | `NUXT_PUBLIC_API_BASE` via `runtimeConfig.apiBase` and `runtimeConfig.public.apiBase` | Primarily through Nitro `server/api/**` handlers using `useServerApi(event)` | Auth, cart, products, homepage content, orders, profile, checkout, and the REST search proxy | The server-side base URL is still sourced from a public env value. |
| GraphQL endpoint | `NUXT_PUBLIC_GRAPHQL_URL` via `runtimeConfig.public.graphqlUrl` | Direct client-side Apollo requests | Search page and header autocomplete | This path bypasses Nitro in the active search UI. |
| Google OAuth provider | Indirect through the backend auth routes | Browser redirect through internal auth route, then backend/provider redirect flow | Google sign-in from the login screen | No direct Google SDK or client library is present in the repo. |

## Backend REST API

The backend API is the main external dependency for storefront application flows.

Current ownership:

- `shared/utils/routes.ts` owns the backend path fragments in `EXTERNAL_API_ROUTES`.
- `server/utils/api.ts` owns the server-side fetch instance and header forwarding behavior.
- `server/api/**` owns the Nitro route handlers that map app-facing requests to backend routes.

Current route families visible in `EXTERNAL_API_ROUTES`:

- `auth`
- `cart`
- `categories`
- `checkout`
- `homepage`
- `orders`
- `products`
- `profile`
- `search`

Current server-to-backend request behavior:

- uses `runtimeConfig.apiBase` as the backend base URL
- forwards `Accept: application/json`
- forwards locale from the `i18n_redirected` cookie or `accept-language` header
- reads the persisted auth token from the `auth` cookie when present
- sends `Authorization: Bearer <token>` for authenticated backend calls

## GraphQL Endpoint

GraphQL is currently a dedicated search integration rather than a general data-access path.

Current ownership:

- `app/plugins/apollo.client.ts` injects `$apollo`
- `app/graphql/queries/search.ts` defines `SEARCH_QUERY` and `AUTOCOMPLETE_QUERY`
- `app/pages/search.vue` performs client-side search queries
- `app/components/header/HeaderSearchInput.vue` uses the autocomplete path

Current query contract shape:

- variables: `query`, `locale`, and optional `limit`
- search results include products, categories, and brands
- autocomplete results include typed suggestion entries such as product-like items with slug and pricing fields

Current boundary rule:

- use Apollo only for the active search integration unless the architecture docs are intentionally updated

## Google OAuth Provider

Google sign-in is currently mediated by the backend auth service rather than by a direct frontend SDK.

Current flow:

1. `useAuth().loginWithGoogle()` sends the browser to `API_ROUTES.auth.googleRedirect`.
2. `server/api/auth/google/redirect.get.ts` redirects the request to the backend `auth/google/redirect` path using `buildExternalApiUrl(...)`.
3. The backend and provider redirect the browser back to the frontend callback path with `token` or `error` query parameters.
4. The frontend callback handling then calls `handleGoogleCallback(token)` to persist auth state and fetch the user.

Current implementation note:

- callback handling is owned by `app/pages/auth/google/callback.vue` (google-auth middleware was removed per ADR-003)

## Current Integration Constraints

- `runtimeConfig.apiBase` is still sourced from `NUXT_PUBLIC_API_BASE`, so the server-side backend base URL is not isolated from public config yet.
- `app/utils/serverApi.ts` remains an overlapping helper that uses `config.public.apiBase` instead of the Nitro-side `useServerApi(event)` path.
- The repo still contains both a REST `/api/search` proxy route and a direct GraphQL search integration, but the active search UI uses GraphQL.

The preferred cleanup direction for the runtime-config boundary is recorded in `docs/reference/adr-002-api-base-runtime-boundary.md`, and the request-helper consolidation direction is recorded in `docs/reference/adr-001-request-helper-consolidation.md`.

## Related Docs

- `docs/architecture/api-integration.md`
- `docs/architecture/data-fetching.md`
- `docs/architecture/auth-and-security.md`
- `docs/configuration/runtime-config.md`
- `docs/configuration/plugins.md`
