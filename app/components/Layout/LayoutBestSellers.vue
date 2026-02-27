<template>
    <AppContainer>
        <div class="bg-inherit">
            <div v-if="pending">
                    loading...
            </div>
            <div v-else-if="error">
                    {{ error }}
            </div>
            <div v-else v-for="category in categories">
                <ProductSlider 
                    :categoryName="category.category_name"  
                    :categorySlug="category.category_slug"
                    :products="category.products" 

                />
            </div>
        </div>
    </AppContainer>
</template>



<script setup lang="ts">
import type { BestSellerDTO } from '~~/types/generated';

const { locale } = useI18n();

const { data : categories , pending , error } = await useAsyncData(
        `best-seller-${locale.value}`,
        ()=> $fetch<ApiResponse<BestSellerDTO[]>>('/api/best_seller',{
            headers:useRequestHeaders(['cookie'])
        }),
        {
            server:true,
            transform:(res)=> res.data
        }
)



</script>