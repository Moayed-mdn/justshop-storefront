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
  addresses: {
    index: (storeSlug: string) => `/api/stores/${storeSlug}/addresses`,
    store: (storeSlug: string) => `/api/stores/${storeSlug}/addresses`,
    validate: (storeSlug: string) => `/api/stores/${storeSlug}/addresses/validate`,
    settings: (storeSlug: string) => `/api/stores/${storeSlug}/addresses/settings`,
    update: (storeSlug: string, addressId: string | number) => `/api/stores/${storeSlug}/addresses/${addressId}`,
    destroy: (storeSlug: string, addressId: string | number) => `/api/stores/${storeSlug}/addresses/${addressId}`,
    setDefault: (storeSlug: string, addressId: string | number) => `/api/stores/${storeSlug}/addresses/${addressId}/default`,
    setDefaultShipping: (storeSlug: string, addressId: string | number) => `/api/stores/${storeSlug}/addresses/${addressId}/set-default-shipping`,
    setDefaultBilling: (storeSlug: string, addressId: string | number) => `/api/stores/${storeSlug}/addresses/${addressId}/set-default-billing`,
    allowedCountries: (storeSlug: string) => `/api/stores/${storeSlug}/addresses/allowed-countries`,
  },
  products: {
    index: '/api/products',
    category: (slug: string) => `/api/products/category/${slug}`,
    detail: (slug: string) => `/api/products/${slug}`,
    related: (slug: string) => `/api/products/${slug}/related`,

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
      systemTemplate: (type: string) => `/api/storefront/runtime/template/${type}`,
      sectionGroups: '/api/storefront/runtime/section-groups',
    },
  },
  checkout: {
    // Enhanced checkout endpoints
    initiateEnhanced: '/api/checkout/initiate-enhanced',
    shippingMethods: '/api/checkout/shipping-methods',
    paymentIntent: '/api/checkout/payment-intent',
    completeEnhanced: '/api/checkout/complete',
    sessionAuth: '/api/checkout/session/auth',
  }
} as const;

/**
 * External Backend API routes (Laravel/JustShop Backend)
 * These are the routes defined in the backend `php artisan route:list`
 * Used by Nitro server to proxy requests.
 */
export const EXTERNAL_API_ROUTES = {
  auth: {
    login: 'customer/auth/login',
    register: 'customer/auth/register',
    logout: 'customer/auth/logout',
    me: 'customer/me',
    emailResend: 'customer/auth/email/resend',
    emailVerify: (id: string | number, hash: string) => `customer/auth/email/verify/${id}/${hash}`,
    googleCallback: 'users/auth/google/callback',
    googleRedirect: 'users/auth/google/redirect',
    passwordForgot: 'customer/auth/password/forgot',
    passwordReset: 'customer/auth/password/reset',
  },
  addresses: {
    index: (storeSlug: string) => `storefront/stores/${storeSlug}/addresses`,
    store: (storeSlug: string) => `storefront/stores/${storeSlug}/addresses`,
    validate: (storeSlug: string) => `storefront/stores/${storeSlug}/addresses/validate`,
    settings: (storeSlug: string) => `storefront/stores/${storeSlug}/addresses/settings`,
    update: (storeSlug: string, addressId: string | number) => `storefront/stores/${storeSlug}/addresses/${addressId}`,
    destroy: (storeSlug: string, addressId: string | number) => `storefront/stores/${storeSlug}/addresses/${addressId}`,
    setDefault: (storeSlug: string, addressId: string | number) => `storefront/stores/${storeSlug}/addresses/${addressId}/default`,
    setDefaultShipping: (storeSlug: string, addressId: string | number) => `storefront/stores/${storeSlug}/addresses/${addressId}/set-default-shipping`,
    setDefaultBilling: (storeSlug: string, addressId: string | number) => `storefront/stores/${storeSlug}/addresses/${addressId}/set-default-billing`,
    allowedCountries: (storeSlug: string) => `storefront/stores/${storeSlug}/addresses/allowed-countries`,
  },
  cart: {
    show: (storeSlug: string) => `storefront/stores/${storeSlug}/cart`,
    clear: (storeSlug: string) => `storefront/stores/${storeSlug}/cart/clear`,
    addItem: (storeSlug: string) => `storefront/stores/${storeSlug}/cart/items`,
    bulk: (storeSlug: string) => `storefront/stores/${storeSlug}/cart/bulk`,
    updateItem: (storeSlug: string, itemId: string | number) => `storefront/stores/${storeSlug}/cart/items/${itemId}`,
    removeItem: (storeSlug: string, itemId: string | number) => `storefront/stores/${storeSlug}/cart/items/${itemId}`,
  },
  categories: {
    breadcrumb: (category: string) => `categories/${category}/breadcrumb`,
  },
  checkout: {
    // Enhanced checkout endpoints
    initiateEnhanced: (storeSlug: string) => `storefront/stores/${storeSlug}/checkout/initiate-enhanced`,
    shippingMethods: (storeSlug: string) => `storefront/stores/${storeSlug}/checkout/shipping-methods`,
    paymentIntent: (storeSlug: string) => `storefront/stores/${storeSlug}/checkout/payment-intent`,
    completeEnhanced: (storeSlug: string) => `storefront/stores/${storeSlug}/checkout/complete`,
    sessionAuth: (storeSlug: string) => `storefront/stores/${storeSlug}/checkout/session/auth`,
  },

  orders: {
    index: (storeSlug: string) => `storefront/stores/${storeSlug}/orders`,
    filters: (storeSlug: string) => `storefront/stores/${storeSlug}/orders/filters`,
    guestLookup: 'storefront/orders/guest/lookup',
    show: (storeSlug: string, orderNumber: string | number) => `storefront/stores/${storeSlug}/orders/${orderNumber}`,
    cancel: (storeSlug: string, orderNumber: string | number) => `storefront/stores/${storeSlug}/orders/${orderNumber}/cancel`,
    reorder: (storeSlug: string, orderNumber: string | number) => `storefront/stores/${storeSlug}/orders/${orderNumber}/reorder`,
  },
  products: {
    index: (storeSlug: string) => `storefront/stores/${storeSlug}/products`,
    category: (storeSlug: string, slug: string) => `storefront/stores/${storeSlug}/products/category/${slug}`,
    show: (storeSlug: string, slug: string) => `storefront/stores/${storeSlug}/products/${slug}`,
    related: (storeSlug: string, slug: string) => `storefront/stores/${storeSlug}/products/${slug}/related`,
  },
  profile: {
    show: 'customer/me',
    destroy: 'customer/me',
    updateAvatar: 'customer/me/avatar',
    updateInfo: 'customer/me/info',
    updatePassword: 'customer/me/password',
  },
  storefront: {
    runtime: {
      resolve: 'storefront/runtime/resolve',
      page: (id: string) => `storefront/runtime/page/${id}`,
      navigation: 'storefront/runtime/navigation',
      theme: 'storefront/runtime/theme',
      previewValidate: 'storefront/runtime/preview/validate',
      systemTemplate: (type: string) => `storefront/runtime/template/${type}`,
      sectionGroups: 'storefront/runtime/section-groups',
    },
  },
  search: {
    index: (storeSlug: string) => `storefront/stores/${storeSlug}/search`,
  },
} as const;

export type ApiRoutes = typeof API_ROUTES;
export type ExternalApiRoutes = typeof EXTERNAL_API_ROUTES;
