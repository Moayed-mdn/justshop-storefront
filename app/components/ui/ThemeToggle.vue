<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    @click="toggleTheme"
    class="flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
    :style="{
      background: 'var(--color-bg-surface)',
      color: 'var(--color-text-primary)'
    }"
    aria-label="Toggle theme"
    type="button"
  >
    <span v-if="theme === 'dark'">🌙</span>
    <span v-else>☀️</span>
  </button>
</template>

<style scoped>
button:hover {
  background: var(--color-bg-hover);
}

button:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
</style>
