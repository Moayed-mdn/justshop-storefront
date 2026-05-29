// plugins/02.cart.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const cartStore = useCartStore()
  const authStore = useAuthStore()

  // Only run bootstrap if not already initialized
  if (!cartStore.initialized) {
    // On server, only fetch if user is logged in (guest cart is client-only)
    if (import.meta.server) {
      if (authStore.isLoggedIn) {
        try {
          await cartStore.fetchCart()
        } catch (e) {
          if (import.meta.dev) {
            console.error('[cart-plugin] fetchCart failed during SSR', e)
          }
        }
      }
    } else if (authStore.isLoggedIn) {
      // Logged-in cart can be fetched immediately because SSR can render the same state.
      await cartStore.fetchCart()
    } else {
      // Guest carts live in localStorage, so defer hydration-sensitive reads until mount.
      nuxtApp.hook('app:mounted', async () => {
        if (!cartStore.initialized) {
          await cartStore.fetchCart()
        }
      })
    }
  }
})
