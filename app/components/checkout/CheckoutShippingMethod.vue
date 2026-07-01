<template>
  <div class="checkout-step">
    <h2 class="text-2xl font-semibold mb-6">{{ $t('checkout.shipping_method') }}</h2>

    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">{{ $t('checkout.loading_shipping_methods') }}</p>
    </div>

    <div v-else-if="methods.length === 0" class="text-center py-8">
      <p class="text-gray-600">{{ $t('checkout.no_shipping_methods') }}</p>
    </div>

    <div v-else class="space-y-4 mb-6">
      <div
        v-for="method in methods"
        :key="method.id"
        class="shipping-method-card border rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-colors"
        :class="{ 
          'border-primary-500 bg-primary-50': selectedMethod?.id === method.id,
          'border-gray-200': selectedMethod?.id !== method.id
        }"
        @click="$emit('select', method)"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3 flex-1">
            <div class="flex-shrink-0 mt-1">
              <div 
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                :class="{
                  'border-primary-500': selectedMethod?.id === method.id,
                  'border-gray-300': selectedMethod?.id !== method.id
                }"
              >
                <div 
                  v-if="selectedMethod?.id === method.id"
                  class="w-3 h-3 rounded-full bg-primary-500"
                ></div>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold mb-1">{{ method.name }}</h3>
              <p v-if="method.description" class="text-sm text-gray-600 mb-1">
                {{ method.description }}
              </p>
              <p v-if="method.delivery_estimate" class="text-sm text-gray-500">
                {{ method.delivery_estimate }}
              </p>
            </div>
          </div>
          <div class="flex-shrink-0 ml-4">
            <p class="font-semibold text-lg">{{ method.formatted_price || `$${method.price.toFixed(2)}` }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-4">
      <button @click="$emit('back')" class="btn btn-outline flex-1">
        {{ $t('common.back') }}
      </button>
      <button
        @click="$emit('continue')"
        :disabled="!selectedMethod"
        class="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ $t('checkout.continue_to_payment') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShippingMethod } from '~/types/checkout'

defineProps<{
  methods: ShippingMethod[]
  selectedMethod: ShippingMethod | null
  loading: boolean
}>()

defineEmits<{
  select: [method: ShippingMethod]
  back: []
  continue: []
}>()
</script>

<style scoped>
.checkout-step {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  padding: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--color-primary-600, #2563eb);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-700, #1d4ed8);
}

.btn-outline {
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background-color: #f9fafb;
}
</style>
