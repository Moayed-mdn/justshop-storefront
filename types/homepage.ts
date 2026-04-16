import type { ApiSuccess } from './api';
import type { ProductCard } from './product';

// Assumes a global ApiResponse<T> type
// interface ApiResponse<T> {
//   success: true;
//   data: T;
//   message: string;
// }

export interface BestSellerCategory {
  category_id: number;
  category_name: string;
  category_slug: string;
  products: ProductCard[];
}

export type BestSellerResponse = ApiSuccess<BestSellerCategory[]>;

interface HeroVisualImage {
  type: 'image';
  img_url: string;
}

interface HeroVisualGradient {
  type: 'gradient';
  gradient_from: string;
  gradient_to: string;
}

export type HeroVisual = HeroVisualImage | HeroVisualGradient;

export interface HeroBanner {
  id: number;
  title: string;
  subtitle: string;
  cat_text: string;
  cat_url: string;
  position: number;
  visual: HeroVisual;
}

export type HeroBannerResponse = ApiSuccess<HeroBanner[]>;
