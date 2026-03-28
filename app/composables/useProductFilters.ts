// app/composables/useProductFilters.ts
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ShopFilters } from '~~/types/filters/shopFilters'
import type { ProductApiFilters } from '~~/types/api/product'

const defaultFilters = (): ShopFilters => ({
  categorySlug: null,
  minPrice: null,
  maxPrice: null,
  manufactureFrom: null,
  expiryTo: null
})

export const useProductFilters = () => {
  const route = useRoute()
  const router = useRouter()

  const filters = useState<ShopFilters>('productFilters', defaultFilters)

  // ✅ Move date presets into the composable so they're globally accessible
  const manufacturePreset = useState<string>('filter-manufacture-preset', () => 'all')
  const expiryPreset = useState<string>('filter-expiry-preset', () => 'all')

  // ✅ Global reset — call from ANY component
  const resetFilters = () => {
    filters.value = defaultFilters()
    manufacturePreset.value = 'all'
    expiryPreset.value = 'all'
  }

  const syncFromUrl = () => {
    const q = route.query

    filters.value = {
      categorySlug: (q.category as string | undefined) ?? null,
      minPrice: q.min_price ? Number(q.min_price as string) : null,
      maxPrice: q.max_price ? Number(q.max_price as string) : null,
      manufactureFrom: (q.earliest_manufacture as string | undefined) ?? null,
      expiryTo: (q.latest_expiry as string | undefined) ?? null
    }
  }

  const syncToUrl = () => {
    const { page, ...restQuery } = route.query

    router.push({
      query: {
        ...restQuery,
        category: filters.value.categorySlug ?? undefined,
        min_price: filters.value.minPrice?.toString(),
        max_price: filters.value.maxPrice?.toString(),
        earliest_manufacture: filters.value.manufactureFrom ?? undefined,
        latest_expiry: filters.value.expiryTo ?? undefined
      }
    })
  }

  const apiQuery = computed<Partial<ProductApiFilters>>(() => ({
    category_slug: filters.value.categorySlug ?? undefined,
    min_price: filters.value.minPrice ?? undefined,
    max_price: filters.value.maxPrice ?? undefined,
    earliest_manufacture: filters.value.manufactureFrom ?? undefined,
    latest_expiry: filters.value.expiryTo ?? undefined
  }))

  return {
    filters,
    manufacturePreset,
    expiryPreset,
    resetFilters,
    syncFromUrl,
    syncToUrl,
    apiQuery
  }
}