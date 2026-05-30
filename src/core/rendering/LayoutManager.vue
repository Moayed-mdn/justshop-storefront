<template>
  <RuntimeLayout>
    <slot />
  </RuntimeLayout>
</template>

<script setup lang="ts">
import RuntimeLayout from '../../../app/layouts/runtime.vue'

const props = defineProps<{
  layout?: string
}>()
</script>
