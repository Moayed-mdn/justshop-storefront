# Storefront Canonical Routes

## Owner

- Path constants: `shared/utils/storefront-routes.ts`
- Locale-aware builders: `app/composables/useStorefrontRoutes.ts`
- Legacy redirects: `app/middleware/storefront-legacy-redirect.global.ts`

## Canonical paths (locale-neutral)

| Surface | Path |
|---|---|
| Home | `/` |
| Shop | `/shop` |
| Category | `/products/category/:slug` |
| Product | `/products/:slug` |
| Search | `/search` |
| Cart | `/cart` |
| Auth | `/login`, `/register`, `/verify-email/:id/:hash` |
| Profile | `/profile` |
| Orders | `/orders`, `/orders/:orderNumber`, `/orders/track` |
| Checkout returns | `/checkout/success`, `/checkout/cancel` |

## Usage

Prefer `useStorefrontRoutes()` in Vue components and middleware instead of hardcoded path strings.

`APP_ROUTES` in `shared/utils/routes.ts` re-exports these paths for transitional API callers.

## Legacy compatibility

Explicit 301 redirects (logged in development):

- `/products` → `/shop`
- `/products/product/:slug` → `/products/:slug`

Runtime resolve may also emit `/products` → `/shop` on catch-all routes (see Laravel `StorefrontRuntimeService::resolveRedirect`).
