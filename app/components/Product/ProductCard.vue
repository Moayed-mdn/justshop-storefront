<template>
    <!-- flex-shrink-0  -->
   <div class="flex-none 
            w-full 
            sm:w-1/2 
            lg:w-1/3"> 
       <div class="bg-[var(--color-text-secondary)] rounded-[var(--radius-md)]
            
            flex items-center justify-center 
            h-64
            lg:h-72
       ">
           <NuxtLink :to="`/products/product/${product.slug}`">
               <img  class="max-h-full object-contain hover:scale-110 transition-all" :src="product.primary_image" :alt="product.alt_text || 'default'">
            </NuxtLink>
        </div>    
        <div class="flex flex-col px-2">
            <div  class="flex justify-between w-full mt-2 mb-1 font-bold">
                <h3 class="">{{ product.product_name }}</h3>
                <div class="">
                    <span class="relative bottom-1 m-0 text-sm">$</span>
                    <span>{{ Number(product.price).toFixed(0) }}</span>
                    <span  class="relative bottom-1 text-sm">.{{ product.price.toString().split('.')[1] || '00' }}
                    </span>
                </div>
            </div>
            <p class="first-letter:uppercase lowercase mb-2">{{ product.description }}</p>
            
            <div class=" my-4 font-bold">
                <button class="group py-2 px-4 rounded-full border transition-colors duration-500
                                border-[var(--color-primary)] hover:border-[var(--color-primary-hover)]
                                text-[var(--color-primary)] hover:text-[var(--color-text-secondary)]
                                hover:bg-[var(--color-primary-hover)] 
                                 ">
                    <!-- <NuxtLink to="#" class=""> -->
                        {{ $t('cart.add_to_cart') }}
                    <!-- </NuxtLink> -->
                </button>
            </div>   

        </div>
    </div>
</template> 

<script setup lang="ts">
const { t } = useI18n()
import type { BestSellerProductDTO } from '~~/types/generated';
    const props = defineProps<{
        product:BestSellerProductDTO
    }>()



</script>