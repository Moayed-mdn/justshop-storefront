<template>
  <div class="relative">
    <div class="absolute inset-0 flex items-center">
      <div class="w-full border-t border-gray-300" />
    </div>
    <div class="relative flex justify-center text-sm">
      <span class="px-2 text-gray-500 bg-white">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
