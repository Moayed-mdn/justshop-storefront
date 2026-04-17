<template>
  <div class="relative">
    <div class="absolute inset-0 flex items-center">
      <div class="w-full border-t" :style="{ borderColor: 'var(--color-border-default)' }" />
    </div>
    <div class="relative flex justify-center text-sm">
      <span
        class="px-2"
        :style="{ color: 'var(--color-text-muted)', background: 'var(--color-bg-page)' }"
      >{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
