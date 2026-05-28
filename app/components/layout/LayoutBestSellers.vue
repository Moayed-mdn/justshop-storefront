<template>
    <AppContainer>
        <div class="bg-inherit">
            <div v-for="category in categories" :key="category.id">
                <ProductSlider 
                    :categoryName="category.name"  
                    :products="category.products" 
                />
            </div>
        </div>
    </AppContainer>
</template>

<script setup lang="ts">
import type { BestSellerCategoryDto } from '~/../src/core/api/dto/storefront'

defineProps<{
  categories: BestSellerCategoryDto[]
}>()
</script>

