<template>
  <NuxtLayout :name="layoutName">
    <slot />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  layout?: string
}>()

const layoutName = computed(() => (props.layout || 'default') as any)
</script>
