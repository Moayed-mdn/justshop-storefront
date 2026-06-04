<template>
  <div
    data-testid="order-detail-summary"
    class="rounded-lg border p-6 space-y-3"
    :style="{
      background: 'var(--color-bg-page)',
      borderColor: 'var(--color-border-default)'
    }"
  >
    <h2 class="font-semibold" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.order_summary') }}</h2>

    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.subtotal') }}</span>
        <span :style="{ color: 'var(--color-text-primary)' }">{{ formatPrice(subtotal) }}</span>
      </div>

      <div class="flex justify-between">
        <span :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.shipping') }}</span>
        <span :style="shippingAmount === 0 ? { color: 'var(--color-success)' } : { color: 'var(--color-text-primary)' }">
          {{ shippingAmount === 0 ? $t('orders.free') : formatPrice(shippingAmount) }}
        </span>
      </div>

      <div v-if="taxAmount > 0" class="flex justify-between">
        <span :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.tax') }}</span>
        <span :style="{ color: 'var(--color-text-primary)' }">{{ formatPrice(taxAmount) }}</span>
      </div>

      <div v-if="discountAmount > 0" class="flex justify-between">
        <span :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.discount') }}</span>
        <span :style="{ color: 'var(--color-success)' }">-{{ formatPrice(discountAmount) }}</span>
      </div>

      <div data-testid="order-detail-total" class="border-t pt-2 flex justify-between" :style="{ borderColor: 'var(--color-border-default)' }">
        <span class="font-bold" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.total') }}</span>
        <span class="font-bold" :style="{ color: 'var(--color-text-primary)' }">{{ formatPrice(total) }}</span>
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
