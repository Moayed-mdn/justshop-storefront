<template>
  <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-100">
      <h2 class="font-semibold text-gray-900">
        {{ items.length }} {{ items.length === 1 ? $t('cart.item') : $t('cart.items') }}
      </h2>
    </div>

    <div class="divide-y divide-gray-100">
      <OrderItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        :format-price="formatPrice"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderItem } from '~~/types/order'

defineProps<{
  items: OrderItem[]
  formatPrice: (price: number) => string
}>()
</script>
