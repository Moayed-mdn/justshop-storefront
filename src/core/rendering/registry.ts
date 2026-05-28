import { defineAsyncComponent } from 'vue'

export const sectionRegistry: Record<string, any> = {
  hero_section: defineAsyncComponent(() => import('../../../app/components/hero/HeroSection.vue')),
  best_sellers: defineAsyncComponent(() => import('../../../app/components/layout/LayoutBestSellers.vue')),
  product_detail: defineAsyncComponent(() => import('./sections/ProductDetailSection.vue')),
  shop_grid: defineAsyncComponent(() => import('./sections/ShopGridSection.vue')),
  // More sections will be added here as we decouple them
}

export const useSectionRegistry = () => {
  const getSection = (type: string) => {
    return sectionRegistry[type] || null
  }

  return {
    getSection
  }
}
