// composables/useCart.ts

export function useCart() {
  const cartStore = useCartStore()



  // ✅ Updated: product_variant_id instead of variant_id
  async function addToCart(product: {
    product_id: number
    product_variant_id: number
    name: string
    image?: string | null
    price: number
    quantity?: number
    max_quantity?: number
  }) {
    try {
        console.log(product)      
      await cartStore.addItem(product)
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        message:
          err?.data?.message || cartStore.error || 'Failed to add item',
      }
    }
  }

  async function updateQuantity(itemId: string | number, quantity: number) {
    try {
      await cartStore.updateItem(itemId, quantity)
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        message:
          err?.data?.message || cartStore.error || 'Failed to update item',
      }
    }
  }

  async function increment(item: CartItem) {
    return updateQuantity(item.id, item.quantity + 1)
  }

  async function decrement(item: CartItem) {
    if (item.quantity <= 1) {
      return removeFromCart(item.id)
    }
    return updateQuantity(item.id, item.quantity - 1)
  }

  async function removeFromCart(itemId: string | number) {
    try {
      await cartStore.removeItem(itemId)
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        message:
          err?.data?.message || cartStore.error || 'Failed to remove item',
      }
    }
  }

  async function clearCart() {
    try {
      await cartStore.clear()
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        message:
          err?.data?.message || cartStore.error || 'Failed to clear cart',
      }
    }
  }

  // ✅ Updated parameter name
  function isInCart(
    productId: number,
    productVariantId?: number | null
  ): boolean {
    return cartStore.isInCart(productId, productVariantId)
  }

  function getCartItem(
    productId: number,
    productVariantId?: number | null
  ): CartItem | undefined {
    return cartStore.getItemByProductId(productId, productVariantId)
  }

  return {
    items: computed(() => cartStore.items),
    total: computed(() => cartStore.total),
    itemsCount: computed(() => cartStore.itemsCount),
    isEmpty: computed(() => cartStore.isEmpty),
    loading: computed(() => cartStore.loading),
    error: computed(() => cartStore.error),

    isItemLoading: cartStore.isItemLoading,

    addToCart,
    updateQuantity,
    increment,
    decrement,
    removeFromCart,
    clearCart,

    isInCart,
    getCartItem,
  }
}