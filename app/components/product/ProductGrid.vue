<script setup>
const props = defineProps(['products'])
const pending = inject('pending', ref(false))
</script>

<template>
  <div class="bg-(--product-grid-bg) h-full flex flex-col">
    <div
      v-if="pending"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-(--product-grid-gap) p-(--product-grid-padding)"
    >
    <template v-for="i in 6" :key="i">
        <ProductCardSkeleton />
      </template>
    </div>
    <ProductNoResults v-else-if="products.length === 0" />
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-(--product-grid-gap) p-(--product-grid-padding)"
    >
      <template v-for="product in products" :key="product.id">
        <ProductCard :product="product" />
      </template>
    </div>
  </div>
</template>

