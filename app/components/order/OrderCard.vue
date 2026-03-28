<template>
    <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span class="text-sm font-bold text-gray-900 font-mono">
            {{ $t('orders.order_number') }} #{{ order.order_number }}
          </span>
          <span class="text-xs text-gray-500">
            {{ $t('orders.placed_on') }} {{ formatDate(order.created_at) }}
          </span>
        </div>
  
        <div class="flex items-center gap-2">
          <OrderStatusBadge :status="order.status" type="order" />
          <OrderStatusBadge :status="order.payment_status" type="payment" />
        </div>
      </div>
  
      <!-- Items Preview -->
      <div class="px-4 sm:px-6 py-4">
        <div class="flex flex-wrap gap-3">
          <div
            v-for="item in visibleItems"
            :key="item.id"
            class="flex items-center gap-3 min-w-0"
          >
            <div class="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.product_name"
                class="w-full h-full object-contain"
              >
              <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16
                       16m-2-2l1.586-1.586a2 2 0 012.828
                       0L20 14m-6-6h.01M6 20h12a2 2 0
                       002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
  
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                {{ item.product_name }}
              </p>
              <p class="text-xs text-gray-500">× {{ item.quantity }}</p>
            </div>
          </div>
  
          <div
            v-if="remainingCount > 0"
            class="flex items-center justify-center w-12 h-12 rounded-md bg-gray-100 text-xs font-semibold text-gray-500"
          >
            +{{ remainingCount }}
          </div>
        </div>
      </div>
  
      <!-- Footer -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-100">
        <div class="text-sm">
          <span class="text-gray-500">{{ $t('orders.total') }}:</span>
          <span class="font-bold text-gray-900 ltr:ml-1 rtl:mr-1">{{ formatPrice(order.total) }}</span>
          <span class="text-xs text-gray-400 ltr:ml-1 rtl:mr-1">
            ({{ order.items_count }} {{ order.items_count === 1 ? $t('cart.item') : $t('cart.items') }})
          </span>
        </div>
  
        <div class="flex flex-wrap gap-2">
          <button
            v-if="order.status === 'delivered'"
            @click="$emit('reorder', order.order_number)"
            :disabled="reordering"
            class="px-3 py-1.5 text-xs font-semibold text-[#003D29] border border-[#003D29]
                   rounded-md hover:bg-[#003D29]/5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {{ reordering ? '...' : $t('orders.buy_again') }}
          </button>
  
          <button
            v-if="order.can_cancel"
            @click="$emit('cancel', order.order_number)"
            class="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200
                   rounded-md hover:bg-red-50 transition-colors cursor-pointer"
          >
            {{ $t('orders.cancel_order') }}
          </button>
  
          <NuxtLinkLocale
            :to="`/orders/${order.order_number}`"
            class="px-3 py-1.5 text-xs font-semibold text-white bg-[#003D29]
                   rounded-md hover:bg-[#00251C] transition-colors"
          >
            {{ $t('orders.view_details') }}
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    order: any
    reordering?: boolean
  }>()
  
  defineEmits<{
    (e: 'reorder', orderNumber: string): void
    (e: 'cancel', orderNumber: string): void
  }>()
  
  const visibleItems = computed(() => {
    const items = props.order.items ?? []
    return items.slice(0, 3)
  })
  
  const remainingCount = computed(() => {
    const items = props.order.items ?? []
    return Math.max(0, items.length - 3)
  })
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }
  </script>