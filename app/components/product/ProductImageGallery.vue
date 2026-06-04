<template>
  <div class="space-y-4" data-testid="product-image-gallery">
    <!-- Main Image -->
    <div
      class="relative aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-zoom-in"
      @click="showZoom = true"
    >
      <img
        v-if="currentImage"
        data-testid="product-image-main"
        :src="currentImage.url"
        :alt="currentImage.alt_text ?? $t('product.image_alt', { number: currentIndex + 1 })"
        class="w-full h-full object-contain"
        loading="lazy"
        decoding="async"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
        <svg class="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16
               16m-2-2l1.586-1.586a2 2 0 012.828
               0L20 14m-6-6h.01M6 20h12a2 2 0
               002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Navigation Arrows (if multiple images) -->
      <template v-if="images.length > 1">
        <button
          data-testid="product-image-prev"
          @click.stop="previousImage"
          class="absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 w-10 h-10
                 bg-white/90 rounded-full shadow-md flex items-center justify-center
                 hover:bg-white transition-colors cursor-pointer"
          :aria-label="$t('product.previous_image')"
        >
          <svg class="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          data-testid="product-image-next"
          @click.stop="nextImage"
          class="absolute ltr:right-2 rtl:left-2 top-1/2 -translate-y-1/2 w-10 h-10
                 bg-white/90 rounded-full shadow-md flex items-center justify-center
                 hover:bg-white transition-colors cursor-pointer"
          :aria-label="$t('product.next_image')"
        >
          <svg class="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </template>

      <!-- Image counter -->
      <div
        v-if="images.length > 1"
        data-testid="product-image-counter"
        class="absolute top-2 ltr:left-2 rtl:right-2 bg-black/50 text-white text-xs
               px-2 py-1 rounded-md"
      >
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>

      <!-- Zoom hint -->
      <div class="absolute top-2 ltr:right-2 rtl:left-2 bg-black/50 text-white text-xs
                  px-2 py-1 rounded-md opacity-0 hover:opacity-100 transition-opacity">
        {{ $t('product.zoom') }}
      </div>
    </div>

    <!-- Thumbnail Strip -->
    <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="(img, idx) in images"
        :key="img.id"
        data-testid="product-image-thumbnail"
        @click="currentIndex = idx"
        class="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors cursor-pointer"
        :class="currentIndex === idx
          ? 'border-(--color-primary)'
          : 'border-gray-200 hover:border-gray-300'"
      >
        <img
          :src="img.url"
          :alt="img.alt_text ?? $t('product.image_alt', { number: idx + 1 })"
          class="w-full h-full object-contain"
        >
      </button>
    </div>

    <!-- Zoom Modal -->
    <Teleport to="body">
      <div
        v-if="showZoom"
        data-testid="product-image-zoom-modal"
        class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        @click="showZoom = false"
      >
        <img
          v-if="currentImage"
          :src="currentImage.url"
          :alt="currentImage.alt_text ?? ''"
          class="max-w-full max-h-full object-contain"
          @click.stop
        >

        <button
          @click="showZoom = false"
          class="absolute top-4 ltr:right-4 rtl:left-4 w-10 h-10 bg-white/10
                 text-white rounded-full flex items-center justify-center
                 hover:bg-white/20 transition-colors cursor-pointer"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ProductImage } from '~~/types/productDetail'

const props = defineProps<{
  images: ProductImage[]
}>()

const currentIndex = ref(0)
const showZoom = ref(false)

const currentImage = computed(() => props.images[currentIndex.value])

const previousImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = props.images.length - 1
  }
}

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

// Reset to primary image when images change (variant selection)
watch(() => props.images, (newImages) => {
  const primaryIndex = newImages.findIndex(img => img.is_primary === 1)
  currentIndex.value = primaryIndex >= 0 ? primaryIndex : 0
}, { deep: true })
</script>