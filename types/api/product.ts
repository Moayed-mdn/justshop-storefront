export interface ProductApiFilters {
  category_slug?: string
  min_price?: number
  max_price?: number
  earliest_manufacture?: string
  latest_expiry?: string
  per_page?: number
  page?: number
}

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


export interface CartItem {
  productId: string | number
  quantity: number
  
}