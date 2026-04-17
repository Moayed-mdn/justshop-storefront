<template>
  <div class="flex items-center gap-1.5 px-2 py-1 rounded-full" :style="{ backgroundColor: 'var(--profile-google-badge-bg)' }">
    <img class="w-4 h-4" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="">
    <span class="text-xs" :style="{ color: 'var(--profile-google-badge-text)' }">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string
}

defineProps<Props>()
</script>
