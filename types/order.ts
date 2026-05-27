// Assumes global ApiSuccess<T> and ApiPaginated<T> types are available.
//
// interface ApiSuccess<T> {
//   success: true;
//   data: T;
//   message: string;
// }
//
// interface ApiPaginated<T, M = Record<string, any>> {
//   success: true;
//   data: T[];
//   message: string;
//   meta: {
//     pagination: {
//       total: number;
//       per_page: number;
//       current_page: number;
//       last_page: number;
//       from: number;
//       to: number;
//     };
//   } & M;
// }

import type { ApiPaginated, ApiSuccess } from "./api";

/**
 * Represents a single attribute of a product variant in an order item (e.g., "Color: Red").
 */
export interface OrderItemAttribute {
  name: string;
  value: string;
}

/**
 * Represents a single item within an order, derived from the backend's OrderItemResource.
 */
export interface OrderItem {
  id: number;
  product_id: number;
  product_variant_id: number;
  product_name: string;
  product_slug: string | null;
  sku: string;
  image: string | null;
  unit_price: number;
  unit_discount_percentage: number;
  quantity: number;
  subtotal: number;
  attributes: OrderItemAttribute[];
  is_available: boolean;
}

/**
 * Defines the structure of the shipping address data.
 */
export interface ShippingAddress {
  name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * This is the main type for a single order, derived from the backend's OrderResource.
 */
export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total: number;
  currency: string;
  shipping_method: string;
  tracking_number: string | null;
  shipping_address_data: ShippingAddress;
  can_cancel: boolean;
  items_count: number;
  items: OrderItem[];
  shipped_at: string | null; // ISO 8601 date string
  delivered_at: string | null; // ISO 8601 date string
  created_at: string; // ISO 8601 date string
}

/**
 * Response type for the order list endpoint, using a global ApiPaginated<T> type.
 */
export type OrderListResponse = ApiPaginated<Order[]>;

/**
 * Response type for single order API calls, using a global ApiSuccess<T> type.
 */
export type OrderResponse = ApiSuccess<Order>;

/**
 * Represents a single status filter option for the order list.
 */
export interface OrderStatusFilter {
  value: OrderStatus | null;
  label: string;
  count: number;
}

/**
 * Represents the available filters for the order list.
 */
export interface OrderFilters {
  statuses: OrderStatusFilter[];
}

/**
 * Response type for the order filters endpoint.
 */
export type OrderFiltersResponse = ApiSuccess<OrderFilters>;

/**
 * Represents a single item in the result of a reorder operation.
 */
export interface ReorderResultItem {
  product_variant_id: number;
  quantity: number;
  reason?: string; // Only present for failed items
  price_changed?: boolean; // Present for added items if price changed
}

/**
 * Represents the summary of what was added to the cart during a reorder.
 */
export interface ReorderResult {
  added: ReorderResultItem[];
  failed: ReorderResultItem[];
}

/**
 * Response type for the reorder endpoint.
 */
export type ReorderResponse = ApiSuccess<ReorderResult>;