import { defineStore } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes';
import { useTenant } from '~~/src/core/tenant/composables';
import { clearResourceCache, CacheResources } from '~~/src/core/cache/createCacheKey';
import { useNuxtApp } from '#imports';
import type {
  AddToCartPayload,
  Cart,
  CartItem,
  CartResponse,
  GuestCart,
  GuestCartItem,
} from '~~/types/cart';

// ─── Constants ───────────────────────────────────────────────
const BASE_STORAGE_KEY = 'js_cart';
let localIdCounter = Date.now();

// ─── Helper Functions ──────────────────────────────────────────
const getLocale = () => {
  try {
    const nuxtApp = useNuxtApp()
    const i18n = (nuxtApp as any).$i18n
    return i18n?.locale?.value || 'en'
  } catch {
    return 'en'
  }
}

const cartHelpers = {
  generateLocalId: (): string => `local_${++localIdCounter}`,

  getStorageKey(tenantSlug?: string): string {
    return tenantSlug ? `${BASE_STORAGE_KEY}_${tenantSlug}` : BASE_STORAGE_KEY;
  },

  loadGuestCart(tenantSlug?: string): GuestCart {
    if (import.meta.server) {
      return { items: [], total_price: 0, total_items: 0 };
    }

    try {
      const key = this.getStorageKey(tenantSlug);
      const raw = localStorage.getItem(key);

      // One-time migration from the legacy global key
      if (!raw) {
        const legacyRaw = localStorage.getItem('guest_cart');
        if (legacyRaw) {
          localStorage.setItem(key, legacyRaw);
          localStorage.removeItem('guest_cart');
          const parsed = JSON.parse(legacyRaw);
          return {
            items: parsed.items ?? [],
            total_price: parsed.total_price ?? 0,
            total_items: parsed.total_items ?? 0,
          };
        }
        return { items: [], total_price: 0, total_items: 0 };
      }

      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          items: parsed.items ?? [],
          total_price: parsed.total_price ?? 0,
          total_items: parsed.total_items ?? 0,
        };
      }
    } catch {
      // Ignore errors
    }

    return { items: [], total_price: 0, total_items: 0 };
  },

  saveGuestCart(cart: GuestCart, tenantSlug?: string): void {
    if (import.meta.server) return;
    localStorage.setItem(this.getStorageKey(tenantSlug), JSON.stringify(cart));
  },

  clearGuestCart(tenantSlug?: string): void {
    if (import.meta.server) return;
    localStorage.removeItem(this.getStorageKey(tenantSlug));
  },

  recalculateGuestCart(items: GuestCartItem[]): GuestCart {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items,
      total_price: Math.round(total * 100) / 100,
      total_items: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  },
};

