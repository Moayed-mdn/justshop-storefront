# Wave 1 — Canonical Route Recovery

**Program**: JustShop Storefront Commerce Consolidation  
**Wave**: 1 — Canonical Route Recovery  
**Executed**: 20260529-213306  
**Owner**: Team A — Runtime & Routing  
**Status**: Applied  

---

## Problem Summary

The storefront had two competing route systems for product and category pages.
The Laravel runtime resolver recognized:

- Category pages: `/products/category/:slug`
- Product pages:  `/products/:slug`

But `shared/utils/storefront-routes.ts` was generating:

- Category URLs: `/shop/category/:slug`  ← WRONG
- Product URLs:  `/shop/product/:slug`   ← WRONG

Any link generated via `useStorefrontRoutes().category(slug)` or
`useStorefrontRoutes().product(slug)` was pointing to paths the runtime
could not resolve, causing 404 responses for all link-driven navigation
to category and product pages.

---

## Changes Applied

### 1. `shared/utils/storefront-routes.ts`

| Field | Before | After |
|---|---|---|
| `category(slug)` | `/shop/category/${slug}` | `/products/category/${slug}` |
| `product(slug)` | `/shop/product/${slug}` | `/products/${slug}` |

**New legacy redirect rules added:**

| ID | Matches | Redirects to |
|---|---|---|
| `legacy-shop-category-path` | `/shop/category/:slug` | `/products/category/:slug` |
| `legacy-shop-product-path` | `/shop/product/:slug` | `/products/:slug` |

These rules are picked up automatically by
`app/middleware/storefront-legacy-redirect.global.ts` — no middleware
changes required.

---

### 2. `app/components/orders/OrdersOrderBreadcrumb.vue`

Replaced hardcoded `to="/orders"` with `:to="routes.orders()"` and
injected `useStorefrontRoutes()` in the script block.

---

### 3. `app/components/orders/OrdersOrderHeader.vue`

Replaced hardcoded `to="/orders"` on the back-link with
`:to="routes.orders()"` and injected `useStorefrontRoutes()`.

---

### 4. `app/components/product/ProductRelatedProducts.vue`

**Root cause**: component was mapping `ProductRelated` API objects to the
legacy `ProductCard` shape (snake_case fields like `product_id`,
`product_name`, `primary_image`), then passing them to
`<ProductCard :product="..."` which expects `ProductDto` (camelCase
fields `id`, `name`, `image`).

**Fix**: mapping now produces `ProductDto` objects:

```
Before  product_id, product_name, primary_image  (ProductCard shape)
After   id, name, image                          (ProductDto shape)
```

The `:key` attribute was also corrected from `product.product_id` to
`product.id`.

---

### 5. `server/middleware/log.ts`

Wrapped the per-request `console.log` in an `import.meta.dev` guard to
eliminate log noise in production and staging environments.

---

## Rollback Instructions

Originals are backed up to:

```
backup/wave1-20260529-213306/
```

To restore any single file:

```bash
cp backup/wave1-20260529-213306/shared_utils_storefront-routes.ts \
   shared/utils/storefront-routes.ts
```

---

## Verification Checklist

After running this script, verify the following:

- [ ] `npm run build` succeeds without TypeScript errors
- [ ] Navigating to a category page (e.g. `/products/category/electronics`) renders correctly
- [ ] Navigating to a product page (e.g. `/products/running-sneakers`) renders correctly
- [ ] Visiting `/shop/category/electronics` redirects 301 to `/products/category/electronics`
- [ ] Visiting `/shop/product/running-sneakers` redirects 301 to `/products/running-sneakers`
- [ ] Visiting `/products` still redirects 301 to `/shop`
- [ ] Visiting `/products/product/some-slug` still redirects 301 to `/products/some-slug`
- [ ] Orders breadcrumb and back-link navigate to `/orders` (locale-aware)
- [ ] Related products section renders on product detail pages without console errors

---

## No-Go Conditions for Wave 2

Do not proceed to Wave 2 (Unified Shell Architecture) until:

- Route verification checklist above is fully green
- No Sev1/Sev2 regressions observed on navigation, breadcrumbs, or product links

---

## Next Wave

**Wave 2** — Storefront Shell Consolidation  
Owner doc: `docs/refactoring-plan/storefront-commerce-consolidation-execution-plan.md §29`

The unified shell (`StorefrontShell.vue`, `StorefrontShellHeader.vue`,
`StorefrontShellFooter.vue`) is already implemented. Wave 2 work focuses on:

- Verifying runtime-bridge layout variant correctly exposes auth/cart/search
- Mobile navigation parity between runtime and legacy surfaces
- Tenant branding propagation through the shell context
