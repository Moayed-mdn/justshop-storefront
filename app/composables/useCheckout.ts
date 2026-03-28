// composables/useCheckout.ts
export const useCheckout = () => {
    const api = useClientApi()
    const { isLoggedIn } = useAuth()
    const cartStore = useCartStore()
    const loading = ref(false)
    const error = ref<string | null>(null)
  
    /**
     * Create a Stripe Checkout Session and redirect to Stripe.
     * - Logged-in: POST /checkout/session/auth (cart from DB)
     * - Guest: POST /checkout/session (cart from localStorage)
     */
    const startCheckout = async () => {
      loading.value = true
      error.value = null
  
      try {
        let response: any
  
        if (isLoggedIn.value) {
          response = await api('/checkout/session/auth', {
            method: 'POST',
          })
        } else {
          // Guest: send cart items from localStorage
          const items = cartStore.items.map((item) => ({
            product_variant_id: item.variant.id,
            quantity: item.quantity,
          }))
  
          response = await api('/checkout/session', {
            method: 'POST',
            body: { items },
          })
        }
  
        // Redirect to Stripe hosted checkout page
        const sessionUrl = response.data?.session_url
        if (sessionUrl) {
          window.location.href = sessionUrl
        } else {
          throw new Error('No session URL returned')
        }
      } catch (err: any) {
        error.value = err?.data?.message || err?.message || 'Checkout failed'
        throw err
      } finally {
        loading.value = false
      }
    }
  
    /**
     * Get order status after Stripe redirects back to success page.
     */
    const getCheckoutStatus = async (sessionId: string) => {
      try {
        const response = await api(`/checkout/status/${sessionId}`)
        return response.data
      } catch (err: any) {
        throw err
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
  
    return {
      loading: readonly(loading),
      error: readonly(error),
      startCheckout,
      getCheckoutStatus,
      clearCartAfterCheckout,
    }
  }