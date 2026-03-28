<template>
    <div class="min-h-[60vh] bg-gray-50">
      <!-- ── Breadcrumb ── -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav class="flex items-center gap-2 text-sm text-gray-500">
            <NuxtLinkLocale to="/" class="hover:text-[#003D29] transition-colors">
              {{ $t('cart.breadcrumb_home') }}
            </NuxtLinkLocale>
            <span>/</span>
            <span class="text-gray-900 font-medium">{{ $t('cart.breadcrumb_cart') }}</span>
          </nav>
        </div>
      </div>
  
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
  
        <!-- ── Loading ── -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <svg class="animate-spin h-8 w-8 text-[#003D29]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
  
        <!-- ── Empty Cart ── -->
        <CartEmpty v-else-if="isEmpty" />
  
        <!-- ── Cart Content ── -->
        <div v-else>
          <!-- Page Title -->
          <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
              {{ $t('cart.title') }}
              <span class="text-gray-400 font-normal text-base">
                ({{ itemsCount }} {{ itemsCount === 1 ? $t('cart.item') : $t('cart.items') }})
              </span>
            </h1>
  
            <button
              @click="handleClearCart"
              class="text-sm text-red-500 hover:text-red-700 hover:underline
                     transition-colors cursor-pointer"
            >
              {{ $t('cart.clear_cart') }}
            </button>
          </div>
  
          <!-- Two Column Layout -->
          <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
  
            <!-- ── Left: Cart Items ── -->
            <div class="flex-1 space-y-3">
              <TransitionGroup
                name="cart-item"
                tag="div"
                class="space-y-3"
              >
                <CartPageItem
                  v-for="item in items"
                  :key="item.id"
                  :item="item"
                />
              </TransitionGroup>
  
              <!-- Continue Shopping -->
              <div class="pt-4">
                <NuxtLinkLocale
                  to="/"
                  class="inline-flex items-center gap-2 text-sm font-medium text-[#003D29]
                         hover:underline transition-colors"
                >
                  <svg class="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {{ $t('cart.continue_shopping') }}
                </NuxtLinkLocale>
              </div>
            </div>
  
            <!-- ── Right: Order Summary ── -->
            <div class="w-full lg:w-[380px] flex-shrink-0">
              <div class="lg:sticky lg:top-4">
                <CartSummary
                  :total="total"
                  :items-count="itemsCount"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- ── Mobile Sticky Checkout Bar ── -->
    <!-- In pages/cart.vue — replace the mobile sticky bar section -->

    <!-- ── Mobile Sticky Checkout Bar ── -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="!isEmpty && !loading"
        class="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200
               shadow-[0_-4px_12px_rgba(0,0,0,0.08)] p-4 z-40
               lg:hidden"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-600">{{ $t('cart.total') }}</span>
          <span class="text-lg font-bold text-gray-900">{{ formatPrice(total) }}</span>
        </div>
        <button
          @click="handleMobileCheckout"
          :disabled="checkoutLoading"
          class="w-full py-3 bg-[#003D29] text-white font-semibold rounded-md
                 hover:bg-[#00251C] transition-colors cursor-pointer
                 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          {{ checkoutLoading ? $t('checkout.redirecting') : $t('cart.checkout') }}
        </button>
      </div>
    </Transition>
  
      <!-- ── Clear Cart Confirmation Modal ── -->
      <div
        v-if="showClearConfirm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showClearConfirm = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('cart.clear_confirm_title') }}</h3>
          <p class="text-sm text-gray-500 mt-2">{{ $t('cart.clear_confirm_message') }}</p>
          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="showClearConfirm = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300
                     rounded-md hover:bg-gray-50 cursor-pointer"
            >
              {{ $t('cart.cancel') }}
            </button>
            <button
              @click="confirmClear"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md
                     hover:bg-red-700 cursor-pointer"
            >
              {{ $t('cart.clear_cart') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const cart = useCart()
  const { startCheckout, loading: checkoutLoading } = useCheckout()
  const toast = useToast()
  
  const {
    items,
    total,
    itemsCount,
    isEmpty,
    loading,
  } = cart
  
  const showClearConfirm = ref(false)
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }
  
  const handleClearCart = () => {
    showClearConfirm.value = true
  }
  
  const confirmClear = async () => {
    showClearConfirm.value = false
    const result = await cart.clearCart()
    if (result.success) {
      toast.add({
        title: '',
        description: 'Cart cleared',
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })
    }
  }
  
  const handleMobileCheckout = async () => {
    try {
      await startCheckout()
    } catch (err: any) {
      toast.add({
        title: 'Checkout Failed',
        description: err?.data?.message || err?.message || 'An error occurred.',
        color: 'error',
        icon: 'i-heroicons-x-circle',
      })
    }
  }
  </script>
  
  <style scoped>
  /* Cart item enter/leave animations */
  .cart-item-enter-active {
    transition: all 0.3s ease-out;
  }
  .cart-item-leave-active {
    transition: all 0.2s ease-in;
  }
  .cart-item-enter-from {
    opacity: 0;
    transform: translateX(20px);
  }
  .cart-item-leave-to {
    opacity: 0;
    transform: translateX(-20px);
  }
  .cart-item-move {
    transition: transform 0.3s ease;
  }
  
  /* Add padding at the bottom for mobile sticky bar */
  @media (max-width: 1023px) {
    .min-h-\[60vh\] {
      padding-bottom: 100px;
    }
  }
  </style>