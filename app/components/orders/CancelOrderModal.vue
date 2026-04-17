<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-50 p-4"
    :style="{ background: 'var(--color-overlay-medium)' }"
    @click.self="$emit('close')"
  >
    <div class="rounded-lg p-6 max-w-sm w-full shadow-xl" :style="{ background: 'var(--color-bg-page)' }">
      <h3 class="text-lg font-bold" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.cancel_confirm_title') }}</h3>
      <p class="text-sm mt-2" :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.cancel_confirm_message') }}</p>
      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="$emit('close')"
          class="orders-cancel-keep px-4 py-2 text-sm font-medium border rounded-md cursor-pointer"
          :style="{
            color: 'var(--color-text-secondary)',
            borderColor: 'var(--color-border-default)',
            background: 'var(--color-bg-page)'
          }"
        >
          {{ $t('orders.cancel_keep') }}
        </button>
        <button
          @click="$emit('confirm')"
          :disabled="cancelling"
          class="orders-cancel-confirm px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 cursor-pointer"
          :style="{
            color: 'var(--color-text-inverse)',
            background: 'color-mix(in srgb, var(--color-error) 85%, transparent)'
          }"
        >
          {{ cancelling ? '...' : $t('orders.cancel_confirm_button') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-cancel-keep:hover {
  background: var(--color-bg-hover) !important;
}

.orders-cancel-confirm:hover {
  background: var(--color-error) !important;
}
</style>

<script setup lang="ts">
defineProps<{
  show: boolean
  cancelling: boolean
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>
