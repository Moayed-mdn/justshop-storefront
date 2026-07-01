import type { FilterDescendant } from "../product"

export interface ProductApiFilters {
  category_slug?: string
  min_price?: number
  max_price?: number
  earliest_manufacture?: string
  latest_expiry?: string
  brand_slugs?: string[]
  min_rating?: number
  per_page?: number
  page?: number
}



export interface UIProductListFilters {
  descendants: FilterDescendant[]
  min_price: number
  max_price: number
  earliest_manufacture?: string
  latest_expiry?: string
  brands?: FilterDescendant[]
  min_rating?: number | null
  max_rating?: number | null
}


export interface CartItem {
  productId: string | number
  quantity: number
  
}