// app/composables/useProductFilters.ts
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { ShopFilters } from '~~/types/filters/shopFilters'
import type { ProductApiFilters } from '~~/types/api/product'

const defaultFilters = (): ShopFilters => ({
  categorySlug: null,
  minPrice: null,
  maxPrice: null,
  manufactureFrom: null,
  expiryTo: null,
  brandSlugs: [],
  minRating: null
})

export const useProductFilters = () => {
  const route = useRoute()


  const filters = useState<ShopFilters>('productFilters', defaultFilters)

  // ✅ Move date presets into the composable so they're globally accessible
  const manufacturePreset = useState<string>('filter-manufacture-preset', () => 'all')
  const expiryPreset = useState<string>('filter-expiry-preset', () => 'all')

  // ✅ Global reset — call from ANY component
  const resetFilters = () => {
    filters.value = defaultFilters()
    manufacturePreset.value = 'all'
    expiryPreset.value = 'all'
    syncToUrl()
  }

  const syncFromUrl = () => {
    const q = route.query

    const rawBrands = q.brands
    const brandSlugs = rawBrands
      ? (Array.isArray(rawBrands) ? rawBrands : [rawBrands]).filter(Boolean) as string[]
      : []

    filters.value = {
      categorySlug: (q.category as string | undefined) ?? null,
      minPrice: q.min_price ? Number(q.min_price as string) : null,
      maxPrice: q.max_price ? Number(q.max_price as string) : null,
      manufactureFrom: (q.earliest_manufacture as string | undefined) ?? null,
      expiryTo: (q.latest_expiry as string | undefined) ?? null,
      brandSlugs,
      minRating: q.min_rating ? Number(q.min_rating as string) : null
    }
  }

  const syncToUrl = () => {
    const params = new URLSearchParams()
    if (filters.value.categorySlug) params.set('category', filters.value.categorySlug)
    if (filters.value.minPrice != null) params.set('min_price', String(filters.value.minPrice))
    if (filters.value.maxPrice != null) params.set('max_price', String(filters.value.maxPrice))
    if (filters.value.manufactureFrom) params.set('earliest_manufacture', filters.value.manufactureFrom)
    if (filters.value.expiryTo) params.set('latest_expiry', filters.value.expiryTo)
    if (filters.value.brandSlugs?.length) {
      filters.value.brandSlugs.forEach(slug => params.append('brands', slug))
    }
    if (filters.value.minRating != null) params.set('min_rating', String(filters.value.minRating))
    const qs = params.toString()
    const url = qs ? `${route.path}?${qs}` : route.path
    history.replaceState(history.state, '', url)
  }

  const apiQuery = computed<Partial<ProductApiFilters>>(() => ({
    category_slug: filters.value.categorySlug ?? undefined,
    min_price: filters.value.minPrice ?? undefined,
    max_price: filters.value.maxPrice ?? undefined,
    earliest_manufacture: filters.value.manufactureFrom ?? undefined,
    latest_expiry: filters.value.expiryTo ?? undefined,
    brand_slugs: filters.value.brandSlugs?.length ? filters.value.brandSlugs : undefined,
    min_rating: filters.value.minRating ?? undefined
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