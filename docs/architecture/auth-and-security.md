# Auth And Security

## Purpose

This document describes the current auth flows, route protection behavior, and sensitive state handling in the JustShop frontend.

Code surfaces this file aligns with:

- `app/pages/login.vue`
- `app/pages/register.vue`
- `app/pages/auth/google/callback.vue`
- `app/pages/verify-email/[id]/[hash].vue`
- `app/middleware/auth.ts`
- `app/middleware/guest.ts`
- `app/middleware/google-auth.ts`
- `app/stores/auth.ts`
- `server/api/auth/**`

## Current Auth Flows

| Flow | Main files |
|---|---|
| Login | `app/pages/login.vue`, `app/composables/useAuth.ts`, `server/api/auth/login.post.ts` |
| Register | `app/pages/register.vue`, `app/composables/useAuth.ts`, `server/api/auth/register.post.ts` |
| Logout | `app/composables/useAuth.ts`, `server/api/auth/logout.post.ts` |
| Fetch current user | `app/composables/useAuth.ts`, `server/api/auth/me.get.ts` |
| Email verification | `app/pages/verify-email/[id]/[hash].vue`, `server/api/auth/email/verify/[id]/[hash].get.ts` |
| Resend verification | `app/composables/useAuth.ts`, `server/api/auth/email/resend.post.ts` |
| Google sign-in | `app/composables/useAuth.ts`, `app/middleware/google-auth.ts`, `server/api/auth/google/**` |

## Current Token Handling

- The auth store persists only the token.
- Persistence uses cookie-backed Pinia persisted state.
- App-side requests add a Bearer token when the auth store has one.
- Server-side backend proxy requests try to read the same token from the `auth` cookie.
- On 401 responses from the injected `$api` path, the auth store is cleared on the client.

## Route Protection

Current route protection behavior:

- `guest` middleware protects login and register pages from authenticated access.
- `auth` middleware protects at least `profile.vue` and `orders/[orderNumber].vue`.
- `orders/index.vue` is currently not actively protected because its auth middleware is commented out.
- Guest order tracking remains available through `orders/track.vue`.

## Current Security Rules

- Keep auth and profile flows behind internal `server/api` routes.
- Do not expose secret credentials or tokens in docs or example env files.
- Keep cookie and token handling SSR-safe.
- Treat checkout, profile, and order actions as sensitive flows when updating docs or code.

## Current Discrepancy To Track

There are two visible Google callback handling paths today:

- `app/middleware/google-auth.ts`
- `app/pages/auth/google/callback.vue`

Both process callback query parameters and call `handleGoogleCallback()`. Document this as the current state and reconcile carefully if the flow is simplified later.

The preferred single-owner direction for that cleanup is recorded in `docs/reference/adr-003-google-callback-owner.md`.
