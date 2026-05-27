# Runtime Config

## Purpose

This document explains how `runtimeConfig` is currently defined and used in the JustShop frontend.

Code surfaces this file aligns with:

- `nuxt.config.ts`
- `server/utils/api.ts`
- `app/plugins/apollo.client.ts`
- `app/utils/serverApi.ts`
- `app/composables/useAvatar.ts`

## Current Runtime Config Shape

Defined in `nuxt.config.ts`:

| Field | Current source | Visibility |
|---|---|---|
| `runtimeConfig.apiBase` | `NUXT_PUBLIC_API_BASE` | server-side field |
| `runtimeConfig.public.apiBase` | `NUXT_PUBLIC_API_BASE` | client-visible |
| `runtimeConfig.public.graphqlUrl` | `NUXT_PUBLIC_GRAPHQL_URL` | client-visible |

## Current Usage

| File | Usage |
|---|---|
| `server/utils/api.ts` | Uses `config.apiBase` as the server-side backend base URL |
| `app/plugins/apollo.client.ts` | Uses `config.public.graphqlUrl` for client-side GraphQL requests |
| `app/utils/serverApi.ts` | Uses `config.public.apiBase` in an app-side helper |
| `app/composables/useAvatar.ts` | Uses `config.public.apiBase` to derive uploaded avatar URLs |

## Public Vs Server Boundaries

Current boundary rules for this repo:

- `config.public.*` is client-visible and safe only for non-secret values.
- Server-side backend requests should prefer the server-side `config.apiBase` field, as shown in `server/utils/api.ts`.
- Client code must not assume future server-only secrets will be available through `config.public`.
- The current codebase mirrors `apiBase` into both public and server fields, but that does not make server-only guidance client-safe.

## SSR Safety Rules

- Use `useRuntimeConfig(event)` inside Nitro utilities and route handlers when server context matters.
- Use plain `useRuntimeConfig()` in app plugins and composables only for values intended to be client-visible.
- Do not document direct browser access to server-only runtime values.

## Current Limitation

The repo currently sources `runtimeConfig.apiBase` from `NUXT_PUBLIC_API_BASE`, so the server-side field is not yet separated from the public field. Treat that as a current implementation detail, not a best-practice recommendation.

The preferred cleanup direction for this boundary is recorded in `docs/reference/adr-002-api-base-runtime-boundary.md`.

## Change Rules

- Update this doc when runtime config keys are added, removed, renamed, or moved between public and private scopes.
- Keep `.env.example` and `docs/configuration/environment-variables.md` synchronized with any runtime config change.
