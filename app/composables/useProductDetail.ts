// composables/useProductDetail.ts

export const useProductDetail = () => {
    const api = useClientApi()
  
    const fetchProduct = async (slug: string) => {
      try {
        const response = await api(`/products/${slug}`)
        return response.data
      } catch (err: any) {
        throw err
      }
    }
  
    const fetchRelatedProducts = async (slug: string) => {
      try {
        const response = await api(`/products/${slug}/related`)
        return response.data
      } catch (err: any) {
        return []
      }
    }
  
    return {
      fetchProduct,
      fetchRelatedProducts,
    }
  }