<template>
    <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.title') }}</h1>
        <p class="text-sm mt-1" :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.subtitle') }}</p>
      </div>
  
      <!-- Guest lookup link -->
      <NuxtLinkLocale
        :to="APP_ROUTES.orders.track"
        class="text-sm text-(--color-primary) hover:underline font-medium"
      >
        {{ $t('orders.guest_title') }}
      </NuxtLinkLocale>
    </div>
  </template>

<script setup lang="ts">
import { APP_ROUTES } from '~~/shared/utils/routes'
</script>