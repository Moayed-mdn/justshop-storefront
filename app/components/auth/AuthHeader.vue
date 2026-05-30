<template>
  <div class="flex flex-col items-center">
    <div class="w-40 mx-auto">
      <NuxtLinkLocale :to="routes.home()" class="block w-full h-full">
        <img src="~/assets/icons/logo.png" alt="Logo" class="h-full w-full">
      </NuxtLinkLocale>
    </div>
    <h2 class="mt-6 text-2xl font-bold text-center" :style="{ color: 'var(--color-text-primary)' }">
      {{ title }}
    </h2>
  </div>
</template>

<script setup lang="ts">
const routes = useStorefrontRoutes()

defineProps<{
  title: string
}>()
</script>
