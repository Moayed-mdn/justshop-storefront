<!-- pages/orders/[orderNumber].vue -->
<template>
    <div class="min-h-[60vh] bg-gray-50">
      <!-- Breadcrumb -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav class="flex items-center gap-2 text-sm text-gray-500">
            <NuxtLinkLocale to="/" class="hover:text-[#003D29]">{{ $t('cart.breadcrumb_home') }}</NuxtLinkLocale>
            <span>/</span>
            <NuxtLinkLocale to="/orders" class="hover:text-[#003D29]">{{ $t('orders.title') }}</NuxtLinkLocale>
            <span>/</span>
            <span class="text-gray-900 font-medium font-mono">{{ orderNumber }}</span>
          </nav>
        </div>
      </div>
  
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
  
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <svg class="animate-spin h-8 w-8 text-[#003D29]" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
  
        <div v-else-if="order">
          <!-- Header -->
          <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <NuxtLinkLocale to="/orders" class="text-sm text-[#003D29] hover:underline mb-2 inline-block">
                ← {{ $t('orders.back_to_orders') }}
              </NuxtLinkLocale>
              <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
                {{ $t('orders.detail_title') }}
              </h1>
              <p class="text-sm text-gray-500 mt-1 font-mono">#{{ order.order_number }}</p>
            </div>
  
            <div class="flex flex-wrap gap-2">
              <OrderStatusBadge :status="order.status" type="order" />
              <OrderStatusBadge :status="order.payment_status" type="payment" />
            </div>
          </div>
  
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- ═══ Left: Items ═══ -->
            <div class="lg:col-span-2 space-y-4">
              <!-- Order Items -->
              <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100">
                  <h2 class="font-semibold text-gray-900">
                    {{ order.items?.length }} {{ order.items?.length === 1 ? $t('cart.item') : $t('cart.items') }}
                  </h2>
                </div>
  
                <div class="divide-y divide-gray-100">
                  <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="flex gap-4 p-4 sm:p-6"
                  >
                    <!-- Image -->
                    <NuxtLinkLocale
                      :to="item.product_slug ? `/products/${item.product_slug}` : '#'"
                      class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-gray-100"
                    >
                      <img
                        v-if="item.image"
                        :src="item.image"
                        :alt="item.product_name"
                        class="w-full h-full object-contain"
                      >
                    </NuxtLinkLocale>
  
                    <!-- Details -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2">
                        <div>
                          <NuxtLinkLocale
                            :to="item.product_slug ? `/products/${item.product_slug}` : '#'"
                            class="text-sm font-semibold text-gray-900 hover:text-[#003D29] transition-colors"
                          >
                            {{ item.product_name }}
                          </NuxtLinkLocale>
  
                          <!-- Attributes -->
                          <div v-if="item.attributes?.length" class="flex flex-wrap gap-x-3 mt-1">
                            <span
                              v-for="attr in item.attributes"
                              :key="attr.name"
                              class="text-xs text-gray-500"
                            >
                              <span class="font-medium">{{ attr.name }}:</span> {{ attr.value }}
                            </span>
                          </div>
  
                          <p v-if="item.sku" class="text-xs text-gray-400 mt-1">SKU: {{ item.sku }}</p>
  
                          <!-- Availability badge -->
                          <span
                            v-if="!item.is_available"
                            class="inline-block mt-1 px-2 py-0.5 text-xs bg-red-50 text-red-600 rounded"
                          >
                            {{ $t('orders.item_unavailable') }}
                          </span>
                        </div>
  
                        <div class="text-right flex-shrink-0">
                          <p class="text-sm font-bold text-gray-900">{{ formatPrice(item.subtotal) }}</p>
                          <p class="text-xs text-gray-500">
                            {{ formatPrice(item.unit_price) }} × {{ item.quantity }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Timeline / Shipping Info -->
              <div
                v-if="order.tracking_number || order.shipped_at || order.delivered_at"
                class="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 class="font-semibold text-gray-900 mb-4">{{ $t('orders.track_order') }}</h2>
  
                <div class="space-y-3">
                  <div v-if="order.tracking_number" class="flex justify-between text-sm">
                    <span class="text-gray-500">{{ $t('orders.tracking_number') }}</span>
                    <span class="font-mono font-semibold text-gray-900">{{ order.tracking_number }}</span>
                  </div>
  
                  <div v-if="order.shipped_at" class="flex justify-between text-sm">
                    <span class="text-gray-500">{{ $t('orders.shipped_at') }}</span>
                    <span class="text-gray-900">{{ formatDate(order.shipped_at) }}</span>
                  </div>
  
                  <div v-if="order.delivered_at" class="flex justify-between text-sm">
                    <span class="text-gray-500">{{ $t('orders.delivered_at') }}</span>
                    <span class="text-gray-900">{{ formatDate(order.delivered_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- ═══ Right: Summary ═══ -->
            <div class="space-y-4">
              <!-- Price Summary -->
              <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
                <h2 class="font-semibold text-gray-900">{{ $t('orders.order_summary') }}</h2>
  
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">{{ $t('orders.subtotal') }}</span>
                    <span class="text-gray-900">{{ formatPrice(order.subtotal) }}</span>
                  </div>
  
                  <div class="flex justify-between">
                    <span class="text-gray-500">{{ $t('orders.shipping') }}</span>
                    <span :class="order.shipping_amount === 0 ? 'text-green-600' : 'text-gray-900'">
                      {{ order.shipping_amount === 0 ? $t('orders.free') : formatPrice(order.shipping_amount) }}
                    </span>
                  </div>
  
                  <div v-if="order.tax_amount > 0" class="flex justify-between">
                    <span class="text-gray-500">{{ $t('orders.tax') }}</span>
                    <span class="text-gray-900">{{ formatPrice(order.tax_amount) }}</span>
                  </div>
  
                  <div v-if="order.discount_amount > 0" class="flex justify-between">
                    <span class="text-gray-500">{{ $t('orders.discount') }}</span>
                    <span class="text-green-600">-{{ formatPrice(order.discount_amount) }}</span>
                  </div>
  
                  <div class="border-t border-gray-200 pt-2 flex justify-between">
                    <span class="font-bold text-gray-900">{{ $t('orders.total') }}</span>
                    <span class="font-bold text-gray-900">{{ formatPrice(order.total) }}</span>
                  </div>
                </div>
              </div>
  
              <!-- Shipping Address -->
              <div
                v-if="order.shipping_address_data"
                class="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 class="font-semibold text-gray-900 mb-3">{{ $t('orders.shipping_address') }}</h2>
                <div class="text-sm text-gray-600 space-y-1">
                  <p v-if="order.shipping_address_data.name" class="font-medium text-gray-900">
                    {{ order.shipping_address_data.name }}
                  </p>
                  <p v-if="order.shipping_address_data.address?.line1">
                    {{ order.shipping_address_data.address.line1 }}
                  </p>
                  <p v-if="order.shipping_address_data.address?.line2">
                    {{ order.shipping_address_data.address.line2 }}
                  </p>
                  <p>
                    {{ [
                      order.shipping_address_data.address?.city,
                      order.shipping_address_data.address?.state,
                      order.shipping_address_data.address?.postal_code
                    ].filter(Boolean).join(', ') }}
                  </p>
                  <p v-if="order.shipping_address_data.address?.country">
                    {{ order.shipping_address_data.address.country }}
                  </p>
                  <p v-if="order.shipping_address_data.phone" class="pt-1">
                    📞 {{ order.shipping_address_data.phone }}
                  </p>
                </div>
              </div>
  
              <!-- Actions -->
              <div class="space-y-2">
                <button
                  v-if="order.status === 'delivered'"
                  @click="handleReorder"
                  :disabled="reordering"
                  class="w-full py-2.5 px-4 text-sm font-semibold text-[#003D29] border border-[#003D29]
                         rounded-md hover:bg-[#003D29]/5 transition-colors disabled:opacity-50 cursor-pointer
                         flex items-center justify-center gap-2"
                >
                  <svg v-if="reordering" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {{ $t('orders.buy_again') }}
                </button>
  
                <button
                  v-if="order.can_cancel"
                  @click="showCancelModal = true"
                  class="w-full py-2.5 px-4 text-sm font-semibold text-red-600 border border-red-200
                         rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                >
                  {{ $t('orders.cancel_order') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Cancel Modal -->
      <div
        v-if="showCancelModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showCancelModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('orders.cancel_confirm_title') }}</h3>
          <p class="text-sm text-gray-500 mt-2">{{ $t('orders.cancel_confirm_message') }}</p>
          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="showCancelModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300
                     rounded-md hover:bg-gray-50 cursor-pointer"
            >
              {{ $t('orders.cancel_keep') }}
            </button>
            <button
              @click="confirmCancel"
              :disabled="cancelling"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md
                     hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              {{ cancelling ? '...' : $t('orders.cancel_confirm_button') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
  })
  
  const route = useRoute()
  const { fetchOrder, cancelOrder, reorder: reorderFn, loading } = useOrders()
  const cartStore = useCartStore()
  const toast = useToast()
  const { t } = useI18n()
  
  const orderNumber = route.params.orderNumber as string
  const order = ref<any>(null)
  const showCancelModal = ref(false)
  const cancelling = ref(false)
  const reordering = ref(false)
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  // ── Cancel ──
  const confirmCancel = async () => {
    cancelling.value = true
    try {
      const result = await cancelOrder(orderNumber)
      order.value = result.data
      showCancelModal.value = false
      toast.add({
        title: '',
        description: t('orders.cancel_success'),
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })
    } catch (err: any) {
      toast.add({
        title: '',
        description: err?.data?.message || 'Failed to cancel',
        color: 'error',
        icon: 'i-heroicons-x-circle',
      })
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
        toast.add({
          title: '',
          description: t('orders.reorder_success', { count: addedCount }),
          color: 'success',
          icon: 'i-heroicons-check-circle',
        })
      } else {
        toast.add({
          title: '',
          description: t('orders.reorder_partial', { added: addedCount, failed: failedCount }),
          color: 'warning',
          icon: 'i-heroicons-exclamation-triangle',
        })
      }
  
      navigateTo('/cart')
    } catch (err: any) {
      toast.add({
        title: '',
        description: err?.data?.message || t('orders.reorder_failed'),
        color: 'error',
        icon: 'i-heroicons-x-circle',
      })
    } finally {
      reordering.value = false
    }
  }
  
  // ── Load ──
  onMounted(async () => {
    try {
      order.value = await fetchOrder(orderNumber)
    } catch {
      navigateTo('/orders')
    }
  })
  </script>