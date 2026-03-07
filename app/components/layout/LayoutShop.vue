<template>
  <div class="grid grid-cols-1 grid-rows-[auto_1fr_auto] md:grid-cols-12 container mx-auto md:gap-5">
    <aside class="md:col-span-3">
      <FilterSidebar
        v-if="backendFilters"
        :backend-filters="backendFilters"
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
import type { BackendFilters } from '../../../types/api/product'

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
</script>