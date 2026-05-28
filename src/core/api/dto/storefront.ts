export interface HeroBannerDto {
  title: string
  subtitle?: string
  ctaText?: string
  ctaUrl?: string
  visual: {
    type: 'image' | 'gradient'
    imageUrl?: string
    gradientFrom?: string
    gradientTo?: string
  }
}

export interface ProductDto {
  id: string | number
  variantId: string | number
  name: string
  slug: string
  image: string
  price: number
  currency: string
  description?: string
  categoryId?: string | number
}

export interface BestSellerCategoryDto {
  id: string | number
  name: string
  slug: string
  products: ProductDto[]
}

export const transformHeroBanner = (raw: any): HeroBannerDto => {
  return {
    title: raw.title || '',
    subtitle: raw.subtitle || '',
    ctaText: raw.cat_text || '',
    ctaUrl: raw.cat_url || '',
    visual: {
      type: raw.visual?.type || 'image',
      imageUrl: raw.visual?.img_url,
      gradientFrom: raw.visual?.gradient_from,
      gradientTo: raw.visual?.gradient_to,
    }
  }
}

export const transformProduct = (raw: any): ProductDto => {
  return {
    id: raw.id || raw.product_id,
    variantId: raw.variant_id || raw.product_variant_id,
    name: raw.name || raw.product_name,
    slug: raw.slug,
    image: raw.image?.url || raw.primary_image || '',
    price: raw.price,
    currency: raw.currency || 'USD',
    description: raw.description,
    categoryId: raw.category_id
  }
}

export const transformBestSellers = (raw: any[]): BestSellerCategoryDto[] => {
  return (raw || []).map(cat => ({
    id: cat.id || cat.category_id,
    name: cat.name || cat.category_name,
    slug: cat.slug || cat.category_slug || '',
    products: (cat.products || []).map((p: any) => transformProduct(p))
  }))
}
