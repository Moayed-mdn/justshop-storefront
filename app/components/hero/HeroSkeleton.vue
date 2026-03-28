<template>
  <div class="relative w-full flex items-center overflow-hidden
             min-h-(--hero-h-mobile) md:min-h-(--hero-h-desktop)
             bg-(--skeleton-surface)">
    
    <!-- Background shimmer overlay -->
    <div class="absolute inset-0 animate-pulse bg-(--skeleton-shimmer) opacity-30" />

    <AppContainer class="relative z-10">
      <div class="max-w-xl space-y-8">
        
        <!-- Title skeleton -->
        <div class="space-y-3">
          <div class="h-10 md:h-14 w-3/4 bg-(--skeleton-shimmer) rounded-md animate-pulse"></div>
          <div class="h-10 md:h-14 w-2/3 bg-(--skeleton-shimmer) rounded-md animate-pulse"></div>
        </div>

        <!-- Subtitle skeleton -->
        <div class="space-y-2">
          <div class="h-4 w-full bg-(--skeleton-shimmer) rounded-md animate-pulse"></div>
          <div class="h-4 w-5/6 bg-(--skeleton-shimmer) rounded-md animate-pulse"></div>
        </div>

        <!-- Button skeleton -->
        <div class="h-12 w-44 bg-(--skeleton-shimmer) rounded-(--radius-md) animate-pulse"></div>

      </div>
    </AppContainer>
  </div>
</template>
