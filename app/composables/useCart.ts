import type { CartItem, GuestCartItem, AddToCartPayload } from '~~/types/cart';

type CartActionResult = { success: true } | { success: false; message?: string };

export function useCart() {
  const cartStore = useCartStore();
  const { t } = useI18n();
  const { showSuccessToast, showErrorToast } = useAppToast();

  function getErrorMessage(err: unknown, fallback: string) {
    if (err && typeof err === 'object' && 'message' in err) {
      const maybeMessage = (err as any).message;
      if (typeof maybeMessage === 'string' && maybeMessage.trim()) return maybeMessage;
    }
    return cartStore.error || fallback;
  }

  async function runAction(action: () => Promise<void>, fallbackMessage: string): Promise<CartActionResult> {
    try {
      await action();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: getErrorMessage(err, fallbackMessage) };
    }
  }

  async function addToCart(product: AddToCartPayload) {
    const result = await runAction(() => cartStore.addItem(product), 'Failed to add item');
    if (result.success) {
      showSuccessToast(t('product.added_to_cart'));
    } else {
      showErrorToast(result.message || 'Failed to add item');
    }
    return result;
  }

  async function updateQuantity(itemId: string | number, quantity: number) {
    return runAction(() => cartStore.updateItem(itemId, quantity), 'Failed to update item');
  }

  async function increment(item: CartItem | GuestCartItem) {
    return updateQuantity(item.id, item.quantity + 1);
  }

  async function decrement(item: CartItem | GuestCartItem) {
    if (item.quantity <= 1) {
      return removeFromCart(item.id);
    }
    return updateQuantity(item.id, item.quantity - 1);
  }

  async function removeFromCart(itemId: string | number) {
    return runAction(() => cartStore.removeItem(itemId), 'Failed to remove item');
  }

  async function clearCart() {
    return runAction(() => cartStore.clear(), 'Failed to clear cart');
  }

  function isInCart(productId: number, variantId?: number | null): boolean {
    return cartStore.isInCart(productId, variantId);
  }

  function getCartItem(
    productId: number,
    variantId?: number | null
  ): CartItem | GuestCartItem | undefined {
    return cartStore.getItemByProductId(productId, variantId);
  }

  return {
    // State
    items: computed(() => cartStore.items),
    total: computed(() => cartStore.total),
    itemsCount: computed(() => cartStore.itemsCount),
    isEmpty: computed(() => cartStore.isEmpty),
    loading: computed(() => cartStore.loading),
    initialized: computed(() => cartStore.initialized),
    error: computed(() => cartStore.error),
    isItemLoading: cartStore.isItemLoading,

    // Actions
    addToCart,
    updateQuantity,
    increment,
    decrement,
    removeFromCart,
    clearCart,
    isInCart,
    getCartItem,
  };
}