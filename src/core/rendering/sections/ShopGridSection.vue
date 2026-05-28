<template>
  <div>
    <LayoutShop :data="data" />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

const props = defineProps<{
  data: any
  pending?: boolean
}>()

provide('pending', computed(() => props.pending))
</script>
