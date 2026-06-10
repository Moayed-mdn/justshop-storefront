import type { ApiSuccess } from './api';



export interface ProductRelated {
    id: number;
    name: string;
    slug: string;
    description: string;
    primary_image: string;
    price: number;
    category_id: number;
    product_variant_id: number;
}


export type   ProductRelatedResponse = ApiSuccess<ProductRelated[]>