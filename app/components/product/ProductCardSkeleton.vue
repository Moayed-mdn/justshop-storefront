<template>
  <div class="w-full">
    <!-- Image skeleton -->
    <div
      class="bg-(--skeleton-surface) rounded-(--radius-md) flex items-center justify-center
             h-(--card-img-height-mobile) lg:h-(--card-img-height-desktop) overflow-hidden"
    >
      <div
        class="w-[70%] h-[70%] rounded-md bg-(--skeleton-shimmer) animate-pulse"
      />
    </div>

    <!-- Content skeleton -->
    <div class="flex flex-col px-2 mt-3">
      <div class="flex justify-between w-full mb-2">
        <div class="h-5 w-2/3 rounded-md bg-(--skeleton-shimmer) animate-pulse" />
        <div class="h-5 w-16 rounded-md bg-(--skeleton-shimmer) animate-pulse" />
      </div>

      <div class="space-y-2">
        <div class="h-4 w-full rounded-md bg-(--skeleton-shimmer) animate-pulse" />
        <div class="h-4 w-5/6 rounded-md bg-(--skeleton-shimmer) animate-pulse" />
      </div>

      <div class="h-10 w-36 mt-3 rounded-full bg-(--skeleton-shimmer) animate-pulse" />
    </div>
  </div>
</template>

