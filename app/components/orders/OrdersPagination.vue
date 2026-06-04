<template>
    <div class="flex items-center justify-center gap-2 pt-6">
      <button
        @click="$emit('update:page', currentPage - 1)"
        :disabled="currentPage <= 1"
        data-testid="orders-pagination-prev"
        class="orders-pagination__btn px-3 py-1.5 text-sm border rounded-md
               disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        :style="{
          borderColor: 'var(--color-border-subtle)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)'
        }"
      >
        ←
      </button>
  
      <span data-testid="orders-pagination-info" class="text-sm px-3" :style="{ color: 'var(--color-text-muted)' }">
        {{ currentPage }} / {{ totalPages }}
      </span>
  
      <button
        @click="$emit('update:page', currentPage + 1)"
        :disabled="currentPage >= totalPages"
        data-testid="orders-pagination-next"
        class="orders-pagination__btn px-3 py-1.5 text-sm border rounded-md
               disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        :style="{
          borderColor: 'var(--color-border-subtle)',
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)'
        }"
      >
        →
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    currentPage: number
    totalPages: number
  }>()
  
  defineEmits<{
    'update:page': [page: number]
  }>()
  </script>

  <style scoped>
  .orders-pagination__btn {
    border-color: var(--color-border-subtle);
    background-color: var(--color-surface);
    color: var(--color-text-primary);
  }
  .orders-pagination__btn:hover:not(:disabled) {
    background-color: var(--color-surface-hover, var(--color-surface-subtle));
  }
  .orders-pagination__btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  </style>