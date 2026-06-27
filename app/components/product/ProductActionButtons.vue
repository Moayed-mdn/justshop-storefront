<template>
  <div class="space-y-2">
    <div class="flex flex-col sm:flex-row gap-3">
      <button
        data-testid="product-add-to-cart-button"
        @click="$emit('add-to-cart')"
        :disabled="!canAddToCart || isAddingToCart"
        :style="{
          backgroundColor: primary,
          color: onPrimary,
        }"
        class="flex-1 py-3 px-6 font-semibold rounded-md transition-colors disabled:opacity-50
               disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer
               hover-primary-button"
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
        :style="{
          borderColor: primary,
          color: primary,
        }"
        class="flex-1 sm:flex-initial py-3 px-6 border-2 font-semibold rounded-md transition-colors
               disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
               hover-secondary-button"
        type="button"
      >
        {{ $t('product.buy_now') }}
      </button>
    </div>

    <p
      v-if="disabledReason && !canAddToCart"
      :style="{ color: 'var(--color-error)' }"
      class="text-sm"
      data-testid="product-action-error"
    >
      {{ disabledReason }}
    </p>
  </div>
</template>

<script setup lang="ts">
// Inline theme colors for SSR compatibility
const getCSSVar = (varName: string, fallback: string): string => {
  if (!process.client) return fallback
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    return value || fallback
  } catch {
    return fallback
  }
}

const primary = computed(() => getCSSVar('--color-primary', '#3b82f6'))
const onPrimary = computed(() => getCSSVar('--color-on-primary', '#ffffff'))

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

<style scoped>
.hover-primary-button:hover:not(:disabled) {
  filter: brightness(0.9);
}

.hover-secondary-button:hover:not(:disabled) {
  background-color: rgba(59, 130, 246, 0.05);
}
</style>