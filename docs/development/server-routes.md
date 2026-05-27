# Server Routes

## Purpose

This document describes the current `server/api` layer in the JustShop frontend and the rules for adding or changing internal Nitro route handlers.

Code surfaces this file aligns with:

- `server/api/**`
- `server/utils/api.ts`
- `server/middleware/**`
- `shared/utils/routes.ts`
- `app/composables/useApi.ts`

## Current Boundary

The live repo uses internal Nitro handlers as the app-facing API boundary for backend-integrated flows.

Current pattern:

1. frontend pages, components, and composables call internal `/api/**` routes
2. Nitro handlers in `server/api/**` map those requests to backend endpoints from `EXTERNAL_API_ROUTES`
3. `server/utils/api.ts` creates the backend fetch instance and applies locale and auth headers

This is the current approved boundary for auth, cart, profile, checkout, orders, and product data flows.

## Current Route Families

The live `server/api` tree currently includes these families:

- `auth`
- `cart`
- `checkout`
- `orders`
- `products`
- `profile`
- `search`
- homepage helpers such as `hero.get.ts` and `best_seller.get.ts`

## Current Naming Pattern

- Prefer Nuxt file-based routing with HTTP suffixes such as `.get.ts`, `.post.ts`, `.put.ts`, `.patch.ts`, and `.delete.ts`.
- Keep nested directories aligned with route families and params, such as `orders/[orderNumber]/cancel.post.ts` or `auth/email/verify/[id]/[hash].get.ts`.
- Keep app-facing route constants in `API_ROUTES` and backend mappings in `EXTERNAL_API_ROUTES`.

## Current Handler Patterns

### Simple Proxy Handlers

Many handlers only:

- read params, query, or body as needed
- create an API client with `useServerApi(event)`
- call the mapped backend route
- return the backend response directly

Examples:

- `cart.get.ts`
- `products/[slug].get.ts`
- `orders.get.ts`
- `search.get.ts`

### Body-Forwarding Mutation Handlers

Mutation handlers typically read the body and forward it unchanged to the backend route:

- `auth/login.post.ts`
- `cart/items.post.ts`
- `checkout/session.post.ts`
- `orders/[orderNumber]/cancel.post.ts`

### Query And Param Forwarding

Dynamic or signed routes pass path params and query values through to the backend:

- `auth/email/verify/[id]/[hash].get.ts`
- `checkout/status/[sessionId].get.ts`
- `products/category/[slug].get.ts`
- `orders/[orderNumber].get.ts`

### Multipart Pass-Through

`profile/avatar.post.ts` is the main current multipart edge case:

- it reads the raw body
- it forwards the incoming `content-type`
- it avoids forcing JSON encoding

Preserve this pattern for file-upload routes.

### Mixed-Method File

`profile.ts` currently handles both:

- `GET` for profile fetch
- `DELETE` for account deletion

This works in the live repo, but most of the rest of the API tree uses per-method filename suffixes. Treat `profile.ts` as a current exception, not the preferred default for new routes.

## `useServerApi()` Responsibilities

`server/utils/api.ts` currently owns the server-side fetch configuration:

- reads `runtimeConfig` from the event
- uses `config.apiBase` as the backend base URL
- derives locale from the `i18n_redirected` cookie or `accept-language`
- reads the persisted auth token from the `auth` cookie when available
- sends `Accept`, `Accept-Language`, and `Authorization` headers to the backend

Keep these concerns centralized there instead of reimplementing them in each route file.

## Response And Error Handling Reality

- Most current handlers return backend responses directly without reshaping them.
- The app-side `useApi.ts` helper currently handles client-facing error toasts for most non-500 responses.
- No richer server-side normalization layer is visible in the live repo today.
- `server/middleware/log.ts` currently logs request URLs, so there is lightweight request logging but not a full observability stack.

## Implementation Rules

- Do not bypass `server/api/**` for backend-integrated application data flows unless the architecture is explicitly changed.
- Add new route families to `shared/utils/routes.ts` before wiring pages or composables to them.
- Reuse `useServerApi(event)` instead of creating one-off backend fetch logic in route files.
- Preserve locale and auth forwarding behavior.
- Preserve raw multipart pass-through behavior for upload endpoints.
- Keep dynamic params and signed query values explicit in the handler so the route contract is easy to audit.

## Current Inconsistencies To Preserve As Debt

- `server/api/best_seller.get.ts` uses snake_case naming while most other handlers follow directory-based path segmentation.
- `profile.ts` mixes methods in one file while most routes use per-method suffix files.
- `runtimeConfig.apiBase` is still sourced from a public env value, so the server-side backend base is not truly isolated from public config.
- `app/utils/serverApi.ts` exists as another server-style helper surface outside `server/utils/api.ts`.

## Change Rules

- Update this document when route families, naming conventions, proxy behavior, or server-side error handling change.
- If a handler starts reshaping backend responses rather than returning them directly, document the contract change here.
- If multipart or streaming routes are added later, document their pass-through rules here in the same change set.
