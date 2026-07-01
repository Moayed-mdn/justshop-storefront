<template>
  <div class="order-summary sticky top-4">
    <h3 class="text-xl font-semibold mb-4">{{ $t('checkout.order_summary') }}</h3>

    <!-- Cart Items -->
    <div v-if="cart?.items && cart.items.length > 0" class="space-y-3 mb-4 max-h-96 overflow-y-auto">
      <div v-for="item in cart.items" :key="item.id" class="flex gap-3">
        <div class="flex-shrink-0">
          <img
            v-if="item.image_url"
            :src="item.image_url"
            :alt="item.product_name"
            class="w-16 h-16 object-cover rounded"
          />
          <div v-else class="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm truncate">{{ item.product_name }}</p>
          <p v-if="item.sku" class="text-xs text-gray-600">{{ item.sku }}</p>
          <p class="text-xs text-gray-600 mt-1">
            {{ $t('product.quantity') }}: {{ item.quantity }} × {{ formatPrice(item.price) }}
          </p>
        </div>
        <div class="flex-shrink-0">
          <p class="font-medium">{{ formatPrice(item.subtotal) }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      {{ $t('cart.empty') }}
    </div>

    <!-- Totals -->
    <div class="border-t pt-4 space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">{{ $t('checkout.subtotal') }}</span>
        <span class="font-medium">{{ formatPrice(cart?.subtotal || 0) }}</span>
      </div>
      
      <div v-if="shippingMethod" class="flex justify-between text-sm">
        <div class="flex-1">
          <span class="text-gray-600">{{ $t('checkout.shipping') }}</span>
          <span class="block text-xs text-gray-500">{{ shippingMethod.name }}</span>
        </div>
        <span class="font-medium">{{ shippingMethod.formatted_price || formatPrice(shippingMethod.price) }}</span>
      </div>

      <div v-else-if="showShippingPlaceholder" class="flex justify-between text-sm">
        <span class="text-gray-600">{{ $t('checkout.shipping') }}</span>
        <span class="text-gray-500">{{ $t('checkout.calculated_at_next_step') }}</span>
      </div>

      <div class="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
        <span>{{ $t('checkout.total') }}</span>
        <span>{{ formatPrice(total) }}</span>
      </div>
    </div>

    <!-- Trust Badges -->
    <div class="mt-6 pt-6 border-t">
      <div class="flex items-center gap-2 text-xs text-gray-600 mb-2">
        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{{ $t('checkout.secure_checkout') }}</span>
      </div>
      <div class="flex items-center gap-2 text-xs text-gray-600">
        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <span>{{ $t('checkout.ssl_encrypted') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShippingMethod } from '~/types/checkout'

const props = defineProps<{
  cart: any
  shippingMethod: ShippingMethod | null
  total: number
  showShippingPlaceholder?: boolean
}>()

const { t } = useI18n()

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.cart?.currency || 'USD',
  }).format(amount)
}
</script>

<style scoped>
.order-summary {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  padding: 1.5rem;
}
</style>
