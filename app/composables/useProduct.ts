import type { ShopLayout } from '../../types/api/shopLayout'
export const useUseProduct = async() => {
  const { locale } = useI18n()
  const route = useRoute()
  const { filters, syncFromUrl, syncToUrl, apiQuery } = useProductFilters()

  onMounted(syncFromUrl)
  watch(filters, syncToUrl, { deep: true })

  const filterApiQuery= computed(() =>
    Object.entries(apiQuery.value)
    .sort()
    .map(([k, v]) => v ? `${k}:${v}` : '')
    .join('|')
    
  )

  const key = computed(() =>
    `products-data-${locale.value}-${route.query.page ?? 1}-${filterApiQuery.value}`
  )

  const { data, pending, error } = await useLazyAsyncData(
    key,
    //  (_nuxt,{signal}) => {
    (_nuxt,{signal}) => {
      const page = Number(route.query.page ?? 1)

      const finalQuery = {
        ...apiQuery.value,
        page,
      }

      return  $fetch<ShopLayout>('/api/products', {
        query: finalQuery,
        headers: useRequestHeaders(['cookie']),
        // signal,
      })
    },
    { dedupe: 'cancel'},
  )
  return {
      data,
      pending,
      error
  }
}