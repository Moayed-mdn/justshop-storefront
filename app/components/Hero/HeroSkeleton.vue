<template>
  <div
    class="relative w-full min-h-[var(--hero-min-height-mobile)] md:min-h-[var(--hero-min-height-desktop)] flex items-center overflow-hidden"
  >
    <!-- Background shimmer -->
     <!-- animate-bounce animate-pulse animate-ping  animate-wiggle animate-spin    animate-none -->
    <div class="absolute inset-0 animate-pulse  bg-gray-200 " />

    <AppContainer class="relative z-10">
      <div class="flex flex-col">
        <div class="max-w-xl">
          
          <!-- Title skeleton -->
          <div class="space-y-3">
            <div class="h-10 md:h-14 w-3/4 bg-gray-300 rounded-md animate-pulse"></div>
            <div class="h-10 md:h-14 w-2/3 bg-gray-300 rounded-md animate-pulse"></div>
          </div>

          <!-- Subtitle skeleton -->
          <div class="mt-4 space-y-2">
            <div class="h-4 w-full bg-gray-300 rounded-md animate-pulse"></div>
            <div class="h-4 w-5/6 bg-gray-300 rounded-md animate-pulse"></div>
          </div>

          <!-- Button skeleton -->
          <div class="mt-6">
            <div class="h-10 w-40 bg-gray-300 rounded-[var(--radius-md)] animate-pulse"></div>
          </div>

        </div>
      </div>
    </AppContainer>
  </div>
</template>

