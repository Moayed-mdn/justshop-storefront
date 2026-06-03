<!-- app/components/product/ProductNoResults.vue -->
<template>
    <div class="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <!-- Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-16 h-16 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8 11h6"
        />
      </svg>
  
      <h3 class="text-xl font-semibold text-gray-600">
        {{ t('product.no_results_title') }}
      </h3>
  
      <p class="text-sm text-gray-400 max-w-xs">
        {{ t('product.no_results_description') }}
      </p>
  
      <button
        v-if="canReset"
        class="mt-2 px-6 py-2 rounded border cursor-pointer
               text-sm font-medium
               bg-(--color-accent) text-white
               hover:opacity-90 transition-opacity"
        @click="resetFilters"
      >
        {{ t('product.no_results_reset') }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  const { t } = useI18n()

  let resetFilters: (() => void) | undefined
  let canReset = false

  try {
    const filters = useProductFilters()
    resetFilters = filters.resetFilters
    canReset = true
  } catch {
    // filter context unavailable — hide reset button
    canReset = false
  }
  </script>