import type { ApiSuccess } from './api';
// types/productDetail.ts


export interface ProductImage {
    id: number;
    url: string;
    alt_text: string | null;
    is_primary: 0 | 1;
  }
  
  export interface ProductAttribute {
    name: string;
    value: string;
  }
  
  export interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    stock: number;
    is_active: 0 | 1;
    manufacture_date: string; // ISO date string (YYYY-MM-DD)
    expiry_date: string; // ISO date string (YYYY-MM-DD)
    attributes: ProductAttribute[];
    attribute_map: Record<string, string>; // e.g., { "Storage": "128GB", "Color": "Black" }
    images: ProductImage[];
    primary_image: ProductImage;
  }
  
  export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
  }
  
  export interface ProductBrand {
    id: number;
    name: string;
  }
  
  export interface ProductDetail {
    id: number;
    name: string;
    slug: string;
    description: string;
    default_variant_id: number;
    category: ProductCategory;
    brand: ProductBrand;
    attributes: Record<string, string[]>; // e.g., { "Storage": ["128GB", "256GB"], "Color": ["Black", "Green"] }
    variants: ProductVariant[];
  }
  
  export type ProductDetailResponse = ApiSuccess<ProductDetail>
  