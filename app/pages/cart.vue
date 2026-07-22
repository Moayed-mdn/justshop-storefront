<template>
  <div class="cart-page" :style="{ backgroundColor: 'var(--cart-page-bg)' }">
    <ClientOnly>
      <CartSkeleton v-if="loading && !initialized" />
      <div v-else>
        <CartBreadcrumb />

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <CartLoading v-if="loading && items.length > 0" />

          <div v-if="isEmpty && !loading">
            <CartEmpty />
          </div>

          <div v-if="!isEmpty">
            <CartHeader
              :items-count="itemsCount"
              @clear="handleClearCart"
            />

            <div class="mt-6 lg:grid lg:grid-cols-12 lg:gap-8">
              <!-- Cart Items List -->
              <div class="lg:col-span-7">
                <CartItemsList :items="items" />
              </div>

              <!-- Cart Summary (Desktop) -->
              <div class="lg:col-span-5 mt-6 lg:mt-0">
                <div class="sticky top-24">
                  <CartSummary
                    :total="total || 0"
                    :items-count="itemsCount"
                  />
                </div>
              </div>
            </div>
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