// ─── Store ─────────────────────────────────────────────────────
export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()
  const api = useApi()

  // ── State ────────────────────────────────────────────────────────
  const items = ref<(CartItem | GuestCartItem)[]>([])
  const total = ref(0)
  const itemsCount = ref(0)
  const loading = ref(false)
  const itemLoading = ref<Record<string | number, boolean>>({})
  const error = ref<string | null>(null)
  const initialized = ref(false);

  // ── Computed ─────────────────────────────────────────────────
  const isEmpty = computed(() => items.value.length === 0);

  const isItemLoading = computed(() => {
    return (itemId: string | number) => !!itemLoading.value[itemId];
  });

  const getItemByProductId = computed(() => {
    return (productId: number, variantId?: number | null) => {
      return items.value.find(
        (item) =>
          item.product.id === productId &&
          item.variant.id === variantId
      );
    };
  });

  const isInCart = computed(() => {
    return (productId: number, variantId?: number | null) => {
      return !!getItemByProductId.value(productId, variantId);
    };
  });

  // ── Helpers ────────────────────────────────────────────────────
  function syncGuestCart(itemsList: GuestCartItem[]) {
    const { tenantSlug } = useTenant();
    const cart = cartHelpers.recalculateGuestCart(itemsList);
    setCart(cart);
    cartHelpers.saveGuestCart(cart, tenantSlug.value);
  }

  function findGuestItem(productId: number, variantId?: number | null) {
    return items.value.find(
      (item) => item.product.id === productId && item.variant.id === variantId
    ) as GuestCartItem | undefined;
  }

  function setCart(cart: Cart | GuestCart) {
    items.value = cart.items;
    total.value = cart.total_price;
    itemsCount.value = cart.total_items;
  }

  function handleError(err: any): void {
    if (err?.data?.message) {
      error.value = err.data.message;
    } else if (err instanceof Error) {
      error.value = err.message;
    } else if (typeof err === 'string') {
      error.value = err;
    } else {
      error.value = 'An unexpected error occurred';
    }
  }

  async function invalidateCartCache(locale?: string, tenantSlug?: string) {
    const localeValue = locale || getLocale();
    const tenantSlugValue = tenantSlug || useTenant().tenantSlug.value;
    await clearResourceCache(CacheResources.CART_ITEMS, {
      locale: localeValue,
      tenantSlug: tenantSlugValue,
    });
  }

  // ── API Actions ───────────────────────────────────────────────
  async function fetchCart() {
    const { tenantSlug } = useTenant();
    loading.value = true;
    error.value = null;

    try {
      if (authStore.isLoggedIn) {
        // Automatically merge guest cart if it exists before fetching
        const guestCart = cartHelpers.loadGuestCart(tenantSlug.value);
        if (guestCart.items.length > 0) {
          await mergeGuestCartToServer();
        }

        const { data, error: apiError } = await api<CartResponse>(API_ROUTES.cart.index);
        if (apiError) throw apiError;
        if (data) setCart(data.data);
      } else {
        const guestCart = cartHelpers.loadGuestCart(tenantSlug.value);
        setCart(guestCart);
      }
    } catch (err) {
      handleError(err);
    } finally {
      loading.value = false;
      initialized.value = true;
    }
  }

  async function addItem(payload: AddToCartPayload) {
    const quantity = payload.quantity ?? 1;
    error.value = null;

    if (authStore.isLoggedIn) {
      const tempId = `adding_${payload.product_id}_${payload.product_variant_id}`;
      itemLoading.value[tempId] = true;

      try {
        const { data, error: apiError } = await api<CartResponse>(
          API_ROUTES.cart.items,
          {
            method: 'POST',
            body: {
              product_variant_id: payload.product_variant_id,
              quantity,
            },
          }
        );
        if (apiError) throw apiError;
        if (data) setCart(data.data);
        
        // ✅ Invalidate cart cache after adding item
        await invalidateCartCache(getLocale(), useTenant().tenantSlug.value);
      } finally {
        delete itemLoading.value[tempId];
      }
    } else {
      // Guest cart logic
      const existing = findGuestItem(payload.product_id, payload.product_variant_id);

      if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (payload.max_quantity && newQuantity > payload.max_quantity) {
          const msg = `Maximum quantity is ${payload.max_quantity}`;
          error.value = msg;
          throw new Error(msg);
        }
        existing.quantity = newQuantity;
      } else {
        const newItem: GuestCartItem = {
          id: cartHelpers.generateLocalId(),
          product: { 
            id: payload.product_id,
            slug: payload.slug || '',  // Add slug for product links
          },
          variant: { id: payload.product_variant_id },
          name: payload.name,
          image: payload.image ?? null,
          price: payload.price,
          quantity,
          max_quantity: payload.max_quantity,
        };
        items.value.push(newItem);
      }

      syncGuestCart(items.value as GuestCartItem[]);
    }
  }

  async function updateItem(itemId: string | number, quantity: number) {
    if (quantity < 1) {
      return removeItem(itemId);
    }

    error.value = null;
    itemLoading.value[itemId] = true;

    try {
      if (authStore.isLoggedIn) {
        const { data, error: apiError } = await api<CartResponse>(
          API_ROUTES.cart.item(itemId),
          { method: 'PATCH', body: { quantity } }
        );
        if (apiError) throw apiError;
        if (data) setCart(data.data);
        
        // ✅ Invalidate cart cache after updating item
        await invalidateCartCache(getLocale(), useTenant().tenantSlug.value);
      } else {
        const item = items.value.find((i) => i.id === itemId) as GuestCartItem | undefined;
        if (!item) {
          error.value = 'Item not found in cart';
          return;
        }

        if (item.max_quantity && quantity > item.max_quantity) {
          error.value = `Maximum quantity is ${item.max_quantity}`;
          return;
        }

        item.quantity = quantity;
        syncGuestCart(items.value as GuestCartItem[]);
      }
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      delete itemLoading.value[itemId];
    }
  }

  async function removeItem(itemId: string | number) {
    error.value = null;
    itemLoading.value[itemId] = true;

    try {
      if (authStore.isLoggedIn) {
        const { data, error: apiError } = await api<CartResponse>(
          API_ROUTES.cart.item(itemId),
          { method: 'DELETE' }
        );
        if (apiError) throw apiError;
        if (data) setCart(data.data);
        
        // ✅ Invalidate cart cache after removing item
        await invalidateCartCache(getLocale(), useTenant().tenantSlug.value);
      } else {
        items.value = items.value.filter((i) => i.id !== itemId);
        syncGuestCart(items.value as GuestCartItem[]);
      }
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      delete itemLoading.value[itemId];
    }
  }

  async function clear() {
    const { tenantSlug } = useTenant();
    loading.value = true;
    error.value = null;

    try {
      if (authStore.isLoggedIn) {
        await api(API_ROUTES.cart.clear, { method: 'DELETE' });
      } else {
        cartHelpers.clearGuestCart(tenantSlug.value);
      }
      setCart({ items: [], total_price: 0, total_items: 0 });
      
      // ✅ Invalidate cart cache after clearing cart
      await invalidateCartCache(getLocale(), useTenant().tenantSlug.value);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function mergeGuestCartToServer() {
    const { tenantSlug } = useTenant();
    const guestCart = cartHelpers.loadGuestCart(tenantSlug.value);
    if (guestCart.items.length === 0) return;

    try {
      const { data, error: apiError } = await api<CartResponse>(API_ROUTES.cart.bulk, {
        method: 'POST',
        body: {
          items: guestCart.items.map((item) => ({
            product_variant_id: item.variant.id,
            quantity: item.quantity,
          })),
        },
      });
      if (apiError) throw apiError;
      if (data) setCart(data.data);
      cartHelpers.clearGuestCart(tenantSlug.value);
    } catch (err) {
      handleError(err);
      // If bulk fails, we keep the guest cart for next attempt
    }
  }

  async function onLogin() {
    await mergeGuestCartToServer();
    await fetchCart();
    
    // ✅ Invalidate cart cache after login (merged cart)
    await invalidateCartCache(getLocale(), useTenant().tenantSlug.value);
  }

  function onLogout() {
    const { tenantSlug } = useTenant();
    setCart({ items: [], total_price: 0, total_items: 0 });
    cartHelpers.clearGuestCart(tenantSlug.value);
    initialized.value = false;
    
    // ✅ Invalidate cart cache after logout
    void invalidateCartCache(getLocale(), useTenant().tenantSlug.value);
  }

  return {
    // State
    items,
    total,
    itemsCount,
    loading,
    itemLoading,
    error,
    initialized,

    // Computed
    isEmpty,
    isItemLoading,
    getItemByProductId,
    isInCart,

    // Actions
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clear,
    onLogin,
    onLogout,
  };
});
