// composables/useCheckout.ts
import { API_ROUTES } from '~~/shared/utils/routes'
import type { CreateCheckoutSessionResponse, CheckoutStatusResponse } from '~~/types/checkout'

export const useCheckout = () => {
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
        let response: { data: CreateCheckoutSessionResponse | null; error: any }
  
        if (isLoggedIn.value) {
          response = await useApi<CreateCheckoutSessionResponse>(API_ROUTES.checkout.sessionAuth, {
            method: 'POST',
          })
        } else {
          // Guest: send cart items from localStorage
          const items = cartStore.items.map((item) => ({
            product_variant_id: item.variant.id,
            quantity: item.quantity,
          }))
  
          response = await useApi<CreateCheckoutSessionResponse>(API_ROUTES.checkout.session, {
            method: 'POST',
            body: { items },
          })
        }
  
        // Redirect to Stripe hosted checkout page
        const sessionUrl = response.data?.data?.session_url
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
        const response = await useApi<CheckoutStatusResponse>(API_ROUTES.checkout.status(sessionId))
        return response.data?.data
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
