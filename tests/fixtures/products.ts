/**
 * Product Test Fixtures
 * 
 * Mock product data for E2E testing.
 * These should match the structure of actual API responses.
 */

import type { Product, ProductVariant } from '../helpers/types';

/**
 * Basic test product
 */
export const basicProduct: Product = {
  id: 1,
  name: 'Basic T-Shirt',
  slug: 'basic-t-shirt',
  description: 'A comfortable cotton t-shirt perfect for everyday wear.',
  short_description: 'Comfortable cotton t-shirt',
  price: '29.99',
  image: '/images/products/t-shirt.jpg',
  images: [
    '/images/products/t-shirt.jpg',
    '/images/products/t-shirt-back.jpg',
  ],
  in_stock: true,
  stock_quantity: 100,
  category: {
    id: 1,
    name: 'Clothing',
    slug: 'clothing',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * Product with variants (e.g., size, color)
 */
export const productWithVariants: Product = {
  id: 2,
  name: 'Premium Hoodie',
  slug: 'premium-hoodie',
  description: 'High-quality hoodie with multiple color and size options.',
  short_description: 'Premium quality hoodie',
  price: '59.99',
  image: '/images/products/hoodie.jpg',
  images: [
    '/images/products/hoodie.jpg',
    '/images/products/hoodie-back.jpg',
  ],
  in_stock: true,
  stock_quantity: 50,
  category: {
    id: 1,
    name: 'Clothing',
    slug: 'clothing',
  },
  variants: [
    {
      id: 1,
      product_id: 2,
      name: 'Small / Black',
      sku: 'HOODIE-S-BLK',
      price: '59.99',
      in_stock: true,
      stock_quantity: 10,
      attributes: {
        size: 'S',
        color: 'Black',
      },
    },
    {
      id: 2,
      product_id: 2,
      name: 'Medium / Black',
      sku: 'HOODIE-M-BLK',
      price: '59.99',
      in_stock: true,
      stock_quantity: 20,
      attributes: {
        size: 'M',
        color: 'Black',
      },
    },
    {
      id: 3,
      product_id: 2,
      name: 'Large / Black',
      sku: 'HOODIE-L-BLK',
      price: '59.99',
      in_stock: true,
      stock_quantity: 15,
      attributes: {
        size: 'L',
        color: 'Black',
      },
    },
    {
      id: 4,
      product_id: 2,
      name: 'Small / White',
      sku: 'HOODIE-S-WHT',
      price: '59.99',
      in_stock: true,
      stock_quantity: 5,
      attributes: {
        size: 'S',
        color: 'White',
      },
    },
  ],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * Product with sale price
 */
export const saleProduct: Product = {
  id: 3,
  name: 'Winter Jacket',
  slug: 'winter-jacket',
  description: 'Warm winter jacket, now on sale!',
  short_description: 'Warm winter jacket',
  price: '129.99',
  sale_price: '89.99',
  image: '/images/products/jacket.jpg',
  in_stock: true,
  stock_quantity: 25,
  category: {
    id: 2,
    name: 'Outerwear',
    slug: 'outerwear',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * Out of stock product
 */
export const outOfStockProduct: Product = {
  id: 4,
  name: 'Limited Edition Sneakers',
  slug: 'limited-edition-sneakers',
  description: 'Exclusive sneakers - currently out of stock.',
  short_description: 'Limited edition sneakers',
  price: '149.99',
  image: '/images/products/sneakers.jpg',
  in_stock: false,
  stock_quantity: 0,
  category: {
    id: 3,
    name: 'Footwear',
    slug: 'footwear',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * Low stock product
 */
export const lowStockProduct: Product = {
  id: 5,
  name: 'Designer Watch',
  slug: 'designer-watch',
  description: 'Elegant designer watch - only 2 left!',
  short_description: 'Elegant designer watch',
  price: '299.99',
  image: '/images/products/watch.jpg',
  in_stock: true,
  stock_quantity: 2,
  category: {
    id: 4,
    name: 'Accessories',
    slug: 'accessories',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * Product with long description (testing layout)
 */
export const detailedProduct: Product = {
  id: 6,
  name: 'Professional Camera',
  slug: 'professional-camera',
  description: `
    Professional-grade camera with advanced features including:
    
    - 24.2 megapixel full-frame sensor
    - 4K video recording at 60fps
    - ISO range of 100-51200 (expandable to 102400)
    - 61-point autofocus system
    - Weather-sealed magnesium alloy body
    - Dual card slots (SD and CF)
    - Built-in Wi-Fi and GPS
    - 3.2" touchscreen LCD
    - Battery life: 900 shots per charge
    
    Includes: Camera body, battery, charger, strap, USB cable, and user manual.
    
    Perfect for professional photographers and serious enthusiasts.
  `,
  short_description: 'Professional 24.2MP full-frame camera',
  price: '2499.99',
  image: '/images/products/camera.jpg',
  images: [
    '/images/products/camera.jpg',
    '/images/products/camera-back.jpg',
    '/images/products/camera-top.jpg',
    '/images/products/camera-lens.jpg',
  ],
  in_stock: true,
  stock_quantity: 10,
  category: {
    id: 5,
    name: 'Electronics',
    slug: 'electronics',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * All test products
 */
export const testProducts: Product[] = [
  basicProduct,
  productWithVariants,
  saleProduct,
  outOfStockProduct,
  lowStockProduct,
  detailedProduct,
];

/**
 * Get product by ID
 */
export function getProductById(id: number): Product | undefined {
  return testProducts.find((p) => p.id === id);
}

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
  return testProducts.find((p) => p.slug === slug);
}

/**
 * Get in-stock products
 */
export function getInStockProducts(): Product[] {
  return testProducts.filter((p) => p.in_stock);
}

/**
 * Get products on sale
 */
export function getSaleProducts(): Product[] {
  return testProducts.filter((p) => p.sale_price);
}
