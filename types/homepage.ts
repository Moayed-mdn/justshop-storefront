import type { ApiSuccess } from './api';
import type { ProductCard } from './product';

// Homepage best sellers types
export interface BestSellerCategory {
  category_id: number;
  category_name: string;
  category_slug: string;
  products: ProductCard[];
}

export type BestSellerResponse = ApiSuccess<BestSellerCategory[]>;
