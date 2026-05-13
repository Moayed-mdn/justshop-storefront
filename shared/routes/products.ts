// shared/routes/products.ts
// Product domain routes

export const productRoutes = {
  index: () => '/products',
  show: (slug: string) => `/products/product/${slug}`,
  category: (slug: string) => `/products/category/${slug}`,
} as const;
