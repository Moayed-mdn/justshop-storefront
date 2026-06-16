<!-- components/layout/LayoutShop.vue -->
<template>
  <div>
    <!-- Optional header slot (used by category page) -->
    <slot name="header" />

    <div class="grid grid-cols-1 grid-rows-[auto_1fr_auto] md:grid-cols-12 container mx-auto md:gap-(--layout-container-gap)">
      <aside class="md:col-span-3">
        <FilterSidebar
          v-if="backendFilters"
          :backend-filters="backendFilters"
        />
      </aside>

      <section class="md:col-span-9">
        <ProductGrid 
          v-if="products"
          :products="products"
        />
      </section>

      <div class="md:col-span-12">
        <ProductPagination
          v-if="pagination"
          :total-pages="pagination?.total_pages ?? 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaginationMeta } from '~~/types/api';
import type { ProductListFilters, ProductListResponse } from '~~/types/product'
import { transformProduct } from '~~/src/core/api/dto/storefront'

const props = defineProps<{
  data: ProductListResponse | null
}>()

const products = computed(() => {
  const rawProducts = props.data?.data
  if (!rawProducts || !Array.isArray(rawProducts)) return []
  return rawProducts.map(transformProduct)
})
const pagination = computed<PaginationMeta | null>(() => props.data?.meta?.pagination ?? null)
const backendFilters = computed<ProductListFilters | null>(
  () => props.data?.meta?.filters ?? null
)
</script>