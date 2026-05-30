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
| Category | `/shop/category/:slug` |
| Product | `/shop/product/:slug` |
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
- `/products/category/:slug` → `/shop/category/:slug`
- `/products/product/:slug` → `/shop/product/:slug`
- `/products/:slug` → `/shop/product/:slug`

The live Laravel runtime resolver currently canonicalizes category and product detail traffic to the `/shop/**` family. Frontend route helpers and compatibility redirects therefore align with `/shop/category/:slug` and `/shop/product/:slug` until the backend/runtime contract is updated again.
