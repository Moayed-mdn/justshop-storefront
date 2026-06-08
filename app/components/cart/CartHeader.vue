<template>
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
        {{ $t('cart.title') }}
        <span class="text-gray-400 font-normal text-base">
          ({{ itemsCount }} {{ itemsCount === 1 ? $t('cart.item') : $t('cart.items') }})
        </span>
      </h1>
  
      <button
        @click="$emit('clear')"
        class="text-sm text-(--color-error) hover:text-(--color-error-hover) hover:underline
               transition-colors cursor-pointer"
      >
        {{ $t('cart.clear_cart') }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    itemsCount: number
  }>()
  
  defineEmits<{
    clear: []
  }>()
  </script>