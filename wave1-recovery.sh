#!/usr/bin/env bash
# ==============================================================================
# JustShop Storefront Commerce Consolidation Program
# Wave 1 — Canonical Route Recovery
# ==============================================================================
#
# What this script fixes:
#   [1] shared/utils/storefront-routes.ts
#         • product path: /shop/product/:slug  →  /products/:slug
#         • category path: /shop/category/:slug  →  /products/category/:slug
#         • adds legacy 301 redirects for both old /shop/* patterns
#   [2] app/components/orders/OrdersOrderBreadcrumb.vue
#         • replaces hardcoded to="/orders" with :to="routes.orders()"
#   [3] app/components/orders/OrdersOrderHeader.vue
#         • replaces hardcoded to="/orders" with :to="routes.orders()"
#   [4] app/components/product/ProductRelatedProducts.vue
#         • maps ProductRelated → ProductDto (not the old ProductCard type)
#         • fixes :key from product.product_id to product.id
#   [5] server/middleware/log.ts
#         • wraps request logging in import.meta.dev guard
#   [6] docs/refactoring-plan/wave1-canonical-route-recovery.md
#         • migration log for this wave
#
# Usage:
#   bash wave1-canonical-route-recovery.sh
#
# Rollback:
#   All originals are copied to backup/wave1-<TIMESTAMP>/ before any write.
# ==============================================================================

set -euo pipefail

ROOT="/home/leader/projects/laravel/tenant/justshop-frontend"
TS="$(date +%Y%m%d-%H%M%S)"
BACKUP="${ROOT}/backup/wave1-${TS}"

cd "$ROOT" || { echo "ERROR: cannot cd to $ROOT"; exit 1; }
mkdir -p "$BACKUP"

bak() {
  local rel="$1"
  local abs="${ROOT}/${rel}"
  if [[ -f "$abs" ]]; then
    local name
    name="$(printf '%s' "$rel" | tr '/' '_')"
    cp "$abs" "${BACKUP}/${name}"
    echo "    backup: $name"
  fi
  mkdir -p "$(dirname "$abs")"
}

step() { echo ""; echo "▶ [$1/6] $2"; }

echo ""
echo "══════════════════════════════════════════════════════════════════"
echo "  JustShop Commerce Consolidation — Wave 1: Canonical Route Recovery"
echo "  Timestamp : $TS"
echo "  Root      : $ROOT"
echo "  Backup    : $BACKUP"
echo "══════════════════════════════════════════════════════════════════"

# ==============================================================================
# 1. shared/utils/storefront-routes.ts
# ==============================================================================
step 1 "shared/utils/storefront-routes.ts — fix canonical paths + add legacy redirects"
bak "shared/utils/storefront-routes.ts"

cat > "${ROOT}/shared/utils/storefront-routes.ts" << 'STOREFRONT_ROUTES_END'
/**
 * Canonical storefront page paths (locale-neutral).
 * Localized URLs are produced by `useStorefrontRoutes()` via `localePath`.
 *
 * Wave 1 changes (canonical-route-recovery):
 *   - product:  /shop/product/:slug  →  /products/:slug
 *   - category: /shop/category/:slug →  /products/category/:slug
 *   - Added legacy-shop-category-path and legacy-shop-product-path redirects
 *
 * @see docs/architecture/storefront-routes.md
 * @see docs/refactoring-plan/wave1-canonical-route-recovery.md
 * @see docs/refactoring-plan/storefront-commerce-consolidation-execution-plan.md §62
 */

export const STOREFRONT_ROUTE_PATHS = {
  home: '/',
  shop: '/shop',
  search: '/search',
  cart: '/cart',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  profile: '/profile',

  /**
   * Canonical category page route.
   * Matches the Laravel runtime resolver's category resolution pattern.
   *
   * @example routes.category('electronics') → '/products/category/electronics'
   */
  category: (slug: string) => `/products/category/${encodeURIComponent(slug)}`,

  /**
   * Canonical product detail route.
   * Matches the Laravel runtime resolver's product resolution pattern.
   *
   * @example routes.product('running-sneakers') → '/products/running-sneakers'
   */
  product: (slug: string) => `/products/${encodeURIComponent(slug)}`,

  orders: {
    index: '/orders',
    detail: (orderNumber: string | number) =>
      `/orders/${encodeURIComponent(String(orderNumber))}`,
    track: '/orders/track',
  },

  checkout: {
    success: '/checkout/success',
    cancel: '/checkout/cancel',
  },

  verifyEmail: (id: string | number, hash: string) =>
    `/verify-email/${encodeURIComponent(String(id))}/${encodeURIComponent(hash)}`,

  auth: {
    googleCallback: '/auth/google/callback',
  },
} as const

export type StorefrontRoutePaths = typeof STOREFRONT_ROUTE_PATHS

// ─────────────────────────────────────────────────────────────────────────────
// Legacy redirect rules — Wave 1 (Canonical Route Recovery)
//
// All redirects are HTTP 301 Permanent. Logged to console in dev only.
// Evaluated in order; first match wins.
//
// Inventory:
//   legacy-products-index          /products            → /shop
//   legacy-product-detail-segment  /products/product/:s → /products/:s
//   legacy-shop-category-path      /shop/category/:s    → /products/category/:s
//   legacy-shop-product-path       /shop/product/:s     → /products/:s
//
// Sunset target: Wave 11 (Legacy Surface Retirement)
// Owner: Team A — Runtime & Routing
// ─────────────────────────────────────────────────────────────────────────────
export const STOREFRONT_LEGACY_REDIRECTS = [
  {
    id: 'legacy-products-index',
    status: 301 as const,
    match: (path: string) => path === '/products' || path === '/products/',
    target: (path: string) => replaceLocalePrefix(path, STOREFRONT_ROUTE_PATHS.shop),
  },
  {
    id: 'legacy-product-detail-segment',
    status: 301 as const,
    match: (path: string) => /^\/products\/product\/[^/]+\/?$/.test(path),
    target: (path: string) => {
      const slug = path.replace(/^\/products\/product\//, '').replace(/\/$/, '')
      return replaceLocalePrefix(path, STOREFRONT_ROUTE_PATHS.product(slug))
    },
  },
  {
    id: 'legacy-shop-category-path',
    status: 301 as const,
    match: (path: string) => /^\/shop\/category\/[^/]+\/?$/.test(path),
    target: (path: string) => {
      const raw = path.replace(/^\/shop\/category\//, '').replace(/\/$/, '')
      const slug = decodeURIComponent(raw)
      return replaceLocalePrefix(path, STOREFRONT_ROUTE_PATHS.category(slug))
    },
  },
  {
    id: 'legacy-shop-product-path',
    status: 301 as const,
    match: (path: string) => /^\/shop\/product\/[^/]+\/?$/.test(path),
    target: (path: string) => {
      const raw = path.replace(/^\/shop\/product\//, '').replace(/\/$/, '')
      const slug = decodeURIComponent(raw)
      return replaceLocalePrefix(path, STOREFRONT_ROUTE_PATHS.product(slug))
    },
  },
] as const

export type StorefrontLegacyRedirectId = (typeof STOREFRONT_LEGACY_REDIRECTS)[number]['id']

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

const LOCALE_PREFIX_PATTERN = /^\/(ar)(?=\/|$)/

function replaceLocalePrefix(path: string, targetPath: string): string {
  const localeMatch = path.match(LOCALE_PREFIX_PATTERN)
  if (!localeMatch) {
    return targetPath
  }

  const locale = localeMatch[1]
  if (targetPath === '/') {
    return `/${locale}`
  }

  return `/${locale}${targetPath}`
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves the first matching legacy redirect rule for the given path.
 * Returns null when the path is already canonical (no redirect needed).
 */
export function resolveStorefrontLegacyRedirect(path: string): {
  id: StorefrontLegacyRedirectId
  to: string
  status: 301
} | null {
  const normalized = path.replace(/\/$/, '') || '/'

  for (const rule of STOREFRONT_LEGACY_REDIRECTS) {
    if (rule.match(normalized)) {
      return {
        id: rule.id,
        to: rule.target(normalized),
        status: rule.status,
      }
    }
  }

  return null
}

/**
 * Logs a legacy redirect event. No-op outside of development.
 */
export function logStorefrontLegacyRedirect(payload: {
  from: string
  to: string
  id: StorefrontLegacyRedirectId
  status: number
}) {
  if (import.meta.dev) {
    console.info('[storefront-route] legacy redirect', payload)
  }
}
STOREFRONT_ROUTES_END

echo "  ✓ written"

# ==============================================================================
# 2. app/components/orders/OrdersOrderBreadcrumb.vue
# ==============================================================================
step 2 "app/components/orders/OrdersOrderBreadcrumb.vue — remove hardcoded /orders"
bak "app/components/orders/OrdersOrderBreadcrumb.vue"

cat > "${ROOT}/app/components/orders/OrdersOrderBreadcrumb.vue" << 'ORDERS_BREADCRUMB_END'
<template>
  <div class="bg-white border-b border-gray-100">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <nav class="flex items-center gap-2 text-sm text-gray-500">
        <NuxtLinkLocale :to="routes.home()" class="hover:text-(--color-primary)">
          {{ $t('cart.breadcrumb_home') }}
        </NuxtLinkLocale>
        <span>/</span>
        <NuxtLinkLocale :to="routes.orders()" class="hover:text-(--color-primary)">
          {{ $t('orders.title') }}
        </NuxtLinkLocale>
        <span>/</span>
        <span class="text-gray-900 font-medium font-mono">{{ orderNumber }}</span>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
const routes = useStorefrontRoutes()

defineProps<{
  orderNumber: string
}>()
</script>
ORDERS_BREADCRUMB_END

echo "  ✓ written"

# ==============================================================================
# 3. app/components/orders/OrdersOrderHeader.vue
# ==============================================================================
step 3 "app/components/orders/OrdersOrderHeader.vue — remove hardcoded /orders"
bak "app/components/orders/OrdersOrderHeader.vue"

cat > "${ROOT}/app/components/orders/OrdersOrderHeader.vue" << 'ORDERS_HEADER_END'
<template>
  <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
    <div>
      <NuxtLinkLocale
        :to="routes.orders()"
        class="text-sm text-(--color-primary) hover:underline mb-2 inline-block"
      >
        ← {{ $t('orders.back_to_orders') }}
      </NuxtLinkLocale>
      <h1
        class="text-xl sm:text-2xl font-bold"
        :style="{ color: 'var(--color-text-primary)' }"
      >
        {{ $t('orders.detail_title') }}
      </h1>
      <p
        class="text-sm mt-1 font-mono"
        :style="{ color: 'var(--color-text-muted)' }"
      >
        #{{ orderNumber }}
      </p>
    </div>

    <div class="flex flex-wrap gap-2">
      <OrderStatusBadge :status="status" type="order" />
      <OrderStatusBadge :status="paymentStatus" type="payment" />
    </div>
  </div>
</template>

<script setup lang="ts">
const routes = useStorefrontRoutes()

defineProps<{
  orderNumber: string
  status: string
  paymentStatus: string
}>()
</script>
ORDERS_HEADER_END

echo "  ✓ written"

# ==============================================================================
# 4. app/components/product/ProductRelatedProducts.vue
# ==============================================================================
step 4 "app/components/product/ProductRelatedProducts.vue — fix ProductDto mapping"
bak "app/components/product/ProductRelatedProducts.vue"

cat > "${ROOT}/app/components/product/ProductRelatedProducts.vue" << 'RELATED_PRODUCTS_END'
<template>
  <div v-if="products.length > 0" class="mt-16 border-t border-gray-200 pt-12">
    <h2 class="text-xl font-bold text-gray-900 mb-6">
      {{ $t('product.related_products') }}
    </h2>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      <ProductCard
        v-for="product in mappedProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductRelated } from '~~/types/productRelated'
import type { ProductDto } from '~/../src/core/api/dto/storefront'

const props = defineProps<{
  products: ProductRelated[]
}>()

/**
 * Maps ProductRelated (API shape) → ProductDto (component contract).
 *
 * Wave 1 fix: was incorrectly mapping to the legacy ProductCard type,
 * which caused a shape mismatch with ProductCard.vue (expects ProductDto).
 * variantId is 0 for related products that do not carry variant context.
 */
const mappedProducts = computed<ProductDto[]>(() => {
  return props.products.map((related) => ({
    id: related.id,
    variantId: 0,
    slug: related.slug,
    name: related.name,
    image: related.primary_image || '',
    price: related.price,
    currency: 'USD',
    description: related.description || '',
    categoryId: related.category_id,
  }))
})
</script>
RELATED_PRODUCTS_END

echo "  ✓ written"

# ==============================================================================
# 5. server/middleware/log.ts
# ==============================================================================
step 5 "server/middleware/log.ts — dev-only request logging"
bak "server/middleware/log.ts"

cat > "${ROOT}/server/middleware/log.ts" << 'LOG_MIDDLEWARE_END'
/**
 * Request logging middleware.
 * Restricted to development to avoid log noise in production.
 *
 * Wave 1 fix: was unconditionally logging every request.
 */
export default defineEventHandler((event) => {
  if (import.meta.dev) {
    console.log('[request]', getRequestURL(event).toString())
  }
})
LOG_MIDDLEWARE_END

echo "  ✓ written"

# ==============================================================================
# 6. docs/refactoring-plan/wave1-canonical-route-recovery.md
# ==============================================================================
step 6 "docs/refactoring-plan/wave1-canonical-route-recovery.md — migration log"
mkdir -p "${ROOT}/docs/refactoring-plan"

cat > "${ROOT}/docs/refactoring-plan/wave1-canonical-route-recovery.md" << WAVE1_DOCS_END
# Wave 1 — Canonical Route Recovery

**Program**: JustShop Storefront Commerce Consolidation  
**Wave**: 1 — Canonical Route Recovery  
**Executed**: ${TS}  
**Owner**: Team A — Runtime & Routing  
**Status**: Applied  

---

## Problem Summary

The storefront had two competing route systems for product and category pages.
The Laravel runtime resolver recognized:

- Category pages: \`/products/category/:slug\`
- Product pages:  \`/products/:slug\`

But \`shared/utils/storefront-routes.ts\` was generating:

- Category URLs: \`/shop/category/:slug\`  ← WRONG
- Product URLs:  \`/shop/product/:slug\`   ← WRONG

Any link generated via \`useStorefrontRoutes().category(slug)\` or
\`useStorefrontRoutes().product(slug)\` was pointing to paths the runtime
could not resolve, causing 404 responses for all link-driven navigation
to category and product pages.

---

## Changes Applied

### 1. \`shared/utils/storefront-routes.ts\`

| Field | Before | After |
|---|---|---|
| \`category(slug)\` | \`/shop/category/\${slug}\` | \`/products/category/\${slug}\` |
| \`product(slug)\` | \`/shop/product/\${slug}\` | \`/products/\${slug}\` |

**New legacy redirect rules added:**

| ID | Matches | Redirects to |
|---|---|---|
| \`legacy-shop-category-path\` | \`/shop/category/:slug\` | \`/products/category/:slug\` |
| \`legacy-shop-product-path\` | \`/shop/product/:slug\` | \`/products/:slug\` |

These rules are picked up automatically by
\`app/middleware/storefront-legacy-redirect.global.ts\` — no middleware
changes required.

---

### 2. \`app/components/orders/OrdersOrderBreadcrumb.vue\`

Replaced hardcoded \`to="/orders"\` with \`:to="routes.orders()"\` and
injected \`useStorefrontRoutes()\` in the script block.

---

### 3. \`app/components/orders/OrdersOrderHeader.vue\`

Replaced hardcoded \`to="/orders"\` on the back-link with
\`:to="routes.orders()"\` and injected \`useStorefrontRoutes()\`.

---

### 4. \`app/components/product/ProductRelatedProducts.vue\`

**Root cause**: component was mapping \`ProductRelated\` API objects to the
legacy \`ProductCard\` shape (snake_case fields like \`product_id\`,
\`product_name\`, \`primary_image\`), then passing them to
\`<ProductCard :product="..."\` which expects \`ProductDto\` (camelCase
fields \`id\`, \`name\`, \`image\`).

**Fix**: mapping now produces \`ProductDto\` objects:

\`\`\`
Before  product_id, product_name, primary_image  (ProductCard shape)
After   id, name, image                          (ProductDto shape)
\`\`\`

The \`:key\` attribute was also corrected from \`product.product_id\` to
\`product.id\`.

---

### 5. \`server/middleware/log.ts\`

Wrapped the per-request \`console.log\` in an \`import.meta.dev\` guard to
eliminate log noise in production and staging environments.

---

## Rollback Instructions

Originals are backed up to:

\`\`\`
backup/wave1-${TS}/
\`\`\`

To restore any single file:

\`\`\`bash
cp backup/wave1-${TS}/shared_utils_storefront-routes.ts \\
   shared/utils/storefront-routes.ts
\`\`\`

---

## Verification Checklist

After running this script, verify the following:

- [ ] \`npm run build\` succeeds without TypeScript errors
- [ ] Navigating to a category page (e.g. \`/products/category/electronics\`) renders correctly
- [ ] Navigating to a product page (e.g. \`/products/running-sneakers\`) renders correctly
- [ ] Visiting \`/shop/category/electronics\` redirects 301 to \`/products/category/electronics\`
- [ ] Visiting \`/shop/product/running-sneakers\` redirects 301 to \`/products/running-sneakers\`
- [ ] Visiting \`/products\` still redirects 301 to \`/shop\`
- [ ] Visiting \`/products/product/some-slug\` still redirects 301 to \`/products/some-slug\`
- [ ] Orders breadcrumb and back-link navigate to \`/orders\` (locale-aware)
- [ ] Related products section renders on product detail pages without console errors

---

## No-Go Conditions for Wave 2

Do not proceed to Wave 2 (Unified Shell Architecture) until:

- Route verification checklist above is fully green
- No Sev1/Sev2 regressions observed on navigation, breadcrumbs, or product links

---

## Next Wave

**Wave 2** — Storefront Shell Consolidation  
Owner doc: \`docs/refactoring-plan/storefront-commerce-consolidation-execution-plan.md §29\`

The unified shell (\`StorefrontShell.vue\`, \`StorefrontShellHeader.vue\`,
\`StorefrontShellFooter.vue\`) is already implemented. Wave 2 work focuses on:

- Verifying runtime-bridge layout variant correctly exposes auth/cart/search
- Mobile navigation parity between runtime and legacy surfaces
- Tenant branding propagation through the shell context
WAVE1_DOCS_END

echo "  ✓ written"

# ==============================================================================
# Summary
# ==============================================================================
echo ""
echo "══════════════════════════════════════════════════════════════════"
echo "  Wave 1 complete."
echo ""
echo "  Files changed:"
echo "    shared/utils/storefront-routes.ts"
echo "    app/components/orders/OrdersOrderBreadcrumb.vue"
echo "    app/components/orders/OrdersOrderHeader.vue"
echo "    app/components/product/ProductRelatedProducts.vue"
echo "    server/middleware/log.ts"
echo "    docs/refactoring-plan/wave1-canonical-route-recovery.md"
echo ""
echo "  Backups: $BACKUP"
echo ""
echo "  Next steps:"
echo "    1. npm run build               — verify no TypeScript errors"
echo "    2. npx nuxt dev                — smoke-test navigation"
echo "    3. Review wave1 docs           — docs/refactoring-plan/wave1-canonical-route-recovery.md"
echo "    4. Check verification checklist in the docs above"
echo "══════════════════════════════════════════════════════════════════"
