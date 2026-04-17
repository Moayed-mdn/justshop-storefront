<template>
    <div class="text-center py-16">
      <div class="w-20 h-20 mx-auto mb-4" :style="{ color: 'var(--color-text-muted)' }">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="1"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
      </div>
      <h2 class="text-lg font-bold" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.empty_title') }}</h2>
      <p class="text-sm mt-1" :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.empty_description') }}</p>
      <NuxtLinkLocale
        to="/"
        class="orders-empty__cta inline-block mt-4 px-6 py-2 text-sm font-medium rounded-md transition-colors"
        :style="{
          color: 'var(--color-text-inverse)',
          backgroundColor: 'var(--color-primary)'
        }"
      >
        {{ $t('orders.start_shopping') }}
      </NuxtLinkLocale>
    </div>
  </template>

  <style scoped>
  .orders-empty__cta:hover {
    background-color: var(--color-primary-hover, var(--color-primary));
  }
  </style>