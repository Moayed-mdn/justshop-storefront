<template>
  <section class="w-full overflow-hidden">
    <HeroBanner
      v-if="banner"
      :banner="banner"
    />
    <div v-else class="text-center py-10">
      No hero available
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HeroBannerDto } from '~/../src/core/api/dto/storefront'

defineProps<{
  banner: HeroBannerDto
}>()
</script>