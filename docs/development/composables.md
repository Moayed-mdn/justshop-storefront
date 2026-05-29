# Composables

## Purpose

This document describes the current composable layer in the JustShop frontend, including responsibility boundaries, side-effect rules, and the helper overlap that already exists in the repo.

Code surfaces this file aligns with:

- `app/composables/**`
- `app/stores/**`
- `app/plugins/**`
- `app/utils/serverApi.ts`
- `shared/utils/routes.ts`

## Current Composable Inventory

The live repo currently includes these notable composables:

| Composable | Current role |
|---|---|
| `useApi.ts` | Main app-side fetch helper used by feature composables and pages |
| `useAuth.ts` | Login, register, logout, fetch-user, resend-verification, and Google auth workflow |
| `useCart.ts` | UI-friendly wrapper around the cart store with toast behavior |
| `useCheckout.ts` | Checkout session creation, success-page status lookup, and post-checkout cart clearing |
| `useOrders.ts` | Orders list, filters, detail, cancel, reorder, and guest lookup |
| `useProfile.ts` | Profile fetch, update, avatar upload, password update, and account deletion |
| `useTheme.ts` | Theme initialization and toggle surface |
| `useProductFilters.ts` | Product filter state, URL sync, and API query shaping |
| `useProduct.ts` | Products listing data fetch for the main shop listing |
| `useProductByCategory.ts` | Category-specific product listing fetch |
| `useProductDetail.ts` | Product detail and related-product fetches |
| `useAvatar.ts` | Avatar URL and initials helpers |
| `useAppToast.ts` | Shared app toast helpers |
| `useCachedData.ts` | Timestamp-based cached payload helper for async data |
| `useClientApi.ts` | Additional client-only fetch helper surface |

## Current Ownership Rules

- Put reusable feature workflows in composables instead of pages or leaf components.
- Keep composables focused on one concern, such as auth, orders, checkout, profile, theme, or product filtering.
- Use stores for durable shared state ownership and composables for ergonomic workflows around that state.
- Keep backend endpoint selection centralized through `shared/utils/routes.ts`.

## Current Side-Effect Pattern

The live repo expects composables to coordinate side effects such as:

- auth token and user handling
- cart synchronization and toasts
- locale-aware requests
- route redirects after successful flows
- async loading and error state

Current examples:

- `useAuth.ts` coordinates login, cart merge-on-login, logout cleanup, and navigation.
- `useCart.ts` wraps store actions and turns success or failure into user-facing toasts.
- `useCheckout.ts` redirects the browser to Stripe and clears frontend cart state after a successful return.
- `useProfile.ts` updates store state after profile or avatar changes.

This is the preferred boundary. Pages should orchestrate feature screens, while composables should own reusable feature workflows.

## SSR And Runtime Boundary Rules

- Guard browser-only APIs when a composable may run during SSR.
- Keep direct browser redirects, `window.location`, `localStorage`, and theme DOM mutation inside explicit client-safe paths.
- Be careful with client-only injected helpers such as `$apollo` and theme behavior. Pages and composables that depend on them must keep the same runtime assumptions visible in the current code.

## Data Access Rules

- Prefer `useApi.ts` for app-side requests that should hit internal `server/api` routes.
- Keep external backend integration behind Nitro handlers rather than bypassing `server/api/**`.
- Use composables to shape request payloads, query params, and error handling, but keep the backend proxy boundary intact.

## Shared State Rules

- Use `useState(...)` only for state that truly needs to be shared across components or routes, as in `useProductFilters.ts` and the loading flags in auth and profile flows.
- Use Pinia stores as the source of truth for auth and cart.
- Avoid creating duplicate global state when an existing store or composable already owns that concern.

## Async Data Rules

- Keep `useAsyncData` and `useLazyAsyncData` usage close to the feature-specific listing or data-loading composable, as seen in `useProduct.ts` and `useProductDetail.ts`.
- Use stable keys that include the live routing or locale dimensions that affect the result.
- Keep transform or cache helpers generic when they are cross-feature utilities, as in `useCachedData.ts`.

## Current Overlap And Debt

The composable layer already contains overlap that new work should not expand casually:

- `useApi.ts` is the primary documented fetch helper.
- `useClientApi.ts` provides another fetch helper with similar auth, locale, and toast behavior.
- `app/plugins/api.ts` injects `$api` as another global request surface.
- `app/utils/serverApi.ts` is an additional helper surface with server-style behavior.

New work should prefer the documented primary path instead of adding a fifth or sixth request abstraction.

The preferred consolidation direction for this overlap is recorded in `docs/reference/adr-001-request-helper-consolidation.md`.

## Current Inconsistencies To Contain

- `useTheme.ts` currently exposes a theme API, but the implementation forces light mode instead of performing a true light/dark toggle. This is addressed in `docs/reference/adr-005-theme-behavior-roadmap.md`.
- Some composables like `useUseProduct()` and `useUseBestSellers()` follow a redundant naming pattern that should be normalized per `docs/reference/adr-006-naming-normalization.md`.

## What Belongs In Composables

- feature workflows reused by pages or components
- request composition and result shaping
- loading and error state for a reusable feature action
- navigation or toast side effects that are part of a reusable user flow
- small derived helpers that are still tied to a feature domain

## What Should Stay Out Of Composables

- direct duplication of store state ownership
- large visual presentation logic
- brand-new global request helpers when an existing surface already owns that role
- backend route literals duplicated outside `shared/utils/routes.ts`

## Change Rules

- Update this document whenever a new composable is added, removed, renamed, or materially changes ownership.
- If request-helper overlap is reduced or consolidated later, reflect that here and in the architecture and plugin docs.
- If a composable becomes client-only by necessity, document that runtime boundary clearly here.
