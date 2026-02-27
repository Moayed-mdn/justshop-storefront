<template>
  <section class="w-full overflow-hidden">
    
    <HeroSkeleton v-if="pending && isClientNavigation" />

    <HeroBanner
      v-else-if="banner"
      :banner="banner"
    />

    <div v-else class="text-center py-10">
      No hero available
    </div>

  </section>
</template>

<script setup lang="ts">
import type { HeroBannerDTO } from '~~/types/generated'


const { locale } = useI18n()

const isClientNavigation = ref(false)

onMounted(() => {
  isClientNavigation.value = true
})

const { data, pending } = await useAsyncData(
  `hero-data-${locale.value}`,
  // Type the $fetch return, Nuxt does the rest!
  () => $fetch<ApiResponse<HeroBannerDTO[]>>('/api/hero',{
    headers:useRequestHeaders(['cookie']) 
  }), 
  {
    server: true,
    watch: [locale],
    transform: (res) => res.data 
  },
)


const banner = computed(() => {
  return data.value?.[0] ?? null
})
</script>