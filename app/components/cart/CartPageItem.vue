<template>
    <div
      class="flex gap-4 p-4 bg-(--color-bg-elevated) rounded-lg border border-(--color-border-default)
             transition-all duration-200"
      :class="{ 'opacity-50 pointer-events-none': isRemoving }"
    >
      <!-- ── Image ── -->
      <NuxtLinkLocale
        :to="productLink"
        class="flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-(--color-bg-surface)"
      >
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.name"
          class="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
        >
        <div v-else class="w-full h-full flex items-center justify-center text-(--color-text-muted)">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16
                 16m-2-2l1.586-1.586a2 2 0 012.828
                 0L20 14m-6-6h.01M6 20h12a2 2 0
                 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </NuxtLinkLocale>
  
      <!-- ── Details ── -->
      <div class="flex-1 min-w-0">
        <!-- Name + Remove -->
        <div class="flex items-start justify-between gap-2">
          <NuxtLinkLocale
            :to="productLink"
            class="text-sm sm:text-base font-semibold text-(--color-text-primary) hover:text-(--color-primary)
                   transition-colors line-clamp-2"
          >
            {{ item.name }}
          </NuxtLinkLocale>
  
          <button
            @click="handleRemove"
            :disabled="isRemoving"
            data-testid="confirm-remove"
            class="flex-shrink-0 p-1 text-(--color-text-muted) hover:text-(--color-error)
                   transition-colors cursor-pointer disabled:opacity-50"
            :title="$t('cart.remove')"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138
                   21H7.862a2 2 0 01-1.995-1.858L5
                   7m5 4v6m4-6v6m1-10V4a1 1 0
                   00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
  
        <!-- Attributes (Color: Red, Size: 500g) -->
        <div v-if="item.variant?.attributes?.length" class="flex flex-wrap gap-x-3 gap-y-1 mt-1">
          <span
            v-for="attr in item.variant.attributes"
            :key="attr.name"
            class="text-xs text-(--color-text-secondary)"
          >
            <span class="font-medium">{{ attr.name }}:</span> {{ attr.value }}
          </span>
        </div>
  
        <!-- SKU -->
        <p v-if="item.variant?.sku" class="text-xs text-(--color-text-muted) mt-1">
          SKU: {{ item.variant.sku }}
        </p>
  
        <!-- Price + Quantity + Subtotal -->
        <div class="flex flex-wrap items-end justify-between gap-3 mt-3">
          <!-- Price per unit -->
          <div class="text-sm text-(--color-text-secondary)">
            {{ formatPrice(item.price) }} × {{ item.quantity }}
          </div>
  
          <!-- Quantity Selector -->
          <div
            class="flex items-center border border-(--color-border-default) rounded-lg overflow-hidden"
          >
            <button
              @click="handleDecrement"
              :disabled="isUpdating"
              class="w-8 h-8 flex items-center justify-center text-(--color-text-secondary)
                     hover:bg-(--color-bg-hover) transition-colors disabled:opacity-40 cursor-pointer"
            >
              <svg v-if="item.quantity === 1" class="w-4 h-4 text-(--color-error)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0
                     0116.138 21H7.862a2 2 0
                     01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1
                     1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
  
            <Transition name="fade-qty" mode="out-in">
              <span
                :key="item.quantity"
                class="w-10 h-8 flex items-center justify-center text-sm font-semibold
                       border-x border-(--color-border-default) bg-(--color-bg-surface)"
              >
                {{ item.quantity }}
              </span>
            </Transition>
  
            <button
              @click="handleIncrement"
              :disabled="isUpdating || atMax"
              data-testid="update-cart-button"
               class="w-8 h-8 flex items-center justify-center text-(--color-text-secondary)
                      hover:bg-(--color-bg-hover) transition-colors disabled:opacity-40 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
  
          <!-- Subtotal -->
          <div class="text-sm sm:text-base font-bold text-(--color-text-primary)">
            {{ formatPrice(item.price * item.quantity) }}
          </div>
        </div>
  
        <!-- Stock Warning -->
        <p
          v-if="lowStock"
          class="text-xs text-(--color-warning) mt-2"
        >
          {{ $t('cart.only_x_left', { count: item.max_quantity }) }}
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { formatPrice } from '../../utils/price'
  import type { CartItem } from '~~/types/cart'
  
  const props = defineProps<{
    item: CartItem
  }>()
  
  const cart = useCart()
  const cartStore = useCartStore()
  
  // ── Product link ──
  const routes = useStorefrontRoutes()

  const productLink = computed(() => {
    // Try to get slug from item
    const slug = props.item.product?.slug
    
    if (slug) {
      return routes.product(slug)
    }
    
    // Fallback: if no slug but we have product data with name, try using name as slug
    // This handles old guest cart items
    if (props.item.name) {
      const slugFromName = props.item.name.toLowerCase().replace(/\s+/g, '-')
      console.warn('[CartPageItem] Using name as fallback slug:', slugFromName)
      // Don't use this - it won't work. Just disable link for old items.
    }
    
    return '#'
  })
  
  // ── Loading states ──
  const isUpdating = computed(() => cartStore.isItemLoading(props.item.id))
  const isRemoving = ref(false)
  
  // ── Stock checks ──
  const atMax = computed(() => {
    if (!props.item.max_quantity) return false
    return props.item.quantity >= props.item.max_quantity
  })
  
  const lowStock = computed(() => {
    if (!props.item.max_quantity) return false
    return props.item.max_quantity <= 5 && props.item.max_quantity > 0
  })
  
  // ── Actions ──
  const handleIncrement = async () => {
    if (atMax.value || isUpdating.value) return
    await cart.updateQuantity(props.item.id, props.item.quantity + 1)
  }
  
  const handleDecrement = async () => {
    if (isUpdating.value) return
    if (props.item.quantity <= 1) {
      return handleRemove()
    }
    await cart.updateQuantity(props.item.id, props.item.quantity - 1)
  }
  
  const handleRemove = async () => {
    isRemoving.value = true
    await cart.removeFromCart(props.item.id)
    isRemoving.value = false
  }
  </script>
  
  <style scoped>
  .fade-qty-enter-active,
  .fade-qty-leave-active {
    transition: all 0.15s ease;
  }
  .fade-qty-enter-from {
    opacity: 0;
    transform: translateY(4px);
  }
  .fade-qty-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
  </style>