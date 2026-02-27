<template>
  <div
     class="relative w-full min-h-[var(--hero-min-height-mobile)] md:min-h-[var(--hero-min-height-desktop)] flex items-center"
      :style="backgroundStyle"
    >
   <div v-if="banner.visual.type === 'image'" 
        class="absolute inset-0 bg-black opacity-[var(--hero-overlay-opacity)]">
   </div>
   <AppContainer class="relative z-10">
     <div class="flex flex-col">
       <div class="max-w-xl text-white" :style="{ textShadow: 'var(--hero-text-shadow)' }">

          <h1 class="text-3xl md:text-5xl font-bold leading-tight text-[var(--color-text-secondry)]">
                {{ banner.title }}
          </h1>
    
            <p v-if="banner.subtitle" class="mt-4 text-base md:text-lg opacity-90">
                {{ banner.subtitle }}
            </p>
    
            <NuxtLink
                v-if="banner.cat_text"
                :to="banner.cat_text"
                class="inline-block mt-6 rounded-[var(--radius-md)] bg-[var(--color-bg-white)] px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-gray-100 transition-colors duration-200 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]"
            >
                {{ banner.cat_text }}
            </NuxtLink>
            
        </div>
     </div>
   </AppContainer>
 </div>
</template>

  <script setup  lang="ts">
  import type { HeroBannerDTO } from '~/../types/generated'

  const props = defineProps<{
    banner:  HeroBannerDTO
  }>()  

  const backgroundStyle = computed(() => {
  if (props.banner.visual.type === 'image') {
    return {
      backgroundImage: `url(${props.banner.visual.img_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  
    return {
      backgroundImage: `linear-gradient(135deg, ${props.banner.visual.gradient_from}, ${props.banner.visual.gradient_to})`
    }
  })
  </script>
  