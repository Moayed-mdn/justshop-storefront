/**
 * Canonical storefront page paths (locale-neutral).
 * Localized URLs are produced by `useStorefrontRoutes()` via `localePath`.
 *
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
  category: (slug: string) => `/shop/category/${encodeURIComponent(slug)}`,
  product: (slug: string) => `/shop/product/${encodeURIComponent(slug)}`,
  orders: {
    index: '/orders',
    detail: (orderNumber: string | number) => `/orders/${encodeURIComponent(String(orderNumber))}`,
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

/** Legacy path patterns retired during Wave 1 (compatibility redirects). */
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
] as const

export type StorefrontLegacyRedirectId = (typeof STOREFRONT_LEGACY_REDIRECTS)[number]['id']

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
