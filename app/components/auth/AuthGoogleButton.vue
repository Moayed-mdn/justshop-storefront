<template>
  <button
    type="button"
    class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium 
           text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm 
           hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 
           transition-colors"
    @click="$emit('click')"
  >
    <img class="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo">
    <span class="ml-2">{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>
