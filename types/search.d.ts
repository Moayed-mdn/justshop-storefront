// types/search.d.ts

export interface ProductSearchResult {
  id: string
  name: string
  slug: string
  description?: string | null
  price?: number | null
  image_url?: string | null
  avg_rating?: number | null
  reviews_count: number
  category_name?: string | null
  brand_name?: string | null
}
  
  export interface CategorySearchResult {
    id: string
    name: string
    slug: string
    products_count: number
  }
  
  export interface BrandSearchResult {
    id: string
    name: string
    slug: string
    logo_url?: string | null
    products_count: number
  }
  
  export interface SearchResult {
    search: {
      products: ProductSearchResult[]
      categories: CategorySearchResult[]
      brands: BrandSearchResult[]
      total_count: number
    }
  }
  
  export interface Suggestion {
    id: string
    text: string
    type: 'PRODUCT' | 'CATEGORY' | 'BRAND'
    slug: string
    image_url?: string | null
    price?: number | null
    avg_rating?: number | null
    reviews_count?: number | null
  }
  
  export interface AutocompleteResult {
    autocomplete: Suggestion[]
  }