<template>
  <div v-if="products.length > 0" class="mt-16 border-t border-(--color-border-default) pt-12">
    <h2 class="text-xl font-bold text-(--color-text-primary) mb-6">
      {{ $t('product.related_products') }}
    </h2>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      <ProductCard
        v-for="product in mappedProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductRelated } from '~~/types/productRelated'
import type { ProductDto } from '~/../src/core/api/dto/storefront'

const props = defineProps<{
  products: ProductRelated[]
}>()

/**
 * Maps ProductRelated (API shape) → ProductDto (component contract).
 *
 * Wave 1 fix: was incorrectly mapping to the legacy ProductCard type,
 * which caused a shape mismatch with ProductCard.vue (expects ProductDto).
 * variantId is 0 for related products that do not carry variant context.
 */
const mappedProducts = computed<ProductDto[]>(() => {
  return props.products.map((related) => ({
    id: related.id,
    variantId: 0,
    slug: related.slug,
    name: related.name,
    image: related.primary_image || '',
    price: related.price,
    currency: 'USD',
    description: related.description || '',
    categoryId: related.category_id,
  }))
})
</script>
