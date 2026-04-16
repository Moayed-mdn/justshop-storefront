<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
    <h2 class="font-semibold text-gray-900">{{ $t('orders.order_summary') }}</h2>

    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-500">{{ $t('orders.subtotal') }}</span>
        <span class="text-gray-900">{{ formatPrice(subtotal) }}</span>
      </div>

      <div class="flex justify-between">
        <span class="text-gray-500">{{ $t('orders.shipping') }}</span>
        <span :class="shippingAmount === 0 ? 'text-green-600' : 'text-gray-900'">
          {{ shippingAmount === 0 ? $t('orders.free') : formatPrice(shippingAmount) }}
        </span>
      </div>

      <div v-if="taxAmount > 0" class="flex justify-between">
        <span class="text-gray-500">{{ $t('orders.tax') }}</span>
        <span class="text-gray-900">{{ formatPrice(taxAmount) }}</span>
      </div>

      <div v-if="discountAmount > 0" class="flex justify-between">
        <span class="text-gray-500">{{ $t('orders.discount') }}</span>
        <span class="text-green-600">-{{ formatPrice(discountAmount) }}</span>
      </div>

      <div class="border-t border-gray-200 pt-2 flex justify-between">
        <span class="font-bold text-gray-900">{{ $t('orders.total') }}</span>
        <span class="font-bold text-gray-900">{{ formatPrice(total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  subtotal: number
  shippingAmount: number
  taxAmount: number
  discountAmount: number
  total: number
  formatPrice: (price: number) => string
}>()
</script>
