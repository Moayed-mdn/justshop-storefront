<template>
  <div
    v-if="trackingNumber || shippedAt || deliveredAt"
    class="rounded-lg border p-6"
    :style="{ background: 'var(--color-bg-page)', borderColor: 'var(--color-border-default)' }"
  >
    <h2 class="font-semibold mb-4" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.track_order') }}</h2>

    <div class="space-y-3">
      <div v-if="trackingNumber" class="flex justify-between text-sm">
        <span :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.tracking_number') }}</span>
        <span class="font-mono font-semibold" :style="{ color: 'var(--color-text-primary)' }">{{ trackingNumber }}</span>
      </div>

      <div v-if="shippedAt" class="flex justify-between text-sm">
        <span :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.shipped_at') }}</span>
        <span :style="{ color: 'var(--color-text-primary)' }">{{ formatDate(shippedAt) }}</span>
      </div>

      <div v-if="deliveredAt" class="flex justify-between text-sm">
        <span :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.delivered_at') }}</span>
        <span :style="{ color: 'var(--color-text-primary)' }">{{ formatDate(deliveredAt) }}</span>
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
