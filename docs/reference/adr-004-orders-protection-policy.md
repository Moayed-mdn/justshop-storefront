# ADR: Orders Route Protection Policy

## Status

Implemented

## Date

2026-05-27

## Context

- The orders area previously had inconsistent route protection:
  - `app/pages/orders/[orderNumber].vue` was protected by `auth` middleware.
  - `app/pages/orders/index.vue` had its `auth` middleware commented out.
  - `app/pages/orders/track.vue` was guest-facing for lookup by email and order number.
- This inconsistency could lead to data exposure if an authenticated user's order list was accessible without a session.

## Decision

- **Protect the main orders index**: Uncommented `middleware: 'auth'` in `app/pages/orders/index.vue`.
- **Maintain protected order details**: Ensure `app/pages/orders/[orderNumber].vue` remains protected by `auth` middleware.
- **Keep guest tracking public**: `app/pages/orders/track.vue` remains publicly accessible to allow guest lookup without a full account.
- **Clarify boundaries**: Document that the `orders` page family is hybrid, with the primary history being protected and the tracking tool being guest-safe.

## Alternatives Considered

| Option | Why it was considered | Why it was not chosen |
|---|---|---|
| Protect all order routes | Simplifies the security model. | Prevents guest users from tracking their orders, which is a required business feature. |
| Keep index public | Avoided immediate refactor work. | Risks exposing user order history if the backend does not strictly enforce session ownership for the index call. |

## Consequences

### Benefits

- Uniform security for authenticated user order history.
- Clear distinction between guest tracking and account-based history.
- Reduced risk of accidental data exposure.

### Trade-Offs

- Requires maintaining two different access models within the same route family (`orders/`).

### Follow-Up Work

- [x] Uncomment the `auth` middleware in `app/pages/orders/index.vue`.
- [x] Verify that the backend strictly validates the session for `/api/orders` index requests.
- [x] Fix any type mismatches or linter errors introduced by enabling the middleware or related types.

## Affected Code Surfaces

- `app/pages/orders/index.vue`
- `app/pages/orders/[orderNumber].vue`
- `app/pages/orders/track.vue`

## Documentation Updates Required

- `docs/reference/decisions.md`
- `docs/architecture/auth-and-security.md`
- `docs/architecture/routing-and-navigation.md`

## Verification

- [x] Attempt to access `/orders` without a session; it should redirect to login.
- [x] Attempt to access `/orders/track` without a session; it should remain accessible.
- [x] Attempt to access a specific order detail without a session; it should redirect to login.
