import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes'
import type { ProductDetailResponse } from '~~/types/productDetail'
import type { ProductRelatedResponse } from '~~/types/productRelated'
import { useCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

/**
 * useProductDetail - Fetch product detail and related products with caching
 * 
 * @param slug - Product slug (string or Ref<string>)
 * @returns Product data, related products, loading states, and refresh function
 * 
 * @example
 * const { product, pending, relatedProducts } = useProductDetail(slug)
 */
export const useProductDetail = (slug: MaybeRef<string>) => {
  const { getCacheKey } = useCacheKey()
  const api = useApi()
  const productSlug = toRef(slug)

  // Fetch main product with caching and locale/tenant awareness
  const { data: product, pending, error, refresh } = useAsyncData(
    () => getCacheKey({
      resource: CacheResources.PRODUCT_DETAIL,
      identifier: productSlug.value,
    }),
    async () => {
      try {
        const response = await api<ProductDetailResponse>(API_ROUTES.products.detail(productSlug.value))
        return response.data
      } catch (err) {
        console.error('Failed to fetch product:', err)
        throw err
      }
    },
    {
      watch: [productSlug],
    }
  )

  // Fetch related products with caching
  const { data: relatedProducts, pending: relatedPending, error: relatedError } = useAsyncData(
    () => getCacheKey({
      resource: CacheResources.PRODUCT_RELATED,
      identifier: productSlug.value,
    }),
    async () => {
      try {
        const response = await api<ProductRelatedResponse>(API_ROUTES.products.related(productSlug.value))
        return response.data
      } catch (err) {
        console.error('Failed to fetch related products:', err)
        throw err
      }
    },
    {
      watch: [productSlug],
    }
  )

  return {
    product,
    pending,
    error,
    refresh,
    relatedProducts,
    relatedPending,
    relatedError,
  }
}
