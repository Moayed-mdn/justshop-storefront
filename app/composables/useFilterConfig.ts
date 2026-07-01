import type { RuntimeTemplateSectionDetail } from '~~/src/core/runtime/contracts/types'

export interface ProductFilterConfig {
  showCategoryFilter: boolean
  showPriceFilter: boolean
  showManufactureFilter: boolean
  showExpiryFilter: boolean
  showBrandFilter: boolean
  showRatingFilter: boolean
}

const DEFAULTS: ProductFilterConfig = {
  showCategoryFilter: true,
  showPriceFilter: true,
  showManufactureFilter: true,
  showExpiryFilter: true,
  showBrandFilter: false,
  showRatingFilter: false,
}

function parseSectionSettings(settings: Record<string, unknown>): ProductFilterConfig {
  return {
    showCategoryFilter: settings.show_category_filter !== false,
    showPriceFilter: settings.show_price_filter !== false,
    showManufactureFilter: settings.show_manufacture_filter !== false,
    showExpiryFilter: settings.show_expiry_filter !== false,
    showBrandFilter: settings.show_brand_filter === true,
    showRatingFilter: settings.show_rating_filter === true,
  }
}

export function useFilterConfig() {
  const api = useApi()
  const { locale } = useI18n()
  const route = useRoute()

  const pageType = useState<string | null>('filter-config-page-type', () => null)

  const filterConfig = useState<ProductFilterConfig>('product-filter-config', () => ({ ...DEFAULTS }))

  const configLoading = useState<boolean>('product-filter-config-loading', () => false)

  async function fetchFilterConfig(type: string): Promise<ProductFilterConfig> {
    configLoading.value = true
    pageType.value = type

    try {
      const res = await api<{ data: { sections: Record<string, RuntimeTemplateSectionDetail> } | null }>(
        `/api/storefront/runtime/template/${type}`,
        { showError: false }
      )

      const templateData = res?.data?.data
      if (!templateData?.sections) {
        filterConfig.value = { ...DEFAULTS }
        return filterConfig.value
      }

      const filterSection = Object.values(templateData.sections).find(
        (s: RuntimeTemplateSectionDetail) => s.type === 'search_filters' && s.enabled !== false
      )

      if (filterSection?.settings) {
        filterConfig.value = parseSectionSettings(filterSection.settings)
      } else {
        filterConfig.value = { ...DEFAULTS }
      }

      return filterConfig.value
    } catch {
      filterConfig.value = { ...DEFAULTS }
      return filterConfig.value
    } finally {
      configLoading.value = false
    }
  }

  return {
    filterConfig,
    configLoading,
    fetchFilterConfig,
  }
}
