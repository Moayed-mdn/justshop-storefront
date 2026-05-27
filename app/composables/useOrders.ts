// composables/useOrders.ts
import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes';
import type {
  OrderListResponse,
  OrderResponse,
  Order,
  OrderStatusFilter,
  OrderFiltersResponse,
  ReorderResponse,
} from '~~/types/order';

interface OrderFiltersParams {
  status?: string | null;
  from_date?: string | null;
  to_date?: string | null;
  per_page?: number;
  page?: number;
}

export const useOrders = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ── List orders (paginated + filtered) ──
  const fetchOrders = async (filters: OrderFiltersParams = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: apiError } = await useApi<OrderListResponse>(API_ROUTES.orders.index, {
        query: filters,
      });

      if (apiError) throw apiError;

      return  data
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to load orders';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ── Get filter options with counts ──
  const fetchFilters = async (): Promise<OrderStatusFilter[]> => {
    try {
      const { data, error: apiError } = await useApi<OrderFiltersResponse>(
        API_ROUTES.orders.filters,
      );
      if (apiError) throw apiError;
      return data?.data.statuses ?? [];
    } catch {
      return [];
    }
  };

  // ── Single order detail ──
  const fetchOrder = async (orderNumber: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: apiError } = await useApi<OrderResponse>(
        API_ROUTES.orders.detail(orderNumber),
      );
      if (apiError) throw apiError;
      return data?.data;
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to load order';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ── Cancel order ──
  const cancelOrder = async (orderNumber: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: apiError } = await useApi<OrderResponse>(
        API_ROUTES.orders.cancel(orderNumber),
        {
          method: 'POST',
        },
      );
      if (apiError) throw apiError;
      return data;
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to cancel order';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ── Reorder ──
  const reorder = async (orderNumber: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: apiError } = await useApi<ReorderResponse>(
        API_ROUTES.orders.reorder(orderNumber),
        {
          method: 'POST',
        },
      );
      if (apiError) throw apiError;
      return data;
    } catch (err: any) {
      error.value = err?.data?.message || 'Failed to reorder';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ── Guest Lookup ──
  const guestLookup = async (email: string, orderNumber: string) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: apiError } = await useApi<OrderResponse>(
        API_ROUTES.orders.guestLookup,
        {
          method: 'POST',
          body: { email, order_number: orderNumber },
        },
      );
      if (apiError) throw apiError;
      return data?.data;
    } catch (err: any) {
      error.value = err?.data?.message || 'Order not found';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchOrders,
    fetchFilters,
    fetchOrder,
    cancelOrder,
    reorder,
    guestLookup,
  };
};