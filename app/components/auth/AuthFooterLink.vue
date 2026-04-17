<template>
  <p class="text-sm text-center" :style="{ color: 'var(--color-text-secondary)' }">
    {{ text }}
    <NuxtLinkLocale
      :to="to"
      class="font-medium text-(--color-primary) hover:text-(--green-950)"
    >
      {{ linkText }}
    </NuxtLinkLocale>
  </p>
</template>
<!-- #023B25 -->
<script setup lang="ts">
defineProps<{
  text: string
  linkText: string
  to: string
}>()
</script>
