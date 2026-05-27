# API Integration

## Purpose

This document explains how the frontend currently integrates with the external backend API through Nitro and where direct GraphQL access is used instead.

Code surfaces this file aligns with:

- `server/api/**`
- `server/utils/api.ts`
- `shared/utils/routes.ts`
- `app/composables/useApi.ts`
- `app/plugins/apollo.client.ts`

## Integration Model

The current application uses two external integration paths:

1. REST-style application flows go through internal `server/api` handlers.
2. Search uses direct client-side GraphQL calls through Apollo.

## Internal API Proxy Pattern

The usual REST flow is:

1. page or composable calls an internal path from `API_ROUTES`
2. Nitro handler in `server/api/**` receives the request
3. Nitro uses `useServerApi(event)` or related helper logic
4. backend route path from `EXTERNAL_API_ROUTES` is called against `config.apiBase`
5. response is returned to the frontend

## Current Route Families

| Internal family | Backend family |
|---|---|
| `auth` | `auth` |
| `cart` | `cart` |
| `products` | `products` and `homepage` |
| `orders` | `orders` |
| `profile` | `profile` |
| `checkout` | `checkout` |
| `search` | `search` |

## Shared Route Ownership

`shared/utils/routes.ts` is the current mapping owner for:

- internal app-facing routes in `API_ROUTES`
- backend path fragments in `EXTERNAL_API_ROUTES`
- frontend navigation routes in `APP_ROUTES`

This file should stay the primary owner for path contracts instead of scattering literals across the codebase.

## GraphQL Exception

Search is currently handled outside the Nitro proxy layer:

- `app/plugins/apollo.client.ts` points Apollo to `config.public.graphqlUrl`
- `app/graphql/queries/search.ts` defines the GraphQL operations
- `app/pages/search.vue` performs the query on the client

## Current Integration Gaps To Note

- `app/utils/serverApi.ts` exists as an additional helper that uses `config.public.apiBase`, which overlaps with the server-side `useServerApi(event)` path.
- The repo currently mixes `useApi()`, injected `$api`, and other helper surfaces, so fetch ownership should be kept explicit when changing integration behavior.
- Because `runtimeConfig.apiBase` is currently sourced from a public env variable, the server-side backend base URL is not yet isolated from the client-visible value.
