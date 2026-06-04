<!-- pages/checkout/cancel.vue -->
<template>
    <div class="min-h-[60vh] bg-gray-50">
      <div class="max-w-lg mx-auto px-4 py-12 sm:py-20 text-center space-y-6" data-testid="checkout-cancel-container">
  
        <!-- Icon -->
        <div class="flex justify-center">
          <div class="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
            <svg class="w-10 h-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
  
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ $t('checkout.cancel_title') }}</h1>
          <p class="text-gray-500 mt-2">{{ $t('checkout.cancel_description') }}</p>
        </div>
  
        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <NuxtLinkLocale
            :to="routes.cart()"
            data-testid="checkout-return-to-cart"
            class="py-3 px-6 text-sm font-semibold text-white bg-(--color-primary)
                   rounded-md hover:bg-(--green-950) transition-colors"
          >
            {{ $t('checkout.return_to_cart') }}
          </NuxtLinkLocale>
  
          <NuxtLinkLocale
            :to="routes.home()"
            data-testid="checkout-cancel-continue-shopping"
            class="py-3 px-6 text-sm font-semibold text-gray-700 border border-gray-300
                   rounded-md hover:bg-gray-50 transition-colors"
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