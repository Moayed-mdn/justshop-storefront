<template>
  <div
    v-if="message"
    class="p-3 text-sm rounded-md"
    :class="type === 'error' ? 'text-red-600 bg-red-50' : 'text-[#003D29] bg-gray-50 border-l-4 border-[#003D29] rounded-r-md'"
    :role="type === 'error' ? 'alert' : 'status'"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'error' | 'success'
  message?: string
}>()
</script>
