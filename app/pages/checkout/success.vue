<!-- pages/checkout/success.vue -->
<template>
    <div class="min-h-[60vh] bg-gray-50">
      <div class="max-w-lg mx-auto px-4 py-12 sm:py-20">
  
        <!-- ── Loading / Processing ── -->
        <div v-if="status === 'loading'" class="text-center space-y-4">
          <div class="flex justify-center">
            <svg class="animate-spin h-12 w-12 text-[#003D29]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900">{{ $t('checkout.processing_title') }}</h2>
          <p class="text-gray-500 text-sm">{{ $t('checkout.processing_description') }}</p>
        </div>
  
        <!-- ── Success ── -->
        <div v-else-if="status === 'success'" class="text-center space-y-6">
          <!-- Checkmark -->
          <div class="flex justify-center">
            <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
  
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ $t('checkout.success_title') }}</h1>
            <p class="text-gray-500 mt-2">{{ $t('checkout.success_description') }}</p>
          </div>
  
          <!-- Order Details Card -->
          <div class="bg-white rounded-lg border border-gray-200 p-6 text-left space-y-4">
            <!-- Order Number -->
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ $t('checkout.order_number') }}</span>
              <span class="text-sm font-bold text-gray-900 font-mono">{{ orderData?.order_number }}</span>
            </div>
  
            <!-- Payment Status -->
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ $t('checkout.payment_status') }}</span>
              <span
                class="text-sm font-semibold px-2.5 py-0.5 rounded-full"
                :class="paymentStatusClasses"
              >
                {{ paymentStatusLabel }}
              </span>
            </div>
  
            <!-- Divider -->
            <div class="border-t border-gray-100"></div>
  
            <!-- Email -->
            <div v-if="orderData?.customer_email" class="text-center">
              <p class="text-sm text-gray-500">
                {{ $t('checkout.confirmation_email') }}
              </p>
              <p class="text-sm font-semibold text-gray-900 mt-1">
                {{ orderData.customer_email }}
              </p>
            </div>
          </div>
  
          <!-- Guest: Create Account Prompt -->
          <div
            v-if="!isLoggedIn && orderData?.customer_email"
            class="bg-blue-50 rounded-lg border border-blue-200 p-5 text-left"
          >
            <h3 class="text-sm font-bold text-blue-900">{{ $t('checkout.create_account_title') }}</h3>
            <p class="text-sm text-blue-700 mt-1">{{ $t('checkout.create_account_description') }}</p>
            <NuxtLinkLocale
              to="/register"
              class="inline-block mt-3 px-4 py-2 text-sm font-medium text-white bg-blue-600
                     rounded-md hover:bg-blue-700 transition-colors"
            >
              {{ $t('checkout.create_account_button') }}
            </NuxtLinkLocale>
          </div>
  
          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3 pt-2">
            <NuxtLinkLocale
              v-if="isLoggedIn"
              to="/orders"
              class="flex-1 py-3 px-4 text-center text-sm font-semibold text-white bg-[#003D29]
                     rounded-md hover:bg-[#00251C] transition-colors"
            >
              {{ $t('checkout.view_orders') }}
            </NuxtLinkLocale>
  
            <NuxtLinkLocale
              to="/"
              class="flex-1 py-3 px-4 text-center text-sm font-semibold border border-gray-300
                     rounded-md hover:bg-gray-50 transition-colors"
              :class="isLoggedIn ? 'text-gray-700' : 'text-white bg-[#003D29] hover:bg-[#00251C] border-transparent'"
            >
              {{ $t('checkout.continue_shopping') }}
            </NuxtLinkLocale>
          </div>
        </div>
  
        <!-- ── Error ── -->
        <div v-else-if="status === 'error'" class="text-center space-y-6">
          <div class="flex justify-center">
            <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
  
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ $t('checkout.error_title') }}</h1>
            <p class="text-gray-500 mt-2">{{ $t('checkout.error_description') }}</p>
          </div>
  
          <NuxtLinkLocale
            to="/"
            class="inline-block py-3 px-6 text-sm font-semibold text-white bg-[#003D29]
                   rounded-md hover:bg-[#00251C] transition-colors"
          >
            {{ $t('checkout.continue_shopping') }}
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    layout: 'default',
  })
  
  const route = useRoute()
  const { isLoggedIn } = useAuth()
  const { getCheckoutStatus, clearCartAfterCheckout } = useCheckout()
  const { t } = useI18n()
  
  const status = ref<'loading' | 'success' | 'error'>('loading')
  const orderData = ref<{
    payment_status: string
    order_number: string
    order_status: string
    customer_email: string
  } | null>(null)
  
  // Payment status badge
  const paymentStatusClasses = computed(() => {
    switch (orderData.value?.payment_status) {
      case 'paid':
        return 'bg-green-100 text-green-700'
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  })
  
  const paymentStatusLabel = computed(() => {
    switch (orderData.value?.payment_status) {
      case 'paid':
        return t('checkout.status_paid')
      case 'unpaid':
        return t('checkout.status_unpaid')
      default:
        return t('checkout.status_pending')
    }
  })
  
  onMounted(async () => {
    const sessionId = route.query.session_id as string
  
    if (!sessionId) {
      status.value = 'error'
      return
    }
  
    try {
      const data = await getCheckoutStatus(sessionId)
      orderData.value = data
      status.value = 'success'
  
      // Clear the frontend cart
      clearCartAfterCheckout()
    } catch (err) {
      // Retry once after 2 seconds (webhook might not have processed yet)
      await new Promise((resolve) => setTimeout(resolve, 2000))
  
      try {
        const data = await getCheckoutStatus(sessionId)
        orderData.value = data
        status.value = 'success'
        clearCartAfterCheckout()
      } catch {
        status.value = 'error'
      }
    }
  })
  </script>