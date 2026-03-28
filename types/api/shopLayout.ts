import type { BackendFilters } from './product'
import type { ProductCardDTO } from '../generated'

export interface Pagination {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export interface ShopLayout {
    data: ProductCardDTO[]
    pagination?: Pagination
    filters?: BackendFilters
}

export interface CategoryShopLayout extends ShopLayout {
    category?: {
        id: number
        name: string
        slug: string
        breadcrumb: Array<{ id: number; name: string; slug: string }>
    }
}