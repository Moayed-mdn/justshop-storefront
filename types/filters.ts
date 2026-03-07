export interface Category {
  id: number
  name: string
  slug: string
}

export interface BackendFilters {
  descendants: Category[]
  min_price: number
  max_price: number
  earliest_manufacture?: string
  latest_expiry?: string
}

export interface ShopFilters {
  categorySlug?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  manufactureFrom?: string | null
  expiryTo?: string | null
}

