<template>
  <div
    v-if="message"
    class="p-3 text-sm rounded-md"
    :class="type === 'error' ? 'text-(--color-error) bg-(--color-bg-hover)' : 'text-(--color-primary) bg-(--color-bg-hover) border-l-4 border-(--color-primary) rounded-r-md'"
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
