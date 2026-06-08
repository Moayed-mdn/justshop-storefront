<template>
    <div class="flex items-center gap-4" data-testid="product-quantity-selector">
      <label class="text-sm font-medium text-(--color-text-primary)">
        {{ $t('product.quantity') }}:
      </label>
      <div class="flex items-center border border-(--color-border-default) rounded-lg overflow-hidden">
        <button
          data-testid="product-quantity-decrease"
          @click="decreaseQuantity"
          :disabled="modelValue <= 1"
          class="px-3 py-2 hover:bg-(--color-bg-hover) transition-colors disabled:opacity-40 cursor-pointer"
          type="button"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
  
        <input
          data-testid="product-quantity-input"
          :value="modelValue"
          @input="updateQuantity"
          type="number"
          min="1"
          :max="maxQuantity"
          class="w-16 py-2 text-center border-x border-(--color-border-default) focus:outline-none"
        >
  
        <button
          data-testid="product-quantity-increase"
          @click="increaseQuantity"
          :disabled="modelValue >= maxQuantity"
          class="px-3 py-2 hover:bg-(--color-bg-hover) transition-colors disabled:opacity-40 cursor-pointer"
          type="button"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    modelValue: number
    maxQuantity: number
  }>()
  
  const emit = defineEmits<{
    'update:modelValue': [value: number]
  }>()
  
  const decreaseQuantity = () => {
    emit('update:modelValue', Math.max(1, props.modelValue - 1))
  }
  
  const increaseQuantity = () => {
    emit('update:modelValue', Math.min(props.maxQuantity, props.modelValue + 1))
  }
  
  const updateQuantity = (event: Event) => {
    const target = event.target as HTMLInputElement
    const value = parseInt(target.value) || 1
    emit('update:modelValue', Math.max(1, Math.min(props.maxQuantity, value)))
  }
  </script>