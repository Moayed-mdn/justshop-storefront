<template>
    <div class="bg-(--color-bg-elevated) rounded-lg border border-(--color-border-default) overflow-hidden hover:shadow-sm transition-shadow">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-(--color-bg-surface) border-b border-(--color-border-default)">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span class="text-sm font-bold text-(--color-text-primary) font-mono">
            {{ $t('orders.order_number') }} #{{ order.order_number }}
          </span>
          <span class="text-xs text-(--color-text-secondary)">
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
            <div class="w-12 h-12 rounded-md overflow-hidden bg-(--color-bg-surface) flex-shrink-0">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.product_name"
                class="w-full h-full object-contain"
              >
              <div v-else class="w-full h-full flex items-center justify-center text-(--color-text-muted)">
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
              <p class="text-sm font-medium text-(--color-text-primary) truncate max-w-[150px]">
                {{ item.product_name }}
              </p>
              <p class="text-xs text-(--color-text-secondary)">× {{ item.quantity }}</p>
            </div>
          </div>
  
          <div
            v-if="remainingCount > 0"
            class="flex items-center justify-center w-12 h-12 rounded-md bg-(--color-bg-surface) text-xs font-semibold text-(--color-text-secondary)"
          >
            +{{ remainingCount }}
          </div>
        </div>
      </div>
  
      <!-- Footer -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-(--color-border-default)">
        <div class="text-sm">
          <span class="text-(--color-text-secondary)">{{ $t('orders.total') }}:</span>
          <span class="font-bold text-(--color-text-primary) ltr:ml-1 rtl:mr-1">{{ formatPrice(order.total) }}</span>
          <span class="text-xs text-(--color-text-muted) ltr:ml-1 rtl:mr-1">
            ({{ order.items_count }} {{ order.items_count === 1 ? $t('cart.item') : $t('cart.items') }})
          </span>
        </div>
  
        <div class="flex flex-wrap gap-2">
          <button
            v-if="order.status === 'delivered'"
            @click="$emit('reorder', order.order_number)"
            :disabled="reordering"
            class="px-3 py-1.5 text-xs font-semibold text-(--color-primary) border border-(--color-primary)
                   rounded-md hover:bg-(--color-primary)/5 transition-colors disabled:opacity-50 cursor-pointer"
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
            :to="orderRoutes.show(order.order_number)"
            class="px-3 py-1.5 text-xs font-semibold text-white bg-(--color-primary)
                   rounded-md hover:bg-(--green-950) transition-colors"
          >
            {{ $t('orders.view_details') }}
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { formatPrice } from '../../utils/price'
  import { formatDate as formatDateUtil } from '../../utils/date'
  import type { Order } from '~~/types/order'
  import { orderRoutes } from '~~/shared/routes/orders'
  
  const props = defineProps<{
    order: Order
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
  
  const formatDate = (dateStr: string) =>
    formatDateUtil(dateStr, undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  </script>