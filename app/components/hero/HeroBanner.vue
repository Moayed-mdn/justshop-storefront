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

        <h1 class="text-3xl md:text-5xl font-extrabold  leading-tight text-(--hero-title-color)">
          {{ bannerData.title }}
        </h1>
    
        <p v-if="bannerData.subtitle" class="mt-4 text-base md:text-lg leading-relaxed font-normal text-(--hero-subtitle-color)">
          {{ bannerData.subtitle }}
        </p>
    
        <NuxtLinkLocale
          v-if="bannerData.cat_text"
          :to="bannerData.cat_url || '#'"
          class="inline-block mt-8 px-8 py-3 text-sm font-semibold transition-all duration-200
                 rounded-(--radius-md) bg-(--hero-btn-bg) text-(--hero-btn-text)  cursor-pointer
                 hover:bg-gray-100 shadow-(--shadow-sm) hover:shadow-(--shadow-md)"
        >
          {{ bannerData.cat_text }}
        </NuxtLinkLocale>
            
      </div>
    </AppContainer>
  </div>
</template>

<script setup lang="ts">
import type { HeroBannerDTO } from '~/../types/generated'
import heroBannerImage from '~/assets/images/hero-banner.jpg'

const props = defineProps<{
  bannerData: HeroBannerDTO
}>()

const backgroundStyle = computed(() => {
  if (props.bannerData.visual.type === 'image') {
    return {
      backgroundImage: `url(${heroBannerImage})`, ////${props.banner.visual.img_url})
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return {
    backgroundImage: `linear-gradient(135deg, ${props.bannerData.visual.gradient_from}, ${props.bannerData.visual.gradient_to})`
  }
})
</script>
