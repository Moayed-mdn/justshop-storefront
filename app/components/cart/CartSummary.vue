<!-- components/cart/CartSummary.vue -->
<template>
  <div data-testid="cart-summary" class="bg-(--color-bg-elevated) rounded-lg border border-(--color-border-default) p-6 space-y-4">
    <h2 class="text-lg font-bold text-(--color-text-primary)">
      {{ $t('cart.order_summary') }}
    </h2>

    <!-- Subtotal -->
    <div class="flex justify-between text-sm">
      <span class="text-(--color-text-secondary)">
        {{ $t('cart.subtotal') }} ({{ itemsCount }} {{ $t('cart.items') }})
      </span>
      <span data-testid="cart-summary-subtotal" class="font-semibold text-(--color-text-primary)">{{ formatPrice(total) }}</span>
    </div>

    <!-- Shipping placeholder -->
    <div class="flex justify-between text-sm">
      <span class="text-(--color-text-secondary)">{{ $t('cart.shipping') }}</span>
      <span class="text-(--color-success) font-medium">{{ $t('cart.calculated_at_checkout') }}</span>
    </div>

    <!-- Divider -->
    <div class="border-t border-(--color-border-default) pt-4">
      <div class="flex justify-between">
        <span class="text-base font-bold text-(--color-text-primary)">{{ $t('cart.total') }}</span>
        <span data-testid="cart-summary-total" class="text-base font-bold text-(--color-text-primary)">{{ formatPrice(total) }}</span>
      </div>
      <p class="text-xs text-(--color-text-muted) mt-1 ltr:text-right rtl:text-left">
        {{ $t('cart.tax_note') }}
      </p>
    </div>

    <!-- Promo Code (placeholder for future) -->
    <div class="border-t border-(--color-border-default) pt-4">
      <button
        @click="showPromo = !showPromo"
        class="flex items-center gap-2 text-sm text-(--color-primary) font-medium
               hover:underline cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 7h.01M7 3h5c.512 0 1.024.195
               1.414.586l7 7a2 2 0 010
               2.828l-7 7a2 2 0 01-2.828
               0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
        </svg>
        {{ $t('cart.promo_code') }}
      </button>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="showPromo" class="flex gap-2 mt-3">
          <input
            v-model="promoCode"
            type="text"
            :placeholder="$t('cart.enter_promo')"
            class="flex-1 px-3 py-2 text-sm border border-(--color-border-default) rounded-md
                   focus:ring-(--color-primary) focus:border-(--color-primary)"
          >
          <button
            disabled
            class="px-4 py-2 text-sm font-medium text-(--color-text-muted) bg-(--color-bg-surface)
                   border border-(--color-border-default) rounded-md cursor-not-allowed"
          >
            {{ $t('cart.apply') }}
          </button>
        </div>
      </Transition>
    </div>

    <!-- Checkout Button -->
    <button
      @click="handleCheckout"
      data-testid="cart-checkout-button"
      :disabled="checkoutLoading || cart.isEmpty"
      :style="{ backgroundColor: primary, color: onPrimary }"
      class="w-full py-3 px-4 font-semibold rounded-md transition-colors text-sm sm:text-base cursor-pointer
             flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed
             hover-primary-btn"
    >
      <svg
        v-if="checkoutLoading"
        class="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {{ $t('cart.checkout') }}
    </button>

    <!-- Continue Shopping -->
    <NuxtLinkLocale
      :to="routes.home()"
      class="block w-full text-center py-2 text-sm font-medium text-(--color-primary)
             hover:underline transition-colors"
    >
      {{ $t('cart.continue_shopping') }}
    </NuxtLinkLocale>

    <!-- Trust Badges -->
    <div class="border-t border-(--color-border-default) pt-4 space-y-3">
      <div class="flex items-center gap-2 text-xs text-(--color-text-secondary)">
        <svg class="w-4 h-4 text-(--color-success) flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2
               0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002
               2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        {{ $t('cart.secure_checkout') }}
      </div>

      <div class="flex flex-wrap gap-2">
        <div class="w-12 h-7 rounded border border-(--color-border-default) flex items-center justify-center p-1">
          <img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce82d440b7ab84a993f_visa.png" alt="Visa" class="max-h-full">
        </div>
        <div class="w-12 h-7 rounded border border-(--color-border-default) flex items-center justify-center p-1">
          <img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce8f032504012a5896b_Mastercard.png" alt="Mastercard" class="max-h-full">
        </div>
        <div class="w-12 h-7 rounded border border-(--color-border-default) flex items-center justify-center p-1">
          <img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63eb1ce7c4510cf9a55828a0_PayPal.png" alt="PayPal" class="max-h-full">
        </div>
        <div class="w-12 h-7 rounded border border-(--color-border-default) flex items-center justify-center p-1">
          <img src="https://cdn.prod.website-files.com/63e857eaeaf853471d5335ff/63e8c4e4707380264b25e680_ApplePay.png" alt="Apple Pay" class="max-h-full">
        </div>
      </div>

      <div class="flex items-center gap-2 text-xs text-(--color-text-secondary)">
        <svg class="w-4 h-4 text-(--color-success) flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955
               0 0112 2.944a11.955 11.955 0 01-8.618
               3.04A12.02 12.02 0 003 9c0 5.591
               3.824 10.29 9 11.622 5.176-1.332
               9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        {{ $t('cart.money_back') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatPrice } from '../../utils/price'
import { useCheckout } from '../../composables/useCheckout'
import { useStorefrontRoutes } from '../../composables/useStorefrontRoutes'
import { useCart } from '../../composables/useCart'

// Inline theme colors for SSR compatibility
const getCSSVar = (varName: string, fallback: string): string => {
  if (!process.client) return fallback
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    return value || fallback
  } catch {
    return fallback
  }
}

const primary = computed(() => getCSSVar('--color-primary', '#3b82f6'))
const onPrimary = computed(() => getCSSVar('--color-on-primary', '#ffffff'))

defineProps<{
  total: number
  itemsCount: number
}>()

const routes = useStorefrontRoutes()
const { startCheckout, loading: checkoutLoading } = useCheckout()
const cart = useCart()

const showPromo = ref(false)
const promoCode = ref('')

const handleCheckout = async () => {
  await startCheckout()
}
</script>

<style scoped>
.hover-primary-btn:hover:not(:disabled) {
  filter: brightness(0.9);
}
</style>
