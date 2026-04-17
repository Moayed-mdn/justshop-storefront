<template>
  <div>
    <h1 class="text-2xl font-bold" :style="{ color: 'var(--profile-title)' }">{{ title }}</h1>
    <p class="text-sm mt-1" :style="{ color: 'var(--profile-subtitle)' }">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
}

defineProps<Props>()
</script>
