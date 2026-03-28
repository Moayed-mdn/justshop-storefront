u<template>
    <AppContainer>
        <div class="bg-inherit">
            <div v-if="pending">
                <ProductSliderSkeleton />
            </div>
            <div v-else-if="error">
                    {{ error }}
            </div>
            <div v-else v-for="category in categories" :key="category.category_id">
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

const { categories, pending, error } = useUseBestSellers()
</script>

