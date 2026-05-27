# ADR: Google Callback Ownership

## Status

Implemented

## Date

2026-05-27

## Context

- Google authentication callbacks currently have logic in both:
  - `app/middleware/google-auth.ts`
  - `app/pages/auth/google/callback.vue`
- This duplication makes it unclear which surface is responsible for token processing and user redirection.
- The page-based approach is preferred as it provides a visual feedback (loading/error states) during the asynchronous token verification process.

## Decision

- **Consolidate on the callback page**: `app/pages/auth/google/callback.vue` is the single source of truth for handling Google OAuth redirects.
- **Remove the middleware**: Delete `app/middleware/google-auth.ts` to prevent duplicate processing or future confusion.
- **Handle errors gracefully**: Ensure the callback page handles Laravel-side errors and missing tokens by showing user-friendly messages and providing a way back to the login page.

## Alternatives Considered

| Option | Why it was considered | Why it was not chosen |
|---|---|---|
| Use only middleware | Cleaner URL transition (immediate redirect). | No visual feedback for the user during the potentially slow backend token swap. |
| Keep both | Redundancy for safety. | High risk of "double-login" calls and race conditions in the auth store. |

## Consequences

### Benefits

- Single, predictable flow for Google authentication.
- Better user experience with visible loading and error states.
- Cleaner codebase with one less middleware to maintain.

### Trade-Offs

- Requires the user to wait on a specific page for a few moments, rather than an immediate middleware-driven redirect.

### Follow-Up Work

- [x] Delete `app/middleware/google-auth.ts`.
- [x] Verify `app/pages/auth/google/callback.vue` has all necessary logic (it already does).
- [x] Update documentation to reflect the page-based callback flow.

## Affected Code Surfaces

- `app/middleware/google-auth.ts` (Removed)
- `app/pages/auth/google/callback.vue`

## Documentation Updates Required

- `docs/reference/decisions.md`
- `docs/architecture/auth-and-security.md`
- `docs/architecture/routing-and-navigation.md`

## Verification

- [x] Attempt a Google sign-in; verify it lands on the callback page and processes correctly.
- [x] Verify that removing the middleware doesn't break any other part of the auth flow.
