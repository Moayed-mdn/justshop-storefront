<template>
    <div
      class="border-b"
      :style="{
        background: 'var(--color-bg-page)',
        borderColor: 'var(--color-border-default)'
      }"
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav class="flex items-center gap-2 text-sm" :style="{ color: 'var(--color-text-muted)' }">
          <NuxtLinkLocale :to="routes.home()" class="hover:text-(--color-primary) transition-colors">
            {{ $t('cart.breadcrumb_home') }}
          </NuxtLinkLocale>
          <span>/</span>
          <span class="font-medium" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.title') }}</span>
        </nav>
      </div>
    </div>
  </template>

<script setup lang="ts">
const routes = useStorefrontRoutes()
</script>