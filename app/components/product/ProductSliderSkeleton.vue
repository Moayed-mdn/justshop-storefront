<template>
  <div class="py-2 my-4 relative ">
    <div v-if="showTitle" class="my-8 max-w-[80%] space-y-3">
      <div class="h-7 w-1/3 rounded-md bg-(--skeleton-shimmer) animate-pulse" />
      <div class="h-7 w-1/2 rounded-md bg-(--skeleton-shimmer) animate-pulse" />
    </div>

    <div
      class="flex overflow-x-auto no-scrollbar scroll-smooth transition-all duration-500
             gap-(--slider-gap)"
    >
      <div
        v-for="i in count"
        :key="i"
        class="flex-none w-[220px] sm:w-[calc(50%-var(--slider-gap))] lg:w-[calc(33.333%-var(--slider-gap))] mb-10"
      >
        <ProductCardSkeleton />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
    showTitle?: boolean
  }>(),
  {
    count: 3,
    showTitle: true,
  },
)
</script>

