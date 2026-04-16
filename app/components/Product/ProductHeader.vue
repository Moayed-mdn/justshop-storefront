<template>
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
        {{ product.name }}
      </h1>
  
      <div class="flex flex-wrap items-center gap-4 mt-2 text-sm">
        <div v-if="product.brand" class="flex items-center gap-1">
          <span class="text-gray-500">{{ $t('product.brand') }}:</span>
          <span class="font-medium text-gray-700">{{ product.brand.name }}</span>
        </div>
  
        <div v-if="product.category" class="flex items-center gap-1">
          <span class="text-gray-500">{{ $t('product.category') }}:</span>
          <NuxtLinkLocale
            :to="`/products/category/${product.category.slug}`"
            class="font-medium text-[#003D29] hover:underline"
          >
            {{ product.category.name }}
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { ProductDetail } from '~~/types/productDetail'
  
  defineProps<{
    product: ProductDetail
  }>()
  </script>