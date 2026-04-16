<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
      <h3 class="text-lg font-bold text-gray-900">{{ $t('orders.cancel_confirm_title') }}</h3>
      <p class="text-sm text-gray-500 mt-2">{{ $t('orders.cancel_confirm_message') }}</p>
      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300
                 rounded-md hover:bg-gray-50 cursor-pointer"
        >
          {{ $t('orders.cancel_keep') }}
        </button>
        <button
          @click="$emit('confirm')"
          :disabled="cancelling"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md
                 hover:bg-red-700 disabled:opacity-50 cursor-pointer"
        >
          {{ cancelling ? '...' : $t('orders.cancel_confirm_button') }}
        </button>
      </div>
    </div>
  </div>
</template>

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
