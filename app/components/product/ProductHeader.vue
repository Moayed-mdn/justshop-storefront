<template>
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="product-title">
        {{ product.name }}
      </h1>
  
      <div class="flex flex-wrap items-center gap-4 mt-2 text-sm">
        <div v-if="product.brand" class="flex items-center gap-1" data-testid="product-brand">
          <span class="text-gray-500">{{ $t('product.brand') }}:</span>
          <span class="font-medium text-gray-700">{{ product.brand.name }}</span>
        </div>
  
        <div v-if="product.category" class="flex items-center gap-1">
          <span class="text-gray-500">{{ $t('product.category') }}:</span>
          <NuxtLinkLocale
            data-testid="product-category"
            :to="routes.category(product.category.slug)"
            class="font-medium text-(--color-primary) hover:underline"
          >
            {{ product.category.name }}
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { ProductDetail } from '~~/types/productDetail'
  
  const routes = useStorefrontRoutes()

  defineProps<{
    product: ProductDetail
  }>()
  </script>