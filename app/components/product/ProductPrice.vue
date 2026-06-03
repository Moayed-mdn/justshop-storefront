<template>
  <div class="space-y-0.5">
    <div v-if="showPriceRange" class="text-xs font-medium uppercase tracking-wider text-gray-500">
      {{ $t('product.price_from') }}
    </div>
    <div class="flex items-baseline gap-3">
      <UiPrice
        :price="price"
        currency="USD"
        integerClass="text-3xl font-bold text-(--color-primary)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  price: number
  showPriceRange: boolean
}>()
</script>