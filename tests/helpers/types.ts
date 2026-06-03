/**
 * Type definitions for test helpers
 * Based on actual types from the application
 */

/**
 * Auth state shape (from app/stores/auth.ts)
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading?: boolean;
}

/**
 * User shape (from actual API responses)
 */
export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Cart item shape (from app/stores/cart.ts)
 */
export interface CartItem {
  id: number;
  product_id: number;
  variant_id?: number;
  quantity: number;
  price: string;
  product: {
    id: number;
    name: string;
    slug: string;
    image?: string;
    price: string;
  };
  variant?: {
    id: number;
    name: string;
    sku: string;
    price: string;
  };
}

/**
 * Cart state shape (from app/stores/cart.ts)
 */
export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: string;
  isLoading: boolean;
}

/**
 * Product shape (from actual API responses)
 */
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: string;
  sale_price?: string;
  image?: string;
  images?: string[];
  in_stock: boolean;
  stock_quantity?: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

/**
 * Product variant shape
 */
export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  price: string;
  sale_price?: string;
  in_stock: boolean;
  stock_quantity?: number;
  attributes: Record<string, string>;
}

/**
 * Order shape (from actual API responses)
 */
export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  total: string;
  subtotal: string;
  tax?: string;
  shipping?: string;
  items: OrderItem[];
  shipping_address?: Address;
  billing_address?: Address;
  payment_method?: string;
  payment_status?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Order status enum
 */
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'refunded';

/**
 * Order item shape
 */
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id?: number;
  quantity: number;
  price: string;
  product_name: string;
  variant_name?: string;
}

/**
 * Address shape (from actual API)
 */
export interface Address {
  id?: number;
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  phone?: string;
}

/**
 * API error response shape (from actual API error handling)
 */
export interface APIError {
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

/**
 * Test user credentials
 */
export interface TestUser {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

/**
 * Test product data for fixtures
 */
export interface TestProduct {
  name: string;
  slug: string;
  price: string;
  description?: string;
  in_stock?: boolean;
}
