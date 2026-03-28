// composables/useOrders.ts

interface OrderFilters {
    status?: string | null
    from_date?: string | null
    to_date?: string | null
    per_page?: number
    page?: number
  }
  
  interface Pagination {
    current_page: number
    total: number
    per_page: number
    last_page: number
  }
  
  export const useOrders = () => {
    const api = useClientApi()
  
    const loading = ref(false)
    const error = ref<string | null>(null)
  
    // ── List orders (paginated + filtered) ──
    const fetchOrders = async (filters: OrderFilters = {}) => {
      loading.value = true
      error.value = null
  
      try {
        // Build query params — only include non-null values
        const params: Record<string, any> = {}
        if (filters.status) params.status = filters.status
        if (filters.from_date) params.from_date = filters.from_date
        if (filters.to_date) params.to_date = filters.to_date
        if (filters.per_page) params.per_page = filters.per_page
        if (filters.page) params.page = filters.page
  
        const queryString = new URLSearchParams(params).toString()
        const url = queryString ? `/orders?${queryString}` : '/orders'
  
        const response = await api(url)
  
        return {
          orders: response.data as any[],
          pagination: response.pagination as Pagination,
        }
      } catch (err: any) {
        error.value = err?.data?.message || 'Failed to load orders'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    // ── Get filter options with counts ──
    const fetchFilters = async () => {
      try {
        const response = await api('/orders/filters')
        return response.data.statuses as { value: string | null; label: string; count: number }[]
      } catch {
        return []
      }
    }
  
    // ── Single order detail ──
    const fetchOrder = async (orderNumber: string) => {
      loading.value = true
      error.value = null
  
      try {
        const response = await api(`/orders/${orderNumber}`)
        return response.data
      } catch (err: any) {
        error.value = err?.data?.message || 'Failed to load order'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    // ── Cancel order ──
    const cancelOrder = async (orderNumber: string) => {
      loading.value = true
      error.value = null
  
      try {
        const response = await api(`/orders/${orderNumber}/cancel`, {
          method: 'POST',
        })
        return response
      } catch (err: any) {
        error.value = err?.data?.message || 'Failed to cancel order'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    // ── Reorder ──
    const reorder = async (orderNumber: string) => {
      loading.value = true
      error.value = null
  
      try {
        const response = await api(`/orders/${orderNumber}/reorder`, {
          method: 'POST',
        })
        return response
      } catch (err: any) {
        error.value = err?.data?.message || 'Failed to reorder'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    // ── Guest lookup ──
    const guestLookup = async (orderNumber: string, email: string) => {
      loading.value = true
      error.value = null
  
      try {
        const response = await api('/orders/guest/lookup', {
          method: 'POST',
          body: { order_number: orderNumber, email },
        })
        return response.data
      } catch (err: any) {
        error.value = err?.data?.message || 'Order not found'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    return {
      loading: readonly(loading),
      error: readonly(error),
      fetchOrders,
      fetchFilters,
      fetchOrder,
      cancelOrder,
      reorder,
      guestLookup,
    }
  }