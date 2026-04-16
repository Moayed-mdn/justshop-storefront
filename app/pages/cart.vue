<template>
  <div class="min-h-[60vh] bg-gray-50">
    <!-- Show skeleton on initial load -->
    <CartSkeleton v-if="!isHydrated" />

    <!-- Main content -->
    <ClientOnly v-else>
      <CartBreadcrumb />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <!-- Loading State -->
        <CartLoading v-if="loading" />

        <!-- Empty Cart -->
        <CartEmpty v-else-if="isEmpty" />

        <!-- Cart Content -->
        <div v-else>
          <CartHeader
            :items-count="itemsCount"
            @clear="handleClearCart"
          />

          <!-- Two Column Layout -->
          <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <CartItemsList :items="items" />

            <!-- Order Summary -->
            <div class="w-full lg:w-[380px] flex-shrink-0">
              <div class="lg:sticky lg:top-4">
                <CartSummary
                  :total="total"
                  :items-count="itemsCount"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Sticky Checkout Bar -->
      <CartMobileCheckout
        :show="!isEmpty && !loading"
        :total="total"
        :loading="checkoutLoading"
        @checkout="handleMobileCheckout"
      />

      <!-- Clear Cart Confirmation Modal -->
      <CartClearModal
        :show="showClearConfirm"
        @cancel="showClearConfirm = false"
        @confirm="confirmClear"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
// Composables
const cart = useCart()
const { startCheckout, loading: checkoutLoading } = useCheckout()
const { showSuccessToast } = useAppToast()

// State
const {
  items,
  total,
  itemsCount,
  isEmpty,
  loading,
} = cart

const showClearConfirm = ref(false)
const isHydrated = ref(false)

// Lifecycle
onMounted(() => {
  isHydrated.value = true
})

// Methods
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

// Meta
definePageMeta({
  layout: 'default',
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
/* Add padding at the bottom for mobile sticky bar */
@media (max-width: 1023px) {
  .min-h-\[60vh\] {
    padding-bottom: 100px;
  }
}
</style>