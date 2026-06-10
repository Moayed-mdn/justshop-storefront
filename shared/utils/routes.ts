/**
 * Centralized route definitions for the application.
 * Using `as const` ensures strict type safety when referencing these routes.
 */

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
  },
  cart: {
    index: '/api/cart',
    clear: '/api/cart/clear',
    items: '/api/cart/items',
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
    emailResend: 'users/auth/email/resend',
    emailVerify: (id: string | number, hash: string) => `users/auth/email/verify/${id}/${hash}`,
    googleCallback: 'users/auth/google/callback',
    googleRedirect: 'users/auth/google/redirect',
    passwordForgot: 'users/auth/password/forgot',
  },
  cart: {
    show: 'users/cart',
    clear: 'users/cart/clear',
    addItem: 'users/cart/items',
    updateItem: (itemId: string | number) => `users/cart/items/${itemId}`,
    removeItem: (itemId: string | number) => `users/cart/items/${itemId}`,
  },
  categories: {
    breadcrumb: (category: string) => `users/categories/${category}/breadcrumb`,
  },
  checkout: {
    session: 'users/checkout/session',
    sessionAuth: 'users/checkout/session/auth',
    status: (sessionId: string) => `users/checkout/status/${sessionId}`,
  },
  homepage: {
    bestSeller: 'users/homepage/best-seller',
    hero: 'users/homepage/hero',
  },
  orders: {
    index: 'users/orders',
    filters: 'users/orders/filters',
    guestLookup: 'users/orders/guest/lookup',
    show: (orderNumber: string | number) => `users/orders/${orderNumber}`,
    cancel: (orderNumber: string | number) => `users/orders/${orderNumber}/cancel`,
    reorder: (orderNumber: string | number) => `users/orders/${orderNumber}/reorder`,
  },
  products: {
    index: 'users/products',
    category: (slug: string) => `users/products/category/${slug}`,
    show: (slug: string) => `users/products/${slug}`,
    related: (slug: string) => `users/products/${slug}/related`,
  },
  profile: {
    show: 'users/profile',
    destroy: 'users/profile',
    updateAvatar: 'users/profile/avatar',
    updateInfo: 'users/profile/info',
    updatePassword: 'users/profile/password',
  },
  search: {
    index: 'users/search',
  },
} as const;

/**
 * Application page routes (Frontend navigation)
 */
export const APP_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  cart: '/cart',
  search: '/search',
  checkout: {
    success: '/checkout/success',
    cancel: '/checkout/cancel',
  },
  orders: {
    index: '/orders',
    detail: (orderNumber: string | number) => `/orders/${orderNumber}`,
    track: '/orders/track',
  },
  products: {
    index: '/products',
    category: (slug: string) => `/products/category/${slug}`,
    detail: (slug: string) => `/products/product/${slug}`,
  },
  verifyEmail: (id: string | number, hash: string) => `/verify-email/${id}/${hash}`,
} as const;

export type ApiRoutes = typeof API_ROUTES;
export type ExternalApiRoutes = typeof EXTERNAL_API_ROUTES;
export type AppRoutes = typeof APP_ROUTES;
