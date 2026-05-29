import type { Component } from 'vue'
import type { RuntimeSectionData } from './types'
import RuntimeCategoryGridSection from './sections/RuntimeCategoryGridSection.vue'
import RuntimeCategorySummarySection from './sections/RuntimeCategorySummarySection.vue'
import RuntimeFeatureListSection from './sections/RuntimeFeatureListSection.vue'
import RuntimeHeroSection from './sections/RuntimeHeroSection.vue'
import RuntimeProductGridSection from './sections/RuntimeProductGridSection.vue'
import RuntimeProductSummarySection from './sections/RuntimeProductSummarySection.vue'

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
}

export const useSectionRegistry = () => {
  const getSection = (componentKey: string) => {
    return sectionRegistry[componentKey] || null
  }

  return {
    getSection
  }
}
