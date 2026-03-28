// stores/cart.ts
import { defineStore } from 'pinia'

// ─── Types ───────────────────────────────────────────────────────
export interface CartItem {
  id: number | string
  product: {
        id: number
  }
  variant:{
        id: number
  }
  name: string
  image?: string | null
  price: number
  quantity: number
  max_quantity?: number
  [key: string]: any
}

export interface Cart {
  items: CartItem[]
  total_price: number
  total_items: number
}

// ─── LocalStorage Key ────────────────────────────────────────────
const STORAGE_KEY = 'guest_cart'

// ─── Helpers ─────────────────────────────────────────────────────
function loadGuestCart(): Cart {
  if (import.meta.server) return { items: [], total_price: 0, total_items: 0 }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      console.log('load guest cart',parsed)
      return {
        items: parsed.items ?? [],
        total_price: parsed.total_price ?? 0,
        total_items: parsed.total_items ?? 0,
      }
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }

  return { items: [], total_price: 0, total_items: 0 }
}

function saveGuestCart(cart: Cart): void {
  if (import.meta.server) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
}

function clearGuestCart(): void {
  if (import.meta.server) return
  console.log('clear GuestCart ....')
  localStorage.removeItem(STORAGE_KEY)
}

function recalculateCart(items: CartItem[]): Cart {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return {
    items,
    total_price: Math.round(total * 100) / 100,
    total_items: items.reduce((sum, item) => sum + item.quantity, 0),
  }
}

let localIdCounter = Date.now()
function generateLocalId(): string {
  return `local_${++localIdCounter}`
}

