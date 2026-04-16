import type { ProductCard, ProductListFilters } from '../product'

export interface Pagination {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export interface ShopLayout {
    data: ProductCard[]
    pagination?: Pagination
    filters?: ProductListFilters
}

export interface CategoryShopLayout extends ShopLayout {
    category?: {
        id: number
        name: string
        slug: string
        breadcrumb: Array<{ id: number; name: string; slug: string }>
    }
}