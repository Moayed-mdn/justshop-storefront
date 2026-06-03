<!-- pages/orders/[orderNumber].vue -->
<template>
  <div class="min-h-[60vh]" :style="{ backgroundColor: 'var(--orders-page-bg)' }">
    <OrdersOrderBreadcrumb :order-number="orderNumber" />

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <OrdersOrderLoading v-if="loading" />

      <div v-else-if="order">
        <OrdersOrderHeader
          :order-number="order.order_number"
          :status="order.status"
          :payment-status="order.payment_status"
        />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- ═══ Left: Items ═══ -->
          <div class="lg:col-span-2 space-y-4">
            <OrdersOrderItemList :items="order.items" :format-price="formatPrice" />

            <OrdersOrderTracking
              :tracking-number="order.tracking_number"
              :shipped-at="order.shipped_at"
              :delivered-at="order.delivered_at"
              :format-date="formatDate"
            />
          </div>

          <!-- ═══ Right: Summary ═══ -->
          <div class="space-y-4">
            <OrdersOrderSummary
              :subtotal="order.subtotal"
              :shipping-amount="order.shipping_amount"
              :tax-amount="order.tax_amount"
              :discount-amount="order.discount_amount"
              :total="order.total"
              :format-price="formatPrice"
            />

            <OrdersOrderShippingAddress :address-data="order.shipping_address_data" />

            <OrdersOrderActions
              :status="order.status"
              :can-cancel="order.can_cancel"
              :reordering="reordering"
              @reorder="handleReorder"
              @cancel="showCancelModal = true"
            />
          </div>
        </div>
      </div>
    </div>

    <OrdersCancelModal
      :show="showCancelModal"
      :cancelling="cancelling"
      @close="showCancelModal = false"
      @confirm="confirmCancel"
    />
  </div>
</template>
  
  <script setup lang="ts">
  import { formatPrice } from '../../utils/price'
  import { formatDate } from '../../utils/date'
  definePageMeta({
    middleware: 'auth',
  })

  useHead({
    title: t('orders.order_title', { number: orderNumber }),
    meta: [
      { name: 'description', content: t('orders.order_description') },
    ],
  })
  
  const route = useRoute()
  const { fetchOrder, cancelOrder, reorder: reorderFn, loading } = useOrders()
  const cartStore = useCartStore()
  const { showSuccessToast, showErrorToast } = useAppToast()
  const { t } = useI18n()
  const toast = useToast()
  
  const orderNumber = route.params.orderNumber as string
  const order = ref<any>(null)
  const showCancelModal = ref(false)
  const cancelling = ref(false)
  const reordering = ref(false)
  
  // ── Cancel ──
  const confirmCancel = async () => {
    cancelling.value = true
    try {
      const result = await cancelOrder(orderNumber)
      order.value = result.data
      showCancelModal.value = false
      showSuccessToast(t('orders.cancel_success'))
    } catch (err: any) {
      showErrorToast(err?.data?.message || 'Failed to cancel')
    } finally {
      cancelling.value = false
    }
  }
  
  // ── Reorder ──
  const handleReorder = async () => {
    reordering.value = true
    try {
      const result = await reorderFn(orderNumber)
      const addedCount = result.data?.added?.length ?? 0
      const failedCount = result.data?.failed?.length ?? 0
  
      await cartStore.fetchCart()
  
      if (failedCount === 0) {
        showSuccessToast(t('orders.reorder_success', { count: addedCount }))
      } else {
        toast.add({
          title: '',
          description: t('orders.reorder_partial', { added: addedCount, failed: failedCount }),
          color: 'warning',
          icon: 'i-heroicons-exclamation-triangle',
        })
      }
  
      navigateTo(useStorefrontRoutes().cart())
    } catch (err: any) {
      showErrorToast(err?.data?.message || t('orders.reorder_failed'))
    } finally {
      reordering.value = false
    }
  }
  
  // ── Load ──
  onMounted(async () => {
    try {
      order.value = await fetchOrder(orderNumber)
    } catch {
      // If order is not found, fetchOrder will throw. Redirect to the orders list.
      // A toast is not shown because the user is being redirected anyway.
      navigateTo(useStorefrontRoutes().orders())
    }
  })
  </script>