<template>
  <div class="checkout-step">
    <h2 class="text-2xl font-semibold mb-6">{{ $t('checkout.payment') }}</h2>

    <div v-if="!clientSecret" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">{{ $t('checkout.initializing_payment') }}</p>
    </div>

    <div v-else>
      <!-- Stripe Payment Element Container -->
      <div ref="paymentElementRef" class="mb-6"></div>

      <div v-if="paymentError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p class="text-red-800 text-sm">{{ paymentError }}</p>
      </div>

      <!-- Security Badge -->
      <div class="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <span>{{ $t('checkout.secure_payment_info') }}</span>
      </div>

      <div class="flex gap-4">
        <button 
          @click="$emit('back')" 
          class="btn btn-outline flex-1" 
          :disabled="processing"
        >
          {{ $t('common.back') }}
        </button>
        <button
          @click="handlePayment"
          :disabled="processing || !isReady"
          class="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="processing">{{ $t('checkout.processing') }}...</span>
          <span v-else>{{ $t('checkout.complete_order') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StripeElements, StripePaymentElement } from '@stripe/stripe-js'

const props = defineProps<{
  clientSecret: string | null
  paymentIntentId: string | null
  orderNumber: string | null
}>()

const emit = defineEmits<{
  back: []
  success: [orderNumber: string]
}>()

const { createElements, getStripe } = usePayment()
const { completeEnhancedCheckout } = useCheckout()
const { t } = useI18n()

const paymentElementRef = ref<HTMLElement>()
const processing = ref(false)
const paymentError = ref<string | null>(null)
const isReady = ref(false)

// Store elements and payment element as refs so we can access them in handlePayment
let elements: StripeElements | null = null
let paymentElement: StripePaymentElement | null = null

// Initialize localePath at the top, not inside handlePayment
const localePath = useLocalePath()

onMounted(async () => {
  if (props.clientSecret && paymentElementRef.value) {
    try {
      elements = await createElements(props.clientSecret)
      if (!elements) {
        paymentError.value = t('checkout.stripe_initialization_failed')
        return
      }

      // Create and mount the Payment Element
      paymentElement = elements.create('payment')
      paymentElement.mount(paymentElementRef.value)

      // Listen for ready event
      paymentElement.on('ready', () => {
        isReady.value = true
      })

      // Listen for changes
      ;(paymentElement as any).on('change', (event: { error?: { message?: string } }) => {
        if (event.error) {
          paymentError.value = event.error.message || t('checkout.payment_failed')
        } else {
          paymentError.value = null
        }
      })
    } catch (err: any) {
      paymentError.value = err.message || t('checkout.failed_to_initialize_payment')
    }
  }
})

onUnmounted(() => {
  if (paymentElement) {
    paymentElement.destroy()
  }
})

async function handlePayment() {
  if (!props.clientSecret || !props.paymentIntentId || !props.orderNumber || !elements || !paymentElement) return

  try {
    processing.value = true
    paymentError.value = null

    // First, submit the payment element to collect payment details!
    const { error: submitError } = await elements.submit()
    if (submitError) {
      paymentError.value = submitError.message || t('checkout.payment_failed')
      processing.value = false
      return
    }

    // Get the return URL for successful payment
    const returnUrl = `${window.location.origin}${localePath('/checkout/success')}`

    const stripe = await getStripe()
    
    if (!stripe) {
      throw new Error(t('checkout.stripe_not_initialized'))
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements: elements, // Pass the elements object!
      clientSecret: props.clientSecret, // Pass clientSecret!
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: 'if_required',
    })

    if (error) {
      paymentError.value = error.message || t('checkout.payment_failed')
      processing.value = false
      return
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded, complete checkout on backend
      await completeEnhancedCheckout(props.paymentIntentId)
      
      // Emit success with orderNumber so we can redirect properly
      emit('success', props.orderNumber)
    }
  } catch (err: any) {
    paymentError.value = err.message || t('checkout.payment_failed')
    processing.value = false
  }
}
</script>

<style scoped>
.checkout-step {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  padding: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--color-primary-600, #2563eb);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-700, #1d4ed8);
}

.btn-outline {
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover:not(:disabled) {
  background-color: #f9fafb;
}
</style>
