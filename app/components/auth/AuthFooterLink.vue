<template>
  <p class="text-sm text-center text-gray-600">
    {{ text }}
    <NuxtLinkLocale
      :to="to"
      class="font-medium text-(--color-primary) hover:text-[#00251C]"
    >
      {{ linkText }}
    </NuxtLinkLocale>
  </p>
</template>

<script setup lang="ts">
defineProps<{
  text: string
  linkText: string
  to: string
}>()
</script>
