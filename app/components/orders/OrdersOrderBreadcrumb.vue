<template>
  <div class="bg-(--color-bg-card) border-b border-(--color-border-subtle)">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <nav class="flex items-center gap-2 text-sm text-(--color-text-secondary)">
        <NuxtLinkLocale :to="routes.home()" class="hover:text-(--color-primary)">
          {{ $t('cart.breadcrumb_home') }}
        </NuxtLinkLocale>
        <span>/</span>
        <NuxtLinkLocale :to="routes.orders()" class="hover:text-(--color-primary)">
          {{ $t('orders.title') }}
        </NuxtLinkLocale>
        <span>/</span>
        <span class="text-(--color-text-primary) font-medium font-mono">{{ orderNumber }}</span>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
const routes = useStorefrontRoutes()

defineProps<{
  orderNumber: string
}>()
</script>
