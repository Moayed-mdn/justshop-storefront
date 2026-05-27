# ADR: Naming and Directory Normalization

## Status

Implemented

## Date

2026-05-27

## Context

- The repository currently has inconsistent directory casing in `app/components/`:
  - `app/components/Product/**` (PascalCase)
  - `app/components/product/**` (lowercase)
- Additionally, some composables follow a redundant `useUse*` naming pattern:
  - `useUseProduct.ts`
  - `useUseBestSellers.ts`
- These inconsistencies make the codebase harder to navigate and violate the naming standards documented in `docs/development/coding-standards.md`.

## Decision

- **Standardize component directories**: All feature-scoped folders under `app/components/` must use lowercase kebab-case (e.g., `app/components/product/`).
- **Standardize composable names**: Remove redundant `use` prefixes. Composables should be named `use<Feature>.ts` (e.g., `useProduct.ts`, `useBestSellers.ts`).
- **Enforce through convention**: Future additions must follow these rules, and existing debt should be resolved in a dedicated refactor change set.

## Alternatives Considered

| Option | Why it was considered | Why it was not chosen |
|---|---|---|
| Keep current mixed casing | Avoids move/rename churn. | Makes auto-importing less predictable and violates project standards. |
| Use PascalCase for all folders | Matches Vue component naming. | Nuxt/Nitro conventions and most modern JS projects prefer kebab-case for directories. |

## Consequences

### Benefits

- Improved predictability for developers and AI agents.
- Aligns with standard Nuxt 4 directory conventions.
- Cleaner, more professional codebase.

### Trade-Offs

- Renaming directories and files can cause git history "breaks" and requires updating many import statements (though Nuxt auto-imports mitigate this).

### Follow-Up Work

- [x] Rename `app/components/Product/` to `app/components/product/` (and merge contents if both exist).
- [x] Rename `useUseProduct.ts` and `useUseBestSellers.ts` to their canonical names.
- [x] Update any explicit imports or references to these paths.

## Affected Code Surfaces

- `app/components/`
- `app/composables/`
- `docs/development/coding-standards.md`

## Documentation Updates Required

- `docs/reference/decisions.md`
- `docs/development/coding-standards.md`
- `docs/development/components.md`
- `docs/development/composables.md`

## Verification

- [x] Verify that Nuxt auto-imports still resolve correctly after renames.
- [x] Run `npm run build` to ensure no broken path references remain.
- [x] Check for duplicate component or composable registrations.
