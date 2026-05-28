import { transformHeroBanner, transformBestSellers } from '../api/dto/storefront'
import { useStorefrontApi } from '../api/client'
import { API_ROUTES } from '../../../shared/utils/routes'

export const useSectionData = () => {
  const fetchSectionData = async (type: string, settings: Record<string, any> = {}) => {
    switch (type) {
      case 'hero_section':
        return await fetchHeroData()
      case 'best_sellers':
        return await fetchBestSellersData()
      case 'product_detail':
        return await fetchProductDetailData(settings.slug)
      case 'shop_grid':
        return await fetchShopGridData(settings)
      default:
        return null
    }
  }

  const fetchShopGridData = async (settings: any) => {
    const query = {
      page: settings.params?.page ?? 1,
      per_page: 15,
      ...settings.params
    }
    
    const url = settings.categorySlug 
      ? API_ROUTES.products.category(settings.categorySlug)
      : API_ROUTES.products.bestSeller // Fallback or handle "all products"

    const { data } = await useStorefrontApi<any>(url, { query })
    
    return {
      data: data ?? null,
      pending: false
    }
  }

  const fetchProductDetailData = async (slug: string) => {
    if (!slug) return null
    
    // We use the existing composable logic for now but wrapped in our orchestrator
    const { fetchProduct, fetchRelatedProducts } = useProductDetail()
    const [productData, relatedData] = await Promise.all([
      fetchProduct(slug),
      fetchRelatedProducts(slug),
    ])

    return {
      product: productData?.data ?? null,
      relatedProducts: relatedData?.data ?? [],
      pending: false
    }
  }

  const fetchHeroData = async () => {
    const { data } = await useStorefrontApi<any>(API_ROUTES.products.hero)
    if (data?.data?.[0]) {
      return {
        banner: transformHeroBanner(data.data[0])
      }
    }
    return null
  }

  const fetchBestSellersData = async () => {
    const { data } = await useStorefrontApi<any>(API_ROUTES.products.bestSeller)
    if (data?.data) {
      return {
        categories: transformBestSellers(data.data)
      }
    }
    return null
  }

  return {
    fetchSectionData
  }
}
