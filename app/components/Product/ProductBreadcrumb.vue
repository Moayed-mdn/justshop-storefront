<template>
    <div class="bg-gray-50 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav class="flex items-center gap-2 text-sm text-gray-500">
          <NuxtLinkLocale to="/" class="hover:text-[#003D29]">
            {{ $t('product.breadcrumb_home') }}
          </NuxtLinkLocale>
          <span>/</span>
          <NuxtLinkLocale to="/products" class="hover:text-[#003D29]">
            {{ $t('product.breadcrumb_shop') }}
          </NuxtLinkLocale>
          <span>/</span>
          <span class="text-gray-900 font-medium truncate max-w-[200px]">
            {{ productName }}
          </span>
        </nav>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    productName: string
  }>()
  </script>