// composables/useCheckout.ts
import { API_ROUTES } from '~~/shared/utils/routes'

/**
 * Checkout composable for the merchant-driven storefront checkout flow.
 * Enhanced checkout is the only active storefront checkout entry path.
 */
export const useCheckout = () => {
    const { isLoggedIn } = useAuth()
    const localePath = useLocalePath()
    const cartStore = useCartStore()
    const loading = ref(false)
    const error = ref<string | null>(null)
    const api = useApi()
  
    /**
     * Route all storefront checkout entry points through the enhanced checkout page.
     * This keeps merchant-configured address and shipping rules authoritative.
     */
    const startCheckout = async () => {
      if (cartStore.isEmpty) {
        return
      }
      loading.value = true
      error.value = null

      try {
        if (isLoggedIn.value) {
          await navigateTo(localePath('/checkout'))
          return
        }

        await navigateTo({
          path: localePath('/login'),
          query: {
            redirect: localePath('/checkout'),
          },
        })
      } catch (err: any) {
        error.value = err?.data?.message || err?.message || 'Checkout failed'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    /**
     * Clear the frontend cart after successful checkout.
     * - Logged-in: webhook already cleared DB cart, just reset frontend state
     * - Guest: clear localStorage
     */
    const clearCartAfterCheckout = () => {
      cartStore.onLogout() // Reuses the same logic: clears items + localStorage
    }

    // ========================================================================
    // NEW ENHANCED CHECKOUT FLOW (with PaymentIntents)
    // ========================================================================

    /**
     * Initiate enhanced checkout session.
     * Returns cart, saved addresses, and allowed countries.
     */
    const initiateEnhancedCheckout = async () => {
      if (!isLoggedIn.value) {
        throw new Error('Enhanced checkout requires authentication')
      }

      loading.value = true
      error.value = null

      try {
        const response = await api<any>(API_ROUTES.checkout.initiateEnhanced, {
          method: 'POST',
        })

        if (response.error || !response.data) {
          throw response.error || new Error('Failed to initiate checkout')
        }

        return response.data.data
      } catch (err: any) {
        error.value = err?.data?.message || err?.message || 'Failed to initiate checkout'
        throw err
      } finally {
        loading.value = false
      }
    }

    /**
     * Get available shipping methods for an address.
     */
    const getShippingMethods = async (shippingAddress: any, orderAmount: number) => {
      loading.value = true
      error.value = null

      try {
        const response = await api<any>(API_ROUTES.checkout.shippingMethods, {
          method: 'POST',
          body: {
            shipping_address: shippingAddress,
            order_amount: orderAmount,
          },
        })

        if (response.error || !response.data) {
          throw response.error || new Error('Failed to get shipping methods')
        }

        return response.data.data
      } catch (err: any) {
        error.value = err?.data?.message || err?.message || 'Failed to get shipping methods'
        throw err
      } finally {
        loading.value = false
      }
    }

    /**
     * Create Stripe PaymentIntent for custom checkout.
     * Returns client_secret for Stripe Elements.
     */
    const createPaymentIntent = async (
      shippingAddress: any,
      billingAddress: any,
      shippingMethodId: number
    ) => {
      loading.value = true
      error.value = null

      try {
        const response = await api<any>(API_ROUTES.checkout.paymentIntent, {
          method: 'POST',
          body: {
            shipping_address: shippingAddress,
            billing_address: billingAddress,
            shipping_method_id: shippingMethodId,
          },
        })

        if (response.error || !response.data) {
          throw response.error || new Error('Failed to create payment intent')
        }

        return response.data.data
      } catch (err: any) {
        error.value = err?.data?.message || err?.message || 'Failed to create payment intent'
        throw err
      } finally {
        loading.value = false
      }
    }

    /**
     * Complete checkout after successful Stripe payment.
     */
    const completeEnhancedCheckout = async (paymentIntentId: string) => {
      loading.value = true
      error.value = null

      try {
        const response = await api<any>(API_ROUTES.checkout.completeEnhanced, {
          method: 'POST',
          body: {
            payment_intent_id: paymentIntentId,
          },
        })

        if (response.error || !response.data) {
          throw response.error || new Error('Failed to complete checkout')
        }

        // Clear cart after successful checkout
        clearCartAfterCheckout()

        return response.data.data
      } catch (err: any) {
        error.value = err?.data?.message || err?.message || 'Failed to complete checkout'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    return {
      loading: readonly(loading),
      error: readonly(error),
      
      startCheckout,
      clearCartAfterCheckout,

      initiateEnhancedCheckout,
      getShippingMethods,
      createPaymentIntent,
      completeEnhancedCheckout,
    }
  }
