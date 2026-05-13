// shared/routes/orders.ts
// Order domain routes

export const orderRoutes = {
  index: () => '/orders',
  show: (orderNumber: string) => `/orders/${orderNumber}`,
  track: () => '/orders/track',
} as const;
