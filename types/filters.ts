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

// Router query representation (all strings, as they appear in the URL)
export interface ProductQuery {
  category?: string
  min_price?: string
  max_price?: string
  earliest_manufacture?: string
  latest_expiry?: string
  per_page?: string
  page?: string
}

// Backend API filters representation (parsed types for the API layer)
export interface ProductApiFilters {
  category_slug?: string
  min_price?: number
  max_price?: number
  earliest_manufacture?: string
  latest_expiry?: string
  per_page: number
  page: number
}


