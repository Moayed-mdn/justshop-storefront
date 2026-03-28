// plugins/02.cart.client.ts
export default defineNuxtPlugin(async () => {
  const cartStore = useCartStore()

  if (!cartStore.initialized) {
    await cartStore.fetchCart()
  }
})