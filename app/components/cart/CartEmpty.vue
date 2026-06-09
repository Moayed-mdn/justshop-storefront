<template>
    <div class="flex flex-col items-center justify-center py-16 px-4">
      <div class="w-24 h-24 mb-6 text-(--color-text-muted)">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293
               2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0
               100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      </div>
  
      <h2 class="text-xl font-bold text-(--color-text-primary) mb-2" style="font-family: var(--font-heading)">
        {{ $t('cart.empty_title') }}
      </h2>
  
      <p class="text-(--color-text-secondary) text-sm mb-6 text-center max-w-sm">
        {{ $t('cart.empty_description') }}
      </p>
  
      <NuxtLinkLocale
        :to="routes.home()"
        class="px-6 py-3 bg-(--color-primary) text-(--color-on-primary) font-medium rounded-md
               hover:bg-(--color-primary-hover) transition-colors"
      >
        {{ $t('cart.continue_shopping') }}
      </NuxtLinkLocale>
    </div>
  </template>

<script setup lang="ts">
const routes = useStorefrontRoutes()
</script>