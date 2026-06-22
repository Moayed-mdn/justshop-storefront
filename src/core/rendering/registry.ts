import type { Component } from 'vue'
import type { RuntimeSectionData } from './types'
import RuntimeCategoryGridSection from './sections/RuntimeCategoryGridSection.vue'
import RuntimeCategorySummarySection from './sections/RuntimeCategorySummarySection.vue'
import RuntimeContentSection from './sections/RuntimeContentSection.vue'
import RuntimeCtaSection from './sections/RuntimeCtaSection.vue'
import RuntimeFaqSection from './sections/RuntimeFaqSection.vue'
import RuntimeFeatureListSection from './sections/RuntimeFeatureListSection.vue'
import RuntimeGallerySection from './sections/RuntimeGallerySection.vue'
import RuntimeHeroSection from './sections/RuntimeHeroSection.vue'
import RuntimePricingSection from './sections/RuntimePricingSection.vue'
import RuntimeProductGridSection from './sections/RuntimeProductGridSection.vue'
import RuntimeProductSummarySection from './sections/RuntimeProductSummarySection.vue'
import RuntimeTestimonialsSection from './sections/RuntimeTestimonialsSection.vue'
import RuntimeVideoSection from './sections/RuntimeVideoSection.vue'
import ShopGridSection from './sections/ShopGridSection.vue'

export interface RuntimeSectionRegistryEntry {
  component: Component
  validate?: (data: RuntimeSectionData) => boolean
}

const hasName = (data: RuntimeSectionData) => typeof data.name === 'string' && data.name.trim().length > 0

export const sectionRegistry: Record<string, RuntimeSectionRegistryEntry> = {
  HeroSection: {
    component: RuntimeHeroSection,
  },
  FeatureListSection: {
    component: RuntimeFeatureListSection,
  },
  ContentSection: {
    component: RuntimeContentSection,
  },
  CtaSection: {
    component: RuntimeCtaSection,
  },
  FaqSection: {
    component: RuntimeFaqSection,
  },
  TestimonialsSection: {
    component: RuntimeTestimonialsSection,
  },
  GallerySection: {
    component: RuntimeGallerySection,
  },
  VideoSection: {
    component: RuntimeVideoSection,
  },
  PricingSection: {
    component: RuntimePricingSection,
  },
  CategoryGridSection: {
    component: RuntimeCategoryGridSection,
    validate: (data) => Array.isArray(data.categories) && data.categories.length > 0,
  },
  CategorySummarySection: {
    component: RuntimeCategorySummarySection,
    validate: hasName,
  },
  ProductGridSection: {
    component: RuntimeProductGridSection,
    validate: (data) => Array.isArray(data.products),
  },
  ProductSummarySection: {
    component: RuntimeProductSummarySection,
    validate: hasName,
  },
  ShopGridSection: {
    component: ShopGridSection,
  },
}

export const useSectionRegistry = () => {
  const getSection = (componentKey: string) => {
    return sectionRegistry[componentKey] || null
  }

  return {
    getSection
  }
}
