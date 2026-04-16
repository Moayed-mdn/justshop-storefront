<template>
    <div>
      <div v-if="showPriceRange" class="text-sm text-gray-500">
        {{ $t('product.price_from') }}
      </div>
      <UiPrice
        :price="price"
        currency="USD"
        integerClass="text-3xl font-bold text-[#003D29]"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    price: number
    showPriceRange: boolean
  }>()
  </script>