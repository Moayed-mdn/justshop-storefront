<template>
    <div class="flex items-center justify-center gap-2 pt-6">
      <button
        @click="$emit('update:page', currentPage - 1)"
        :disabled="currentPage <= 1"
        class="px-3 py-1.5 text-sm border border-gray-200 rounded-md
               hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed 
               cursor-pointer transition-colors"
      >
        ←
      </button>
  
      <span class="text-sm text-gray-600 px-3">
        {{ currentPage }} / {{ totalPages }}
      </span>
  
      <button
        @click="$emit('update:page', currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="px-3 py-1.5 text-sm border border-gray-200 rounded-md
               hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed 
               cursor-pointer transition-colors"
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