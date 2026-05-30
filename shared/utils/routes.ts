/**
 * Centralized route definitions for the application.
 * Using `as const` ensures strict type safety when referencing these routes.
 */

/**
 * @deprecated Use STOREFRONT_ROUTE_PATHS and useStorefrontRoutes() from shared/utils/storefront-routes.ts instead
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
    login: 'users/auth/login',
    register: 'users/auth/register',
    logout: 'users/auth/logout',
    me: 'users/auth/me',
    emailResend: 'merchant/auth/email/resend',
    emailVerify: (id: string | number, hash: string) => `merchant/auth/email/verify/${id}/${hash}`,
    googleCallback: 'users/auth/google/callback',
    googleRedirect: 'users/auth/google/redirect',
    passwordForgot: 'merchant/auth/password/forgot',
    passwordReset: 'merchant/auth/password/reset',
  },
  cart: {
    show: (storeId: string | number) => `storefront/stores/${storeId}/cart`,
    clear: (storeId: string | number) => `storefront/stores/${storeId}/cart/clear`,
    addItem: (storeId: string | number) => `storefront/stores/${storeId}/cart/items`,
    bulk: (storeId: string | number) => `storefront/stores/${storeId}/cart/bulk`,
    updateItem: (storeId: string | number, itemId: string | number) => `storefront/stores/${storeId}/cart/items/${itemId}`,
    removeItem: (storeId: string | number, itemId: string | number) => `storefront/stores/${storeId}/cart/items/${itemId}`,
  },
  categories: {
    breadcrumb: (category: string) => `categories/${category}/breadcrumb`,
  },
  checkout: {
    session: (storeId: string | number) => `storefront/stores/${storeId}/checkout`,
    sessionAuth: (storeId: string | number) => `storefront/stores/${storeId}/checkout/confirm`,
    status: (sessionId: string) => `storefront/checkout/status/${sessionId}`,
  },
  homepage: {
    bestSeller: (storeId: string | number) => `storefront/stores/${storeId}/homepage/best-seller`,
    hero: (storeId: string | number) => `storefront/stores/${storeId}/homepage/hero`,
  },
  orders: {
    index: (storeId: string | number) => `storefront/stores/${storeId}/orders`,
    filters: (storeId: string | number) => `storefront/stores/${storeId}/orders/filters`,
    guestLookup: 'storefront/orders/guest/lookup',
    show: (storeId: string | number, orderNumber: string | number) => `storefront/stores/${storeId}/orders/${orderNumber}`,
    cancel: (storeId: string | number, orderNumber: string | number) => `storefront/stores/${storeId}/orders/${orderNumber}/cancel`,
    reorder: (storeId: string | number, orderNumber: string | number) => `storefront/stores/${storeId}/orders/${orderNumber}/reorder`,
  },
  products: {
    index: (storeId: string | number) => `storefront/stores/${storeId}/products`,
    category: (storeId: string | number, slug: string) => `storefront/stores/${storeId}/products/category/${slug}`,
    show: (storeId: string | number, slug: string) => `storefront/stores/${storeId}/products/${slug}`,
    related: (storeId: string | number, slug: string) => `storefront/stores/${storeId}/products/${slug}/related`,
  },
  profile: {
    show: 'merchant/profile',
    destroy: 'merchant/profile',
    updateAvatar: 'merchant/profile/avatar',
    updateInfo: 'merchant/profile/info',
    updatePassword: 'merchant/profile/password',
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
    index: (storeId: string | number) => `storefront/stores/${storeId}/search`,
  },
} as const;

export type ApiRoutes = typeof API_ROUTES;
export type ExternalApiRoutes = typeof EXTERNAL_API_ROUTES;
