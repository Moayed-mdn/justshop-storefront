<template>
    <div v-if="products.length > 0" class="mt-16 border-t border-gray-200 pt-12">
      <h2 class="text-xl font-bold text-gray-900 mb-6">
        {{ $t('product.related_products') }}
      </h2>
  
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        <ProductCard
          v-for="product in mappedProducts"
          :key="product.product_id"
          :product="product"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { ProductRelated } from '~~/types/productRelated'
  import type { ProductCard } from '~~/types/product'
  
  const props = defineProps<{
    products: ProductRelated[]
  }>()
  
  const mappedProducts = computed<ProductCard[]>(() => {
    return props.products.map((related) => ({
      product_id: related.id,
      product_variant_id: 0,
      slug: related.slug,
      category_id: related.category_id,
      primary_image: related.primary_image || '',
      alt_text: related.name,
      product_name: related.name,
      price: related.price,
      description: related.description || '',
      total_sold: null,
    }))
  })
  </script>