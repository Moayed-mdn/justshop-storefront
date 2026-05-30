import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes'
import type { ProductDetailResponse } from '~~/types/productDetail'
import type { ProductRelatedResponse } from '~~/types/productRelated'

export const useProductDetail = () => {
  const api = useApi()
  const fetchProduct = async (slug: string) => {
    try {
      const response = await api<ProductDetailResponse>(API_ROUTES.products.detail(slug))
      return response.data
    } catch (err) {
      console.error('Failed to fetch product:', err)
      throw err
    }
  }

  const fetchRelatedProducts = async (slug: string) => {
    try {
      const response = await api<ProductRelatedResponse>(API_ROUTES.products.related(slug))
      return response.data
    } catch (err) {
        console.error('Failed to fetch related products:', err)
        throw err
    }
  }

  return {
    fetchProduct,
    fetchRelatedProducts,
  }
}
