export type BestSellerDTO = {
category_id: number;
category_name: string;
category_slug: string;
products: Array<BestSellerProductDTO>;
};
export type BestSellerProductDTO = {
product_id: number;
slug: string;
category_id: number;
primary_image: string;
alt_text: string | null;
product_name: string;
price:string;
description:string;
total_sold: number;
};
export type HeroBannerDTO = {
id: number;
title: string | null;
subtitle: string | null;
cat_text: string | null;
cat_url: string;
position: number;
visual: { type: "image"; img_url: string } | { type: "gradient"; gradient_from: string; gradient_to: string };
};
