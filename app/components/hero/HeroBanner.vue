<template>
  <div
    class="relative w-full flex items-center overflow-hidden
           min-h-(--hero-h-mobile) md:min-h-(--hero-h-desktop)"
    :style="backgroundStyle"
  >
    <!-- Overlay -->
    <!-- <div 
      v-if="banner.visual.type === 'image'" 
      class="absolute inset-0 bg-(--hero-overlay-bg)"
      aria-hidden="true"
    /> -->

    <AppContainer class="relative">
      <div class="max-w-sm  md:max-w-xl text-shadow-(--hero-text-shadow)">

        <h1 class="text-3xl md:text-5xl font-extrabold capitalize  leading-tight text-(--hero-title-color)">
          {{ banner.title }}
        </h1>
    
        <p v-if="banner.subtitle" class="mt-4 text-base md:text-lg first-letter:uppercase  leading-relaxed font-normal text-(--hero-subtitle-color)">
          {{ banner.subtitle }}
        </p>
    
        <NuxtLinkLocale
          v-if="banner.ctaText"
          :to="banner.ctaUrl || '#'"
          class="inline-block mt-8 px-8 py-3 text-sm font-semibold transition-all duration-200
                 rounded-(--radius-md) bg-(--hero-btn-bg) text-(--hero-btn-text) cursor-pointer
                 hover:bg-(--hero-btn-hover) shadow-(--shadow-sm) hover:shadow-(--shadow-md)"
        >
          {{ banner.ctaText }}
        </NuxtLinkLocale>
            
      </div>
    </AppContainer>
  </div>
</template>

<script setup lang="ts">
import type { HeroBannerDto } from '~/../src/core/api/dto/storefront'

const props = defineProps<{
  banner: HeroBannerDto
}>()

const backgroundStyle = computed(() => {
  if (props.banner.visual.type === 'image') {
    return {
      backgroundImage: `url(${props.banner.visual.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return {
    backgroundImage: `linear-gradient(135deg, ${props.banner.visual.gradientFrom}, ${props.banner.visual.gradientTo})`
  }
})
</script>
