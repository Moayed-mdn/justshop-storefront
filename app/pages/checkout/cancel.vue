<!-- pages/checkout/cancel.vue -->
<template>
    <div class="min-h-[60vh] bg-(--color-bg-page)">
      <div class="max-w-lg mx-auto px-4 py-12 sm:py-20 text-center space-y-6" data-testid="checkout-cancel-container">
  
        <!-- Icon -->
        <div class="flex justify-center">
          <div class="w-20 h-20 rounded-full bg-(--status-pending-bg) flex items-center justify-center">
            <svg class="w-10 h-10 text-(--status-pending-text)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
  
        <div>
          <h1 class="text-2xl font-bold text-(--color-text-primary)">{{ $t('checkout.cancel_title') }}</h1>
          <p class="text-(--color-text-secondary) mt-2">{{ $t('checkout.cancel_description') }}</p>
        </div>
  
        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <NuxtLinkLocale
            :to="routes.cart()"
            data-testid="checkout-return-to-cart"
            class="py-3 px-6 text-sm font-semibold text-(--color-on-primary) bg-(--color-primary)
                   rounded-md hover:bg-(--color-primary-hover) transition-colors"
          >
            {{ $t('checkout.return_to_cart') }}
          </NuxtLinkLocale>
  
          <NuxtLinkLocale
            :to="routes.home()"
            data-testid="checkout-cancel-continue-shopping"
            class="py-3 px-6 text-sm font-semibold text-(--color-text-primary) border border-(--color-border-default)
                   rounded-md hover:bg-(--color-bg-hover) transition-colors"
          >
            {{ $t('checkout.continue_shopping') }}
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const routes = useStorefrontRoutes()
  const { t } = useI18n()

  definePageMeta({
    layout: 'default',
  })

  useHead({
    title: t('checkout.cancel_title'),
    meta: [
      { name: 'description', content: t('checkout.cancel_description') },
    ],
  })
  </script>