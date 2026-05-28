<template>
  <div class="py-2 my-4 relative ">
    <NuxtLinkLocale
      class="group items-center gap-2"
      v-if="categoryName" 
      :to="categorySlug ? `/products/category/${categorySlug}` : '#'"
      > 
      <h2 class="my-8 max-w-[80%] capitalize text-2xl font-semibold text-(--slider-title-color) whitespace-pre-wrap wrap-break-word">
         {{ $t('best-seller.title') }}  {{ categoryName }}
         <svg 
           xmlns="http://w3.org" 
           fill="none" 
           viewBox="0 0 24 24" 
           stroke-width="2.5" 
           stroke="currentColor" 
           :class="[
             'inline-block w-6 h-6 text-(--color-primary) transition-transform duration-300',
             isRtl ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2',
           ]"
         >
           <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
         </svg>
      </h2>
    </NuxtLinkLocale>
    
    <div
      ref="scrollRef"
      class="flex overflow-x-auto no-scrollbar scroll-smooth transition-all duration-500
             gap-(--slider-gap)"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="flex-none w-[220px] sm:w-1/2 lg:w-1/3 mb-10 "
      >
        <ProductCard :product="product" />
      </div>
    </div>    
  </div>
</template>

<script setup lang="ts">
import type { ProductDto } from '~/../src/core/api/dto/storefront'

import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const scrollRef = ref<HTMLElement | null>(null)
const scrollStep = 350
const isBoundFromLeft = ref(false)
const isBoundFromRight = ref(false)

const { locale } = useI18n()
const isRtl = computed(() => locale.value === 'ar')

const props = defineProps<{
  categoryName: string
  categorySlug?: string
  products: ProductDto[]
}>()

const showBounceFromLeft = () => {
  if (!scrollRef.value) return
  
  if (scrollRef.value.scrollLeft === 0) {
    isBoundFromLeft.value = true
  } else {
    scrollRef.value.scrollBy({ left: -scrollStep, behavior: 'smooth' })
  }
}

const showBounceFromRight = () => {
  if (!scrollRef.value) return
  
  const scrollRight = scrollRef.value.scrollWidth - 
    (scrollRef.value.scrollLeft + scrollRef.value.clientWidth)
  
  if (scrollRight <= 1) {
    isBoundFromRight.value = true
  } else {
    scrollRef.value.scrollBy({ left: scrollStep, behavior: 'smooth' })
  }
}

const resetBounce = (bounceRef: typeof isBoundFromLeft | typeof isBoundFromRight) => {
  setTimeout(() => {
    bounceRef.value = false
  }, 500)
}

watch(isBoundFromLeft, (newValue) => {
  if (newValue) {
    resetBounce(isBoundFromLeft)
  }
})

watch(isBoundFromRight, (newValue) => {
  if (newValue) {
    resetBounce(isBoundFromRight)
  }
})
</script>

<style>
 
</style>

<!-- <span @click="showBounceFromLeft" class="border-[30px] z-10  cursor-pointer left-0  top-[50%] border-blue-500  border-transparent  border-r-blue-500  absolute"></span> -->
<!-- [&::-webkit-scrollbar]:h-1  [&::-webkit-scrollbar-thumb]:bg-[#231F1E] -->
<!-- <span @click="showBounceFromRight" class="border-[30px] z-10  cursor-pointer right-0 top-[50%]  border-blue-500  border-transparent  border-l-blue-500  absolute"></span> -->
