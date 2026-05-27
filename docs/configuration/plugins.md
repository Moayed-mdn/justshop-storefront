# Plugins

## Purpose

This document describes the current Nuxt plugins, their runtime mode, and the visible boot sequence.

Code surfaces this file aligns with:

- `app/plugins/01.auth.client.ts`
- `app/plugins/02.cart.client.ts`
- `app/plugins/api.ts`
- `app/plugins/apollo.client.ts`
- `app/plugins/theme.client.ts`

## Current Plugin Inventory

| Plugin file | Runtime | Current responsibility |
|---|---|---|
| `app/plugins/01.auth.client.ts` | client only | On startup, fetches the user when a persisted auth token exists |
| `app/plugins/02.cart.client.ts` | client only | Initializes cart state and triggers cart fetch when needed |
| `app/plugins/api.ts` | both | Injects a shared `$api` fetch instance with locale, auth header, and toast behavior |
| `app/plugins/apollo.client.ts` | client only | Injects `$apollo` configured against `config.public.graphqlUrl` |
| `app/plugins/theme.client.ts` | client only | Initializes the current theme composable |

## Boot Order Notes

The current visible ordering rules are:

1. Numeric prefixes force `01.auth.client.ts` before `02.cart.client.ts`.
2. Client-only suffixes restrict those files to browser execution.
3. `api.ts` has no suffix and can run in both server and client contexts.
4. `apollo.client.ts` is client-only and must remain client-only because search pages access `$apollo` from browser-side code.
5. `theme.client.ts` is client-only because theme initialization touches browser state.

## Injected Helpers

| Injected key | Source | Current use |
|---|---|---|
| `$api` | `app/plugins/api.ts` | Shared fetch helper with auth, locale, success toast, and error toast behavior |
| `$apollo` | `app/plugins/apollo.client.ts` | Used by `app/pages/search.vue` and `app/components/header/HeaderSearchInput.vue` |

## Current Observations

- `app/composables/useApi.ts` exists alongside injected `$api`, so the repo currently has overlapping request-helper patterns.
- `app/composables/useClientApi.ts` also exists as another helper surface, but the plan treats `useApi.ts` as the primary documented fetch helper for architecture ownership.
- `theme.client.ts` currently initializes the theme composable, but the implementation in `useTheme.ts` forces light mode instead of toggling active dark/light behavior.

The preferred consolidation direction for the overlapping request-helper surfaces is recorded in `docs/reference/adr-001-request-helper-consolidation.md`.

## Change Rules

- Update this doc when plugin files are added, removed, renamed, reordered, or change runtime suffix.
- Keep SSR/client boundary notes explicit.
- Do not introduce a new injected global helper without documenting it here.
