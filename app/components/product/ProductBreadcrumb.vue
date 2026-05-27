<template>
    <div class="bg-(--color-bg-surface) border-b border-(--color-border-default)">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav class="flex items-center gap-2 text-sm text-(--color-text-secondary)">
          <NuxtLinkLocale to="/" class="hover:text-(--color-primary)">
            {{ $t('product.breadcrumb_home') }}
          </NuxtLinkLocale>
          <span>/</span>
          <NuxtLinkLocale to="/products" class="hover:text-(--color-primary)">
            {{ $t('product.breadcrumb_shop') }}
          </NuxtLinkLocale>
          <span>/</span>
          <span class="text-(--color-text-primary) font-medium truncate max-w-[200px]">
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