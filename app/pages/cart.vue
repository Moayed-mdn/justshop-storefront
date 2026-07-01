<template>
  <div class="cart-page" :style="{ backgroundColor: 'var(--cart-page-bg)' }">
    <ClientOnly>
      <CartSkeleton v-if="loading && !initialized" />
      <div v-else>
        <CartBreadcrumb />

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <CartLoading v-if="loading && items.length > 0" />

          <div v-if="!isEmpty">
            <CartHeader
              :items-count="itemsCount"
              @clear="handleClearCart"
            />
          </div>
        </div>

        <CartMobileCheckout
          :show="!isEmpty && !loading"
          :total="total || 0"
          :loading="checkoutLoading"
          @checkout="handleMobileCheckout"
        />

        <CartClearModal
          :show="showClearConfirm"
          @cancel="showClearConfirm = false"
          @confirm="confirmClear"
        />
      </div>
      <template #fallback>
        <CartSkeleton />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const cart = useCart()
const { startCheckout, loading: checkoutLoading } = useCheckout()
const { showSuccessToast } = useAppToast()

const {
  items,
  total,
  itemsCount,
  isEmpty,
  loading,
  initialized,
} = cart

const showClearConfirm = ref(false)

const handleClearCart = () => {
  showClearConfirm.value = true
}

const confirmClear = async () => {
  showClearConfirm.value = false
  const result = await cart.clearCart()
  if (result.success) {
    showSuccessToast('Cart cleared')
  }
}

const handleMobileCheckout = async () => {
  await startCheckout()
}

definePageMeta({
  layout: 'system',
})

useHead({
  title: 'Shopping Cart',
  meta: [
    {
      name: 'description',
      content: 'Review and manage your shopping cart items',
    },
  ],
})
</script>

<style scoped>
@media (max-width: 1023px) {
  .cart-page {
    padding-bottom: 100px;
  }
}
</style>
