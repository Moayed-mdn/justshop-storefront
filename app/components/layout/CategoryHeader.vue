<!-- components/layout/CategoryHeader.vue -->
<template>
    <div class="bg-white border-b border-gray-100">
      <div class="container mx-auto px-4 py-4 sm:py-6">
        <!-- Breadcrumb -->
        <nav
          v-if="breadcrumb?.length"
          class="flex items-center gap-2 text-sm text-gray-500 mb-3"
        >
          <NuxtLinkLocale to="/" class="hover:text-[#003D29] transition-colors">
            {{ $t('product.breadcrumb_home') }}
          </NuxtLinkLocale>
  
          <span>/</span>
  
          <NuxtLinkLocale to="/products" class="hover:text-[#003D29] transition-colors">
            {{ $t('product.breadcrumb_shop') }}
          </NuxtLinkLocale>
  
          <template v-for="(crumb, idx) in breadcrumb" :key="crumb.id">
            <span>/</span>
            <NuxtLinkLocale
              v-if="idx < breadcrumb.length - 1"
              :to="`/products/category/${crumb.slug}`"
              class="hover:text-[#003D29] transition-colors"
            >
              {{ crumb.name }}
            </NuxtLinkLocale>
            <span v-else class="text-gray-900 font-medium">
              {{ crumb.name }}
            </span>
          </template>
        </nav>
  
        <!-- Category Title -->
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
          {{ name }}
        </h1>
  
        <!-- Product Count -->
        <p v-if="totalProducts !== undefined" class="text-sm text-gray-500 mt-1">
          {{ totalProducts }} {{ totalProducts === 1 ? $t('cart.item') : $t('cart.items') }}
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    name: string
    breadcrumb?: Array<{ id: number; name: string; slug: string }>
    totalProducts?: number
  }>()
  </script>