<template>
  <div class="space-y-2">
    <button
      v-if="status === 'delivered'"
      @click="$emit('reorder')"
      :disabled="reordering"
      data-testid="order-detail-reorder-button"
      :style="{ borderColor: primary, color: primary }"
      class="w-full py-2.5 px-4 text-sm font-semibold border rounded-md transition-colors 
             disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 hover-outline-btn"
    >
      <UiLoadingSpinner v-if="reordering" size="sm" />
      {{ $t('orders.buy_again') }}
    </button>

    <button
      v-if="canCancel"
      @click="$emit('cancel')"
      data-testid="order-detail-cancel-button"
      class="w-full py-2.5 px-4 text-sm font-semibold text-(--color-error) border border-(--color-error)
             rounded-md hover:bg-(--color-error-bg) transition-colors cursor-pointer"
    >
      {{ $t('orders.cancel_order') }}
    </button>
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

defineProps<{
  status: string
  canCancel: boolean
  reordering: boolean
}>()

defineEmits<{
  (e: 'reorder'): void
  (e: 'cancel'): void
}>()
</script>

<style scoped>
.hover-outline-btn:hover:not(:disabled) {
  background-color: rgba(59, 130, 246, 0.05);
}
</style>
