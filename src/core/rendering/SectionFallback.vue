<template>
  <div class="section-fallback p-8 border-2 border-dashed border-gray-200 rounded text-center text-gray-400">
    <p>Component for section type "<strong>{{ type }}</strong>" not found in registry.</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: string
}>()
</script>
