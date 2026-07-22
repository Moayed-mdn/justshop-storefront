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
const { filters, apiQuery, syncFromUrl } = useProductFilters()
// Sync filter state from URL during setup (works for both SSR and client)
syncFromUrl()
const api = useApi()

// Extract props from runtime payload
const categorySlug = computed(() => props.data?.categorySlug || null)
const storeId = computed(() => props.data?.storeId || storefrontContext.value.tenant?.id)

// Determine if this is a category page (from runtime system)
const isCategoryPage = computed(() => {
  // If we have a categorySlug prop from runtime payload, it's a category page
  return !!categorySlug.value
})

// Sync category from runtime props to filter state (only for shop page, not category page)
watch(
  categorySlug,
  (newSlug) => {
    // Only sync if we're NOT on a category page
    // On category pages, the category is in the URL path, not a filter
    if (!isCategoryPage.value && newSlug && filters.value.categorySlug !== newSlug) {
      filters.value.categorySlug = newSlug
    }
  },
  { immediate: true }
)

// Build complete query with filters and pagination
const query = computed(() => {
  const baseQuery = {
    ...apiQuery.value,
    page: route.query.page ? Number(route.query.page as string) : 1,
    per_page: route.query.per_page ? Number(route.query.per_page as string) : 10,
  }
  
  if (isCategoryPage.value) {
    // On category page: main category is in URL path, filter category goes as query param
    // Don't override category_slug from apiQuery, it's the subcategory filter
    return baseQuery
  } else {
    // On shop page: category filter becomes the category_slug param
    return {
      ...baseQuery,
      category_slug: apiQuery.value.category_slug || undefined,
    }
  }
})

// Build cache key for data fetching
const cacheKey = computed(() => createCacheKey({
  locale: locale.value,
  tenantId: storeId.value,
  resource: 'products',
  identifier: categorySlug.value || 'all',
  params: query.value,
}))

// Determine which API endpoint to use
const apiEndpoint = computed(() => {
  if (isCategoryPage.value && categorySlug.value) {
    // Category page: use category endpoint
    return API_ROUTES.products.category(categorySlug.value)
  }
  // Shop page: use index endpoint
  return API_ROUTES.products.index
})

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
        apiEndpoint.value,
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
