// composables/useProductByCategory.ts
import type { CategoryShopLayout } from '../../types/api/shopLayout'

export const useProductByCategory = async (categorySlug: string) => {
  const { locale } = useI18n()
  const route = useRoute()
  const api = useClientApi()
  const { filters, syncFromUrl, syncToUrl, apiQuery } = useProductFilters()

  onMounted(syncFromUrl)
  watch(filters, syncToUrl, { deep: true })

  const filterApiQuery = computed(() =>
    Object.entries(apiQuery.value)
      .sort()
      .map(([k, v]) => (v ? `${k}:${v}` : ''))
      .join('|')
  )

  const key = computed(
    () =>
      `category-products-${categorySlug}-${locale.value}-${route.query.page ?? 1}-${filterApiQuery.value}`
  )

  const { data, pending } = await useLazyAsyncData(
    key,
    () => {
      const page = Number(route.query.page ?? 1)
      const finalQuery = {
        ...apiQuery.value,
        page,
        per_page:15
      }

      return api<CategoryShopLayout>(`/products/category/${categorySlug}`, {
        query: finalQuery,
      })
    },
    { dedupe: 'cancel' }
  )

  return { data, pending }
}