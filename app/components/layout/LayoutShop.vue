<template>
  <div class="grid grid-cols-1 grid-rows-[auto_1fr_auto] md:grid-cols-12 container mx-auto md:gap-5">
    <aside class="md:col-span-3">
      <FilterSidebar
        v-if="backendFilters"
        :backend-filters="backendFilters"
        @update-filters="updateFilters"
      />
    </aside>

    <section class="md:col-span-9">
      <ProductGrid :products="products" />
    </section>

    <div class="md:col-span-12">
      <ProductPagination :total-pages="pagination?.last_page ?? 1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { BackendFilters, ShopFilters } from '../../../types/filters'

const router = useRouter()
const route = useRoute()

const props = defineProps<{
  data?: {
    data: unknown[]
    pagination?: { last_page: number }
    filters?: BackendFilters
  }
}>()

const products = computed(() => props.data?.data)
const pagination = computed(() => props.data?.pagination)
const backendFilters = computed<BackendFilters | null>(
  () => props.data?.filters ?? null
)

const updateFilters = (newFilters: ShopFilters) => {
  router.push({
    query: {
      ...route.query,
      category: newFilters.categorySlug ?? undefined,
      min_price:
        newFilters.minPrice != null ? newFilters.minPrice.toString() : undefined,
      max_price:
        newFilters.maxPrice != null ? newFilters.maxPrice.toString() : undefined,
      earliest_manufacture: newFilters.manufactureFrom ?? undefined,
      latest_expiry: newFilters.expiryTo ?? undefined
    }
  })
}
</script>