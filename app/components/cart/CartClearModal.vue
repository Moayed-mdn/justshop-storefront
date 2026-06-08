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
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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
            <div v-if="show" class="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h3 class="text-lg font-bold text-gray-900">{{ $t('cart.clear_confirm_title') }}</h3>
              <p class="text-sm text-gray-500 mt-2">{{ $t('cart.clear_confirm_message') }}</p>
              <div class="flex justify-end gap-3 mt-6">
                <button
                  @click="$emit('cancel')"
                  class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300
                         rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {{ $t('cart.cancel') }}
                </button>
                <button
                  @click="$emit('confirm')"
                  data-testid="confirm-clear"
                  class="px-4 py-2 text-sm font-medium text-white bg-(--color-error) rounded-md
                         hover:bg-(--color-error-hover) cursor-pointer transition-colors"
                >
                  {{ $t('cart.clear_cart') }}
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
  }>()
  
  defineEmits<{
    cancel: []
    confirm: []
  }>()
  </script>