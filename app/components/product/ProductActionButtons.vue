<template>
  <div class="space-y-2">
    <div class="flex flex-col sm:flex-row gap-3">
      <button
        data-testid="product-add-to-cart-button"
        @click="$emit('add-to-cart')"
        :disabled="!canAddToCart || isAddingToCart"
        class="flex-1 py-3 px-6 bg-(--color-primary) text-(--color-on-primary) font-semibold rounded-md
               hover:bg-(--color-primary-hover) transition-colors disabled:opacity-50
               disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        type="button"
      >
        <svg
          v-if="isAddingToCart"
          class="animate-spin h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span v-else-if="isInCart" class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ $t('product.view_cart') }}
        </span>
        <span v-else>
          {{ $t('product.add_to_cart') }}
        </span>
      </button>

      <button
        data-testid="product-buy-now-button"
        @click="$emit('buy-now')"
        :disabled="!canAddToCart"
        class="flex-1 sm:flex-initial py-3 px-6 border-2 border-(--color-primary) text-(--color-primary)
               font-semibold rounded-md hover:bg-(--color-primary)/5 transition-colors
               disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        type="button"
      >
        {{ $t('product.buy_now') }}
      </button>
    </div>

    <p
      v-if="disabledReason && !canAddToCart"
      class="text-sm text-(--color-error)"
      data-testid="product-action-error"
    >
      {{ disabledReason }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  canAddToCart: boolean
  isAddingToCart: boolean
  isInCart: boolean
  disabledReason?: string
}>()

defineEmits<{
  'add-to-cart': []
  'buy-now': []
}>()
</script>