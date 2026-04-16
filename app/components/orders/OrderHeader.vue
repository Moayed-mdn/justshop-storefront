<template>
  <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
    <div>
      <NuxtLinkLocale to="/orders" class="text-sm text-[#003D29] hover:underline mb-2 inline-block">
        ← {{ $t('orders.back_to_orders') }}
      </NuxtLinkLocale>
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
        {{ $t('orders.detail_title') }}
      </h1>
      <p class="text-sm text-gray-500 mt-1 font-mono">#{{ orderNumber }}</p>
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
