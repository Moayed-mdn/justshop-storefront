<template>
  <div class="space-y-2">
    <button
      v-if="status === 'delivered'"
      @click="$emit('reorder')"
      :disabled="reordering"
      data-testid="order-detail-reorder-button"
      class="w-full py-2.5 px-4 text-sm font-semibold text-(--color-primary) border border-(--color-primary)
             rounded-md hover:bg-(--color-primary)/5 transition-colors disabled:opacity-50 cursor-pointer
             flex items-center justify-center gap-2"
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
