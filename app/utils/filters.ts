import type { UIProductListFilters } from './../../types/api/product';
import type { ProductListFilters } from './../../types/product';

export const mapToUIFilters = (backend: ProductListFilters | null): UIProductListFilters => {
  if (!backend) {
    return {
      descendants: [],
      min_price: 0,
      max_price: 0,
      earliest_manufacture: undefined,
      latest_expiry: undefined
    };
  }

  return {
    descendants: backend.descendants || [],
    min_price: backend.min_price ?? 0,
    max_price: backend.max_price ?? 0,
    earliest_manufacture: backend.earliest_manufacture ?? undefined,
    latest_expiry: backend.latest_expiry ?? undefined
  };
};