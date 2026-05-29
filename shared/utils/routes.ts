/**
 * Centralized route definitions for the application.
 * Using `as const` ensures strict type safety when referencing these routes.
 */

import { STOREFRONT_ROUTE_PATHS } from './storefront-routes'

/**
 * App-facing API routes (Nuxt/Nitro internal handlers)
 * These are the endpoints the frontend calls (via useApi)
 */
export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    emailResend: '/api/auth/email/resend',
    emailVerify: (id: string | number, hash: string) => `/api/auth/email/verify/${id}/${hash}`,
    googleCallback: '/api/auth/google/callback',
    googleRedirect: '/api/auth/google/redirect',
    passwordForgot: '/api/auth/password/forgot',
    passwordReset: '/api/auth/password/reset',
  },
  cart: {
    index: '/api/cart',
    clear: '/api/cart/clear',
    items: '/api/cart/items',
    bulk: '/api/cart/bulk',
    item: (itemId: string | number) => `/api/cart/items/${itemId}`,
  },
  products: {
    index: '/api/products',
    category: (slug: string) => `/api/products/category/${slug}`,
    detail: (slug: string) => `/api/products/${slug}`,
    related: (slug: string) => `/api/products/${slug}/related`,
    bestSeller: '/api/best_seller',
    hero: '/api/hero',
  },
  orders: {
    index: '/api/orders',
    filters: '/api/orders/filters',
    guestLookup: '/api/orders/guest/lookup',
    detail: (orderNumber: string | number) => `/api/orders/${orderNumber}`,
    cancel: (orderNumber: string | number) => `/api/orders/${orderNumber}/cancel`,
    reorder: (orderNumber: string | number) => `/api/orders/${orderNumber}/reorder`,
  },
  profile: {
    index: '/api/profile',
    avatar: '/api/profile/avatar',
    info: '/api/profile/info',
    password: '/api/profile/password',
  },
  storefront: {
    runtime: {
      resolve: '/api/storefront/runtime/resolve',
      page: (id: string) => `/api/storefront/runtime/page/${id}`,
      navigation: '/api/storefront/runtime/navigation',
      theme: '/api/storefront/runtime/theme',
      previewValidate: '/api/storefront/runtime/preview/validate',
    },
  },
  search: '/api/search',
  checkout: {
    session: '/api/checkout/session',
    sessionAuth: '/api/checkout/session/auth',
    status: (sessionId: string) => `/api/checkout/status/${sessionId}`,
  }
} as const;

/**
 * External Backend API routes (Laravel/JustShop Backend)
 * These are the routes defined in the backend `php artisan route:list`
 * Used by Nitro server to proxy requests.
 */
export const EXTERNAL_API_ROUTES = {
  auth: {
    login: 'auth/login',
    register: 'auth/register',
    logout: 'auth/logout',
    me: 'auth/me',
    emailResend: 'auth/email/resend',
    emailVerify: (id: string | number, hash: string) => `auth/email/verify/${id}/${hash}`,
    googleCallback: 'auth/google/callback',
    googleRedirect: 'auth/google/redirect',
    passwordForgot: 'auth/password/forgot',
    passwordReset: 'auth/password/reset',
  },
  cart: {
    show: 'cart',
    clear: 'cart/clear',
    addItem: 'cart/items',
    bulk: 'cart/bulk',
    updateItem: (itemId: string | number) => `cart/items/${itemId}`,
    removeItem: (itemId: string | number) => `cart/items/${itemId}`,
  },
  categories: {
    breadcrumb: (category: string) => `categories/${category}/breadcrumb`,
  },
  checkout: {
    session: 'checkout/session',
    sessionAuth: 'checkout/session/auth',
    status: (sessionId: string) => `checkout/status/${sessionId}`,
  },
  homepage: {
    bestSeller: 'homepage/best-seller',
    hero: 'homepage/hero',
  },
  orders: {
    index: 'orders',
    filters: 'orders/filters',
    guestLookup: 'orders/guest/lookup',
    show: (orderNumber: string | number) => `orders/${orderNumber}`,
    cancel: (orderNumber: string | number) => `orders/${orderNumber}/cancel`,
    reorder: (orderNumber: string | number) => `orders/${orderNumber}/reorder`,
  },
  products: {
    index: 'products',
    category: (slug: string) => `products/category/${slug}`,
    show: (slug: string) => `products/${slug}`,
    related: (slug: string) => `products/${slug}/related`,
  },
  profile: {
    show: 'profile',
    destroy: 'profile',
    updateAvatar: 'profile/avatar',
    updateInfo: 'profile/info',
    updatePassword: 'profile/password',
  },
  storefront: {
    runtime: {
      resolve: 'storefront/runtime/resolve',
      page: (id: string) => `storefront/runtime/page/${id}`,
      navigation: 'storefront/runtime/navigation',
      theme: 'storefront/runtime/theme',
      previewValidate: 'storefront/runtime/preview/validate',
    },
  },
  search: {
    index: 'search',
  },
} as const;

/**
 * Application page routes (Frontend navigation)
 */
/** @deprecated Prefer `STOREFRONT_ROUTE_PATHS` and `useStorefrontRoutes()` for storefront navigation. */
export const APP_ROUTES = {
  home: STOREFRONT_ROUTE_PATHS.home,
  login: STOREFRONT_ROUTE_PATHS.login,
  register: STOREFRONT_ROUTE_PATHS.register,
  profile: STOREFRONT_ROUTE_PATHS.profile,
  cart: STOREFRONT_ROUTE_PATHS.cart,
  search: STOREFRONT_ROUTE_PATHS.search,
  checkout: STOREFRONT_ROUTE_PATHS.checkout,
  orders: STOREFRONT_ROUTE_PATHS.orders,
  products: {
    /** @deprecated Use `STOREFRONT_ROUTE_PATHS.shop` */
    index: STOREFRONT_ROUTE_PATHS.shop,
    category: STOREFRONT_ROUTE_PATHS.category,
    detail: STOREFRONT_ROUTE_PATHS.product,
  },
  verifyEmail: STOREFRONT_ROUTE_PATHS.verifyEmail,
} as const;

export type ApiRoutes = typeof API_ROUTES;
export type ExternalApiRoutes = typeof EXTERNAL_API_ROUTES;
export type AppRoutes = typeof APP_ROUTES;
