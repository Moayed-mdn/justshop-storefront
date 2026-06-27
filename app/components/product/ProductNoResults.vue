<!-- app/components/product/ProductNoResults.vue -->
<template>
    <div class="flex flex-col items-center justify-center gap-4 py-20 text-center" data-testid="product-no-results">
      <!-- Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-16 h-16 text-(--color-text-muted)"
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
  
      <h3 class="text-xl font-semibold text-(--color-text-secondary)">
        {{ t('product.no_results_title') }}
      </h3>
  
      <p class="text-sm text-(--color-text-muted) max-w-xs">
        {{ t('product.no_results_description') }}
      </p>
  
      <button
        v-if="canReset"
        data-testid="product-no-results-reset"
        :style="{ backgroundColor: accent, color: onAccent }"
        class="mt-2 px-6 py-2 rounded border cursor-pointer text-sm font-medium transition-colors hover-accent-btn"
        @click="resetFilters"
      >
        {{ t('product.no_results_reset') }}
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

  const accent = computed(() => getCSSVar('--color-accent', '#FF7006'))
  const onAccent = computed(() => getCSSVar('--color-text-inverse', '#ffffff'))
  
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
  
  <style scoped>
  .hover-accent-btn:hover:not(:disabled) {
    filter: brightness(0.9);
  }
  </style>