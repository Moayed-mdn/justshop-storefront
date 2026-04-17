<template>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="show"
          class="fixed inset-0 flex items-center justify-center z-50 p-4"
          :style="{ background: 'var(--color-overlay-medium)' }"
          @click.self="$emit('cancel')"
        >
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="show"
              class="rounded-lg p-6 max-w-sm w-full shadow-xl"
              :style="{ background: 'var(--color-bg-page)' }"
            >
              <h3 class="text-lg font-bold" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.cancel_confirm_title') }}</h3>
              <p class="text-sm mt-2" :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.cancel_confirm_message') }}</p>
              <div class="flex justify-end gap-3 mt-6">
                <button
                  @click="$emit('cancel')"
                  class="orders-cancel-keep px-4 py-2 text-sm font-medium border rounded-md cursor-pointer transition-colors"
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
                  :disabled="loading"
                  class="orders-cancel-confirm px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 cursor-pointer transition-colors flex items-center gap-2"
                  :style="{
                    color: 'var(--color-text-inverse)',
                    background: 'color-mix(in srgb, var(--color-error) 85%, transparent)'
                  }"
                >
                  <svg
                    v-if="loading"
                    class="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {{ loading ? '...' : $t('orders.cancel_confirm_button') }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    show: boolean
    loading: boolean
  }>()
  
  defineEmits<{
    'cancel': []
    'confirm': []
  }>()
  </script>

  <style scoped>
  .orders-cancel-keep:hover {
    background: var(--color-bg-hover) !important;
  }

  .orders-cancel-confirm:hover {
    background: var(--color-error) !important;
  }
  </style>