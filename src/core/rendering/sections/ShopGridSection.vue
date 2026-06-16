<template>
  <div>
    <LayoutShop :data="productsData?.data ?? null" />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, watch } from 'vue'
import type { RuntimeSectionComponentProps } from '../types'
import type { ProductListResponse } from '~~/types/product'
import { createCacheKey } from '~~/src/core/cache/createCacheKey'
import { useStorefrontContext } from '../../tenant/composables'
import { useProductFilters } from '~~/app/composables/useProductFilters'
import { useApi } from '~/composables/useApi'
import { API_ROUTES } from '~~/shared/utils/routes'

const props = defineProps<RuntimeSectionComponentProps>()

// Get composables in setup (SSR-safe)
const storefrontContext = useStorefrontContext()
const { locale } = useI18n()
const route = useRoute()
const { filters, apiQuery } = useProductFilters()
const api = useApi()

// Extract props from runtime payload
const categorySlug = computed(() => props.data?.categorySlug || null)
const storeId = computed(() => props.data?.storeId || storefrontContext.value.tenant?.id)

// Sync category from runtime props to filter state (only once)
watch(
  categorySlug,
  (newSlug) => {
    if (newSlug && filters.value.categorySlug !== newSlug) {
      filters.value.categorySlug = newSlug
    }
  },
  { immediate: true }
)

// Build complete query with filters and pagination
const query = computed(() => ({
  ...apiQuery.value,
  category_slug: categorySlug.value || apiQuery.value.category_slug || undefined,
  page: route.query.page ? Number(route.query.page as string) : 1,
  per_page: route.query.per_page ? Number(route.query.per_page as string) : 10,
}))

// Build cache key for data fetching
const cacheKey = computed(() => createCacheKey({
  locale: locale.value,
  tenantId: storeId.value,
  resource: 'products',
  identifier: categorySlug.value || 'all',
  params: query.value,
}))

// Fetch products with filters and pagination
const { data: productsData, pending } = await useAsyncData<ProductListResponse | null>(
  () => cacheKey.value,
  async () => {
    if (!storeId.value) {
      console.warn('[ShopGridSection] No storeId available, returning null')
      return null
    }

    try {
      const response = await api<ProductListResponse>(
        API_ROUTES.products.index,
        {
          query: query.value,
        }
      )

      return response
    } catch (error) {
      console.error('[ShopGridSection] Failed to fetch products:', error)
      return null
    }
  },
  {
    watch: [query, locale],
  }
)

// Provide pending state to child components (for loading indicators)
provide('pending', pending)
</script>
