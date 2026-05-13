// shared/routes/checkout.ts
// Checkout domain routes

export const checkoutRoutes = {
  cart: () => '/cart',
  checkout: () => '/checkout',
  success: () => '/checkout/success',
  cancel: () => '/checkout/cancel',
} as const;
