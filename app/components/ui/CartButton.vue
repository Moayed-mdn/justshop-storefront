<template>
  <div class="cart-button-wrapper">
    <transition name="cart-switch" mode="out-in">
      <!-- NOT IN CART -->
      <button
        v-if="!cartItem"
        key="add-btn"
        @click="handle(add)"
        :disabled="isLoading"
        class="py-2 px-4 mt-2 rounded-full border font-bold transition-all duration-300
               border-(--card-btn-border) text-(--card-btn-text) cursor-pointer
               hover:bg-(--card-btn-hover) hover:border-(--card-btn-hover)
               hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="!isLoading">{{ $t('cart.add_to_cart') }}</span>
        <span v-else class="animate-pulse">...</span>
      </button>

      <!-- IN CART -->
      <div
        v-else
        key="counter"
        class="flex w-fit min-w-[125px] items-center justify-between
               mt-2 px-3 py-1 rounded-full border
               border-(--card-btn-border) bg-transparent"
      >
        <button
          @click="handle(decrement)"
          :disabled="isLoading"
          class="p-1 disabled:opacity-50"
        >
          <Icon
            :name="cartItem.quantity === 1
              ? 'heroicons:trash-20-solid'
              : 'heroicons:minus'"
            
            class="w-5 h-5 hover:text-(--color-primary) hover:scale-125"
            :class="cartItem.quantity === 1 ? 'hover:text-red-500' : 'hover:text-(--color-primary)'"
          />
        </button>

        <transition name="fade-slide" mode="out-in">
          <span :key="cartItem.quantity" class="font-bold px-2">
            {{ cartItem.quantity }}
          </span>
        </transition>

        <button
          @click="handle(increment)"
          :disabled="isLoading || atMaxQuantity"
          class="p-1 disabled:opacity-50"
        >
          <Icon
            name="heroicons:plus-20-solid"
            class="w-5 h-5 hover:text-(--color-primary) hover:scale-125"
          />
        </button>
      </div>

    </transition>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  productId: number
  productVariantId: number            
  name: string
  price: string
  image?: string | null
  maxQuantity?: number
}>()

const cart = useCart()

const cartItem = computed(() =>
  cart.getCartItem(props.productId, props.productVariantId)
)

const atMaxQuantity = computed(() => {
  if (!cartItem.value || !props.maxQuantity) return false
  return cartItem.value.quantity >= props.maxQuantity
})

const localLoading = ref(false)

const isLoading = computed(() => {
  if (localLoading.value) return true
  if (cartItem.value) return cart.isItemLoading(cartItem.value.id)
  // ✅ Updated key to match store's tempId format
  return cart.isItemLoading(
    `adding_${props.productId}_${props.productVariantId}`
  )
})

// ✅ Fixed: added catch block to prevent unhandled promise rejection
const handle = async (fn: () => Promise<any>) => {
  if (isLoading.value) return

  localLoading.value = true
  try {
    await fn()
  } catch {
    // error is already set on cartStore.error and handled by useCart
  } finally {
    setTimeout(() => {
      localLoading.value = false
    }, 250)
  }
}

const add = async () => {
  await cart.addToCart({
    product_id: props.productId,
    product_variant_id: props.productVariantId,
    name: props.name,
    price: +props.price,
    image: props.image,
    quantity: 1,
    max_quantity: props.maxQuantity,
  })
}

const increment = async () => {
  if (!cartItem.value) return
  await cart.increment(cartItem.value)
}

const decrement = async () => {
  if (!cartItem.value) return
  await cart.decrement(cartItem.value)
}
</script>


<style scoped>
/* ===== Add-to-Cart ↔ Counter switch ===== */
.cart-switch-enter-active,
.cart-switch-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.cart-switch-enter-from {
  opacity: 0;
  transform: scale(0.92);
}

.cart-switch-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

/* ===== Quantity number change ===== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>