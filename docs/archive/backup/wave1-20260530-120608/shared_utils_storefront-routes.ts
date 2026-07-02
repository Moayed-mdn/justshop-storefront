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
