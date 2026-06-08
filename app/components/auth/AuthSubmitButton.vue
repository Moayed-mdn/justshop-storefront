<template>
  <button
    type="submit"
    :disabled="loading"
    class="w-full flex justify-center px-4 py-2 text-sm font-medium text-white 
           bg-(--color-primary) border border-transparent rounded-md shadow-sm 
           hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-(--color-primary)/30
           disabled:opacity-50 transition-colors"
  >
    <span v-if="loading" class="flex items-center gap-2">
      <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {{ loadingText }}
    </span>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean
  text: string
  loadingText: string
}>()
</script>
