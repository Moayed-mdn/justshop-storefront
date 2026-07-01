<template>
  <aside class="w-full md:w-(--filter-sidebar-width, 280px) shrink-0">
    <FilterSidebar
      v-if="backendFilters"
      :backend-filters="backendFilters"
      :filter-config="filterConfig"
    />
  </aside>
</template>

<script setup lang="ts">
import type { ProductListFilters } from '~~/types/product'
import type { RuntimeTemplateSectionDetail } from '~~/src/core/runtime/contracts/types'
import type { ProductFilterConfig } from '~~/app/composables/useFilterConfig'

const props = defineProps<{
  backendFilters: ProductListFilters | null
  section?: RuntimeTemplateSectionDetail | null
}>()

const filterConfig = computed<ProductFilterConfig | null>(() => {
  if (!props.section?.settings) return null

  const s = { ...props.section.settings, ...props.section.data }
  return {
    showCategoryFilter: (s.show_category_filter ?? s.show_categories) !== false,
    showPriceFilter: (s.show_price_filter ?? s.show_price_range) !== false,
    showManufactureFilter: s.show_manufacture_filter !== false,
    showExpiryFilter: s.show_expiry_filter !== false,
    showBrandFilter: (s.show_brand_filter ?? s.show_brands) === true,
    showRatingFilter: s.show_rating_filter === true,
  }
})
</script>
