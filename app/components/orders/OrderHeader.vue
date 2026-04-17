<template>
  <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
    <div>
      <NuxtLinkLocale to="/orders" class="text-sm text-(--color-primary) hover:underline mb-2 inline-block">
        ← {{ $t('orders.back_to_orders') }}
      </NuxtLinkLocale>
      <h1 class="text-xl sm:text-2xl font-bold" :style="{ color: 'var(--color-text-primary)' }">
        {{ $t('orders.detail_title') }}
      </h1>
      <p class="text-sm mt-1 font-mono" :style="{ color: 'var(--color-text-muted)' }">#{{ orderNumber }}</p>
    </div>

    <div class="flex flex-wrap gap-2">
      <OrderStatusBadge :status="status" type="order" />
      <OrderStatusBadge :status="paymentStatus" type="payment" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  orderNumber: string
  status: string
  paymentStatus: string
}>()
</script>
