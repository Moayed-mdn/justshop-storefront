# ADR: Request Helper Consolidation

## Status

Implemented

## Date

2026-05-27

## Context

- The app previously exposed multiple REST request-helper surfaces across `app/composables/useApi.ts`, `app/composables/useClientApi.ts`, `app/plugins/api.ts`, and `app/utils/serverApi.ts`.
- This duplication created ambiguity about which helper to use and where shared logic (auth headers, locale, error toasts) should reside.
- `useApi()` was already the most used helper in the app, while the others represented undocumented overlap or legacy debt.

## Decision

- **Standardize on `useApi()`**: Made `app/composables/useApi.ts` the primary documented helper for all app-side REST calls.
- **Enhanced `useApi()`**: Expanded `useApi()` to support the `successMessage` and `showError` options originally found in the overlapping helpers.
- **Keep Nitro separate**: Maintained `server/utils/api.ts` as the canonical helper for Nitro server routes.
- **Clean up legacy overlap**: Deleted `app/composables/useClientApi.ts`, `app/utils/serverApi.ts`, and `app/plugins/api.ts` (along with the `$api` global type) to eliminate duplication.

## Alternatives Considered

| Option | Why it was considered | Why it was not chosen |
|---|---|---|
| Standardize on injected `$api` | Injected plugins are a standard Nuxt pattern. | `useApi()` is more idiomatic for Nuxt 4/Composition API and already had higher adoption in this repo. |
| Keep all helper surfaces active | Avoids near-term migration churn. | Preserves ambiguity and increases maintenance cost for shared request logic. |

## Consequences

### Benefits

- Single, predictable entry point for app-side REST requests.
- Consistent handling of auth headers, locale forwarding, and error/success notifications.
- Reduced bundle size and cleaner project structure.

### Trade-Offs

- `useApi()` currently creates a new fetch instance per call, though this is safe for the current scale of the application.

### Follow-Up Work

- [x] Inventory and confirm removal of legacy helper consumers.
- [x] Expand `useApi()` with missing functionality from deleted helpers.
- [x] Delete overlapping files and types.

## Affected Code Surfaces

- `app/composables/useApi.ts`
- `app/composables/useClientApi.ts` (Removed)
- `app/plugins/api.ts` (Removed)
- `app/utils/serverApi.ts` (Removed)
- `types/global.d.ts` (Removed)
- `server/utils/api.ts`

## Documentation Updates Required

- `docs/reference/decisions.md`
- `docs/architecture/data-fetching.md`
- `docs/development/composables.md`

## Verification

- [x] Verified that no live code consumers remained for the deleted helpers.
- [x] Ran `npm run build` to confirm the removal did not break the application.
- [x] Verified that `useApi()` correctly handles success messages and error toasts.
