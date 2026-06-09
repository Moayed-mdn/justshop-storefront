<template>
  <div class="bg-(--color-bg-card) rounded-lg border border-(--color-border-default) overflow-hidden">
    <div class="px-6 py-4 border-b border-(--color-border-subtle)">
      <h2 class="font-semibold text-(--color-text-primary)">
        {{ items.length }} {{ items.length === 1 ? $t('cart.item') : $t('cart.items') }}
      </h2>
    </div>

    <div class="divide-y divide-(--color-border-subtle)">
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
