<template>
  <section class="w-full overflow-hidden">
    
    <HeroSkeleton v-if="pending && isClientNavigation" />

    <HeroBanner
      v-else-if="bannerData"
      :banner-data="bannerData"
    />

    <div v-else class="text-center py-10">
      No hero available
    </div>
 
   
  </section>
</template>

<script setup lang="ts">
const isClientNavigation = ref(false)

const {data, pending, error } = useHero()

onMounted(() => {
  isClientNavigation.value = true
})

const bannerData = computed(() => {
  return data.value?.[0]
})

</script>