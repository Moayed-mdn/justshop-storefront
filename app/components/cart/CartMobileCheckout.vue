<template>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-full"
      enter-to-class="translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0"
      leave-to-class="translate-y-full"
    >
      <div
        v-if="show"
        class="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200
               shadow-[0_-4px_12px_rgba(0,0,0,0.08)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] z-40
               lg:hidden"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-600">{{ $t('cart.total') }}</span>
          <span class="text-lg font-bold text-gray-900">{{ formatPrice(total) }}</span>
        </div>
        <button
          @click="$emit('checkout')"
          :disabled="loading"
          class="w-full py-3 bg-(--color-primary) text-white font-semibold rounded-md
                 hover:bg-(--green-950) transition-colors cursor-pointer
                 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {{ loading ? $t('checkout.redirecting') : $t('cart.checkout') }}
        </button>
      </div>
    </Transition>
  </template>
  
  <script setup lang="ts">
  import { formatPrice } from '../../utils/price'
  defineProps<{
    show: boolean
    total: number
    loading: boolean
  }>()
  
  defineEmits<{
    checkout: []
  }>()
  </script>