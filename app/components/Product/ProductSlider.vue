<template>
    <div class=" py-2 my-4 bg-inherit relative    ">
          <!-- <span @click="showBounceFromLeft" class="border-[30px] z-10  cursor-pointer left-0  top-[50%] border-blue-500  border-transparent  border-r-blue-500  absolute"></span> -->
          <NuxtLink :to="`/products/${categorySlug}`" v-if="categoryName">
                <h2 class="my-8  text-2xl font-semibold"> <span>{{ $t('best-seller.title') }}</span> {{ categoryName }}</h2>
          </NuxtLink>
          
          <div
        ref="scrollRef"
        :class="/* {'translate-x-10':isBoundFromLeft,'translate-x-[-40px]':isBoundFromRight} */ {}"
        class="flex overflow-hidden overflow-x-auto  gap-6 scroll-smooth transition-all duration-500
        "
        >
        <!-- [&::-webkit-scrollbar]:h-1  [&::-webkit-scrollbar-thumb]:bg-[#231F1E] -->

        <template v-for="product in products" :key="product.product_id">
                <ProductCard :product="product"/>
        </template>
    </div>    
          <!-- <span @click="showBounceFromRight" class="border-[30px] z-10  cursor-pointer right-0 top-[50%]  border-blue-500  border-transparent  border-l-blue-500  absolute"></span> -->
    </div>
</template> 
<script setup lang="ts">
import type { BestSellerProductDTO } from '@/../types/generated'
import { ref, watch } from 'vue'

const scrollRef = ref<HTMLElement | null>(null)
const scrollStep = 350
const isBoundFromLeft = ref(false)
const isBoundFromRight = ref(false)

const props = defineProps<{
  categoryName: string
  categorySlug: string
  products: BestSellerProductDTO[]
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