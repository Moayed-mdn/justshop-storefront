<template>
  <div
    v-if="trackingNumber || shippedAt || deliveredAt"
    class="bg-white rounded-lg border border-gray-200 p-6"
  >
    <h2 class="font-semibold text-gray-900 mb-4">{{ $t('orders.track_order') }}</h2>

    <div class="space-y-3">
      <div v-if="trackingNumber" class="flex justify-between text-sm">
        <span class="text-gray-500">{{ $t('orders.tracking_number') }}</span>
        <span class="font-mono font-semibold text-gray-900">{{ trackingNumber }}</span>
      </div>

      <div v-if="shippedAt" class="flex justify-between text-sm">
        <span class="text-gray-500">{{ $t('orders.shipped_at') }}</span>
        <span class="text-gray-900">{{ formatDate(shippedAt) }}</span>
      </div>

      <div v-if="deliveredAt" class="flex justify-between text-sm">
        <span class="text-gray-500">{{ $t('orders.delivered_at') }}</span>
        <span class="text-gray-900">{{ formatDate(deliveredAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  trackingNumber?: string | null
  shippedAt?: string | null
  deliveredAt?: string | null
  formatDate: (dateStr: string) => string
}>()
</script>