// ─── Store ───────────────────────────────────────────────────────
export const useCartStore = defineStore('cart', () => {
  // ── State ────────────────────────────────────────────────────
  const items = ref<CartItem[]>([])
  const total = ref(0)
  const itemsCount = ref(0)
  const loading = ref(false)
  const itemLoading = ref<Record<string | number, boolean>>({})
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // ── Dependencies ─────────────────────────────────────────────
  const authStore = useAuthStore()

  // ── Getters ──────────────────────────────────────────────────
  const isEmpty = computed(() => items.value.length === 0)

  const isItemLoading = computed(() => {
    return (itemId: string | number) => !!itemLoading.value[itemId]
  })

  const getItemByProductId = computed(() => {
    return (productId: number, productVariantId?: number | null) => {
      return items.value.find(
        (item) =>
          item.product.id === productId &&
         
          item.variant.id === productVariantId
      )
    }
  })

  const isInCart = computed(() => {
    return (productId: number, productVariantId?: number | null) => {
      return !!getItemByProductId.value(productId, productVariantId)
    }
  })

  // ── Internal Helpers ─────────────────────────────────────────
  function setCart(cart: Cart) {
    console.log('set cart', cart)
    items.value = cart.items
    total.value = cart.total_price
    itemsCount.value = cart.total_items
  }

  function setError(err: any) {
    if (err?.data?.message) {
      error.value = err.data.message
    } else if (err instanceof Error) {
      error.value = err.message
    } else if (typeof err === 'string') {
      error.value = err
    } else {
      error.value = 'An unexpected error occurred'
    }
  }

  // ── Actions: Fetch / Initialize ──────────────────────────────
  async function fetchCart() {
    loading.value = true
    error.value = null

    try {
      if (authStore.isLoggedIn) {
        const api = useClientApi()
        // ✅ Fixed path: /cart → /cart
        const response = await api<{ data: Cart }>('/cart')
        console.log('fetch cart 140L',response)
        setCart(response.data)
      } else {
        const guestCart = loadGuestCart()
        setCart(guestCart)
      }
    } catch (err: any) {
      setError(err)
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  // ── Actions: Add Item ────────────────────────────────────────
  async function addItem(payload: {
    product_id: number
    product_variant_id: number         // ✅ Renamed, now required
    quantity?: number
    name: string
    image?: string | null
    price: number
    max_quantity?: number
  }) {
    const quantity = payload.quantity ?? 1
    error.value = null

    try {
      if (authStore.isLoggedIn) {
        const tempId = `adding_${payload.product_id}_${payload.product_variant_id}`
        itemLoading.value[tempId] = true

        try {
          const api = useClientApi()
          // ✅ Fixed path & body field name
          const response = await api<{ data: Cart }>('/cart/items', {
            method: 'POST',
            body: {
              product_variant_id: payload.product_variant_id,
              quantity,
            },
          })
          setCart(response.data)
        } finally {
          delete itemLoading.value[tempId]
        }
      } else {
        // ── Guest: localStorage ──
        const existing = items.value.find(
          (item) =>
            item.product.id === payload.product_id &&
            item.variant.id === payload.product_variant_id
        )

        if (existing) {
          const newQuantity = existing.quantity + quantity
          if (payload.max_quantity && newQuantity > payload.max_quantity) {
            const msg = `Maximum quantity is ${payload.max_quantity}`
            error.value = msg
            // ✅ Fixed: throw so the caller knows the action failed
            throw new Error(msg)
          }
          existing.quantity = newQuantity
        } else {
          const newItem: CartItem = {
            id: generateLocalId(),
            product: {
                id: payload.product_id,
            },
            variant: {
                id: payload.product_variant_id,
            },
            name: payload.name,
            image: payload.image ?? null,
            price: payload.price,
            quantity,
            max_quantity: payload.max_quantity,
          }
          items.value.push(newItem)
        }

        const cart = recalculateCart(items.value)
        setCart(cart)
        saveGuestCart(cart)
      }
    } catch (err: any) {
      setError(err)
      throw err
    }
  }

  // ── Actions: Update Item ─────────────────────────────────────
  async function updateItem(itemId: string | number, quantity: number) {
    if (quantity < 1) {
      return removeItem(itemId)
    }

    error.value = null
    itemLoading.value[itemId] = true

    try {
      if (authStore.isLoggedIn) {
        const api = useClientApi()
        // ✅ Fixed path
        const response = await api<{ data: Cart }>(
          `/cart/items/${itemId}`,
          {
            method: 'PATCH',
            body: { quantity },
          }
        )
        setCart(response.data)
      } else {
        const item = items.value.find((i) => i.id === itemId)
        if (!item) {
          error.value = 'Item not found in cart'
          return
        }

        if (item.max_quantity && quantity > item.max_quantity) {
          error.value = `Maximum quantity is ${item.max_quantity}`
          return
        }

        item.quantity = quantity

        const cart = recalculateCart(items.value)
        setCart(cart)
        saveGuestCart(cart)
      }
    } catch (err: any) {
      setError(err)
      throw err
    } finally {
      delete itemLoading.value[itemId]
    }
  }

  // ── Actions: Remove Item ─────────────────────────────────────
  async function removeItem(itemId: string | number) {
    error.value = null
    itemLoading.value[itemId] = true

    try {
      if (authStore.isLoggedIn) {
        const api = useClientApi()
        // ✅ Fixed path
        const response = await api<{ data: Cart }>(
          `/cart/items/${itemId}`,
          {
            method: 'DELETE',
          }
        )
        setCart(response.data)
      } else {
        items.value = items.value.filter((i) => i.id !== itemId)

        const cart = recalculateCart(items.value)
        setCart(cart)
        saveGuestCart(cart)
      }
    } catch (err: any) {
      setError(err)
      throw err
    } finally {
      delete itemLoading.value[itemId]
    }
  }

  // ── Actions: Clear Cart ──────────────────────────────────────
  async function clear() {
    loading.value = true
    error.value = null

    try {
      if (authStore.isLoggedIn) {
        const api = useClientApi()
        // ✅ Fixed path
        await api('/cart/clear', { method: 'DELETE' })
      } else {
        clearGuestCart()
      }

      setCart({ items: [], total_price: 0, total_items: 0 })
    } catch (err: any) {
      setError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── Actions: Merge guest cart into server on login ───────────
  async function mergeGuestCartToServer() {
    const guestCart = loadGuestCart()

    if (guestCart.items.length === 0) return

    const api = useClientApi()

    for (const item of guestCart.items) {
      try {
        // ✅ Fixed path & body field name
        await api('/cart/items', {
          method: 'POST',
          body: {
            product_variant_id: item.variant.id,
            quantity: item.quantity,
          },
        })
      } catch {
        console.warn(`Failed to merge cart item: ${item.product_id}`)
      }
    }

    clearGuestCart()
  }

  // ── Actions: Handle Login ────────────────────────────────────
  async function onLogin() {
    await mergeGuestCartToServer()
    await fetchCart()
  }

  // ── Actions: Handle Logout ───────────────────────────────────
  function onLogout() {
    setCart({ items: [], total_price: 0, total_items: 0 })
    clearGuestCart()                    // ✅ Also clear any stale guest data
    initialized.value = false
  }

  // ── Return ───────────────────────────────────────────────────
  return {
    items,
    total,
    itemsCount,
    loading,
    itemLoading,
    error,
    initialized,

    isEmpty,
    isItemLoading,
    getItemByProductId,
    isInCart,

    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clear,
    onLogin,
    onLogout,
    loadGuestCart
  }
})