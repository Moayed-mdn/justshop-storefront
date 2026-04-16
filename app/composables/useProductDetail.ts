import type { ProductDetailResponse } from '~~/types/productDetail'
import type { ProductRelatedResponse } from '~~/types/productRelated'

export const useProductDetail = () => {
  const baseURL = useRuntimeConfig().public.apiBase

  const fetchProduct = async (slug: string) => {
    try {
      const response = await useApi<ProductDetailResponse>(`${baseURL}/products/${slug}`)
      return response.data
    } catch (err) {
      console.error('Failed to fetch product:', err)
      throw err
    }
  }

  const fetchRelatedProducts = async (slug: string) => {
    try {
      const response = await useApi<ProductRelatedResponse>(`${baseURL}/products/${slug}/related`)
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