# Environment Variables

## Purpose

This document is the authoritative env variable catalog for the current JustShop frontend codebase.

Code surfaces this file aligns with:

- `nuxt.config.ts`
- `server/utils/api.ts`
- `app/plugins/apollo.client.ts`
- `.env.example`

## Active Variables

| Variable | Required | Scope | Current use |
|---|---|---|---|
| `NUXT_PUBLIC_API_BASE` | yes | public | Feeds `runtimeConfig.apiBase` and `runtimeConfig.public.apiBase` |
| `NUXT_PUBLIC_GRAPHQL_URL` | yes | public | Feeds `runtimeConfig.public.graphqlUrl` for Apollo search |
| `NUXT_PUBLIC_SITE_URL` | yes | public | Used by the i18n `baseUrl` setting |

## Source References

| Variable | Code references |
|---|---|
| `NUXT_PUBLIC_API_BASE` | `nuxt.config.ts`, `server/utils/api.ts`, `app/utils/serverApi.ts`, `app/composables/useAvatar.ts` |
| `NUXT_PUBLIC_GRAPHQL_URL` | `nuxt.config.ts`, `app/plugins/apollo.client.ts` |
| `NUXT_PUBLIC_SITE_URL` | `nuxt.config.ts` |

## Placeholder Values

The canonical placeholder file is `.env.example`:

```dotenv
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/v1
NUXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Rules

- Never put real secrets in `.env.example`.
- Keep every active env var documented exactly once here and listed in `.env.example`.
- Treat all `NUXT_PUBLIC_*` values as client-visible.
- Do not claim a variable exists unless current code reads it.

## Current Status

There are no additional server-only env vars visible in the current codebase beyond the values derived from these public variables.
