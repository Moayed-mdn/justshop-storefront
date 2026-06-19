import type { ApiSuccess } from "./api";

/**
 * Cart item attribute (e.g., "Color: Red")
 */
export interface CartItemAttribute {
  name: string;
  value: string;
}

/**
 * Product variant in cart
 */
export interface CartItemVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  image: string | null;
  attributes: CartItemAttribute[];
}

/**
 * Product in cart
 */
export interface CartItemProduct {
  id: number;
  name: string;
  slug: string;
}

/**
 * Authenticated user cart item (from API)
 */
export interface CartItem {
  id: number;
  quantity: number;
  name: string;
  image: string | null;
  price: number;
  max_quantity: number;
  product: CartItemProduct;
  variant: CartItemVariant;
  subtotal: number;
}

/**
 * Guest cart item (localStorage only)
 */
export interface GuestCartItem {
  id: string; // local_timestamp format
  quantity: number;
  name: string;
  image: string | null;
  price: number;
  max_quantity?: number;
  product: {
    id: number;
    slug?: string;  // Optional slug for product links
  };
  variant: {
    id: number;
  };
}

/**
 * Cart structure
 */
export interface Cart {
  id?: number; // Optional for guest carts
  items: CartItem[];
  total_items: number;
  total_price: number;
}

/**
 * Guest cart structure
 */
export interface GuestCart {
  items: GuestCartItem[];
  total_items: number;
  total_price: number;
}

/**
 * API response wrapper
 */
export type CartResponse = ApiSuccess<Cart>;

/**
 * Payload for adding items to cart
 */
export interface AddToCartPayload {
  product_id: number;
  product_variant_id: number;
  quantity?: number;
  name: string;
  slug?: string;  // Product slug for guest cart links
  image?: string | null;
  price: number;
  max_quantity?: number;
}