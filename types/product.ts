import type { ApiPaginated } from './api'

export interface ProductCard {
  product_id: number;
  product_variant_id: number;
  slug: string;
  category_id: number;
  primary_image: string; // This will be a full URL
  alt_text: string | null;
  product_name: string;
  price: number;
  currency?: string;
  description: string;
  total_sold: number | null; // This field may not always be present
}

// Represents a filter category/descendant
export interface FilterDescendant {
  id: number;
  name: string;
  slug: string;
}

export interface ProductListFilters {
  descendants: FilterDescendant[];
  min_price: number | null;
  max_price: number | null;
  earliest_manufacture: string | null; // ISO 8601 date string
  latest_expiry: string | null; // ISO 8601 date string
}

export interface BreadcrumbItem {
  id: number;
  name: string;
  slug: string;
}

export interface ProductListCategoryMeta {
  id: number;
  name: string;
  slug: string;
  breadcrumb: BreadcrumbItem[];
}

// This combines the possible metadata from both the general and category-specific product lists.
export interface ProductListMeta {
  filters: ProductListFilters;
  category?: ProductListCategoryMeta; // Optional, as it only appears on category-specific endpoints
}

// The final, composite response type for the product list.
// Assumes a global ApiPaginated<T, M> type like:
// interface ApiPaginated<T, M = Record<string, any>> {
//   success: true;
//   data: T[];
//   message: string;
//   meta: {
//     pagination: {
//       total: number;
//       per_page: number;
//       current_page: number;
//       last_page: number;
//       from: number;
//       to: number;
//     };
//   } & M;
// }

export type ProductListResponse = ApiPaginated<ProductCard, ProductListMeta>;



