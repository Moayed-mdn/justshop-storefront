/**
 * Centralized route definitions for the application.
 * Using `as const` ensures strict type safety when referencing these routes.
 */

/**
 * App-facing API routes (Nitro handlers)
 */
export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    emailResend: '/api/email/resend',
    googleCallback: '/api/auth/google/callback',
  },
  products: {
    list: '/api/products',
    detail: (slug: string) => `/api/products/${slug}`,
    related: (slug: string) => `/api/products/${slug}/related`,
    bestSeller: '/api/best_seller',
    hero: '/api/hero',
  },
} as const;

/**
 * External Backend API routes (called by Nitro server)
 */
export const EXTERNAL_API_ROUTES = {
  auth: {
    login: 'auth/login',
    register: 'auth/register',
    logout: 'auth/logout',
    me: 'auth/me',
    emailResend: 'auth/email/resend',
  },
  products: {
    list: 'products',
    detail: (slug: string) => `products/${slug}`,
    related: (slug: string) => `products/${slug}/related`,
  },
  homepage: {
    bestSeller: 'homepage/best-seller',
    hero: 'homepage/hero',
  }
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
