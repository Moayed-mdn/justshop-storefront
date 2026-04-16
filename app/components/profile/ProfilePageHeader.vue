<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
    <p class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
}

defineProps<Props>()
</script>
