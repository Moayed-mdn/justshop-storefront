/**
 * Canonical storefront page paths (locale-neutral).
 * Localized URLs are produced by `useStorefrontRoutes()` via `localePath`.
 *
 * @see docs/architecture/storefront-routes.md
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
   * @example routes.category('electronics') → '/shop/category/electronics'
   */
  category: (slug: string) => `/shop/category/${encodeURIComponent(slug)}`,

  /**
   * Canonical product detail route.
   * Matches the Laravel runtime resolver's product resolution pattern.
   *
   * @example routes.product('running-sneakers') → '/shop/product/running-sneakers'
   */
  product: (slug: string) => `/shop/product/${encodeURIComponent(slug)}`,

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
