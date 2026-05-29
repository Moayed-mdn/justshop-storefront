<template>
  <section
    class="runtime-section-boundary"
    :data-section-id="sectionId"
    :data-section-type="sectionType"
    :data-section-state="dataState"
  >
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  sectionId: string
  sectionType: string
  dataState?: 'ready' | 'empty' | 'error'
}>()
</script>
