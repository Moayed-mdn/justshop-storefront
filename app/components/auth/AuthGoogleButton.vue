<template>
  <button
    type="button"
    data-testid="google-login-button"
    class="auth-google-btn w-full flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors"
    :style="{
      color: 'var(--color-text-secondary)',
      background: 'var(--color-bg-page)',
      borderColor: 'var(--color-border-default)'
    }"
    @click="$emit('click')"
  >
    <img class="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo">
    <span class="ml-2">{{ text }}</span>
  </button>
</template>

<style scoped>
.auth-google-btn:hover {
  background: var(--color-bg-hover) !important;
}

.auth-google-btn:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
</style>

<script setup lang="ts">
defineProps<{
  text: string
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>
