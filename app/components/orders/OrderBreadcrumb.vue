<template>
  <div class="bg-white border-b border-gray-100">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <nav class="flex items-center gap-2 text-sm text-gray-500">
        <NuxtLinkLocale to="/" class="hover:text-(--color-primary)">{{ $t('cart.breadcrumb_home') }}</NuxtLinkLocale>
        <span>/</span>
        <NuxtLinkLocale :to="orderRoutes.index()" class="hover:text-(--color-primary)">{{ $t('orders.title') }}</NuxtLinkLocale>
        <span>/</span>
        <span class="text-gray-900 font-medium font-mono">{{ orderNumber }}</span>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { orderRoutes } from '~~/shared/routes/orders'

defineProps<{
  orderNumber: string
}>()
</script>
