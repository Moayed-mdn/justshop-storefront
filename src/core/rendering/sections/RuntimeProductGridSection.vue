<template>
  <section class="runtime-product-grid">
    <header v-if="title || subtitle" class="runtime-product-grid__header">
      <div class="runtime-product-grid__header-row">
        <div>
          <h2 v-if="title" class="runtime-product-grid__title">
            {{ title }}
          </h2>
          <p v-if="subtitle" class="runtime-product-grid__subtitle">
            {{ subtitle }}
          </p>
        </div>
        <NuxtLink
          v-if="viewAllLink"
          :to="viewAllLink"
          class="runtime-product-grid__view-all"
        >
          View all
        </NuxtLink>
      </div>
    </header>
    <ProductGrid :products="products" />
  </section>
</template>

<script setup lang="ts">
import type { ProductDto } from '../../api/dto/storefront'
import type { RuntimeSectionComponentProps } from '../types'
import ProductGrid from '../../../app/components/product/ProductGrid.vue'

const props = defineProps<RuntimeSectionComponentProps>()

provide('pending', ref(false))

const title = computed(() => typeof props.data.title === 'string' ? props.data.title : '')
const subtitle = computed(() => typeof props.data.subtitle === 'string' ? props.data.subtitle : '')

const viewAllLink = computed(() => {
  const link = props.data.viewAllLink
  if (typeof link === 'string' && link.length > 0) return link

  const pagePath = props.data.pagePath
  if (typeof pagePath === 'string' && pagePath.length > 0) return pagePath

  return null
})

const products = computed<ProductDto[]>(() => {
  if (!Array.isArray(props.data.products)) {
    return []
  }

  return props.data.products
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item))
    .map((item) => ({
      id: (item.id as string | number) ?? (item.product_id as string | number) ?? 0,
      variantId: (item.variantId as string | number) ?? (item.product_variant_id as string | number) ?? 0,
      name: typeof item.name === 'string' ? item.name : String(item.product_name ?? ''),
      slug: typeof item.slug === 'string' ? item.slug : '',
      image: typeof item.image === 'string'
        ? item.image
        : (typeof item.primary_image === 'string' ? item.primary_image : ''),
      price: typeof item.price === 'number' ? item.price : Number(item.price ?? 0),
      currency: typeof item.currency === 'string' ? item.currency : 'USD',
      description: typeof item.description === 'string' ? item.description : '',
      categoryId: (item.categoryId as string | number) ?? (item.category_id as string | number),
    }))
    .filter((item) => item.slug !== '' && item.image !== '')
})
</script>

<style scoped>
.runtime-product-grid {
  width: 100%;
  background: var(--color-bg-page, #ffffff);
}

.runtime-product-grid__header {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 0;
}

.runtime-product-grid__header-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.runtime-product-grid__view-all {
  flex-shrink: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary, #003d29);
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s ease;
}

.runtime-product-grid__view-all:hover {
  opacity: 0.75;
  text-decoration: underline;
}

.runtime-product-grid__title {
  margin: 0;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 800;
  color: var(--color-text-primary, #231f1e);
}

.runtime-product-grid__subtitle {
  margin: 0.75rem 0 0;
  max-width: 42rem;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-secondary, #333333);
}
</style>
