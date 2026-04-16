import type { ApiSuccess } from './api';
// Assumes a global ApiSuccess<T> type
// interface ApiSuccess<T> {
//   success: true;
//   data: T;
//   message: string;
// }

/**
 * Represents a single item being sent to the checkout endpoint when the user is a guest.
 */
export interface CheckoutItem {
  product_variant_id: number;
  quantity: number;
}

/**
 * Represents the payload for creating a checkout session for a guest.
 */
export interface CreateCheckoutSessionPayload {
  email: string;
  items: CheckoutItem[];
}

/**
 * This is the response type for the `createSession` endpoint. It contains the Stripe
 * session ID and the URL to redirect the user to for payment.
 */
export type CreateCheckoutSessionResponse = ApiSuccess<{
  session_id: string;
  session_url: string;
}>;

/**
 * Represents the data returned from the checkout status endpoint, used on the
 * success page to confirm the order details.
 */
export interface CheckoutStatus {
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
  order_number: string | null;
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | null;
  customer_email: string | null;
}

/**
 * This is the main response type for the checkout status endpoint.
 */
export type CheckoutStatusResponse = ApiSuccess<CheckoutStatus>;
