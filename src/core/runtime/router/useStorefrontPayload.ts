import type { StorefrontPayload, RuntimeResolvedRoute } from './types'
import { useStorefrontApi } from '../../api/client'
import { createTenantCacheKey } from '../../cache/createTenantCacheKey'
import { useSectionData } from '../../rendering/useSectionData'

export const useStorefrontPayload = () => {
  const { fetchSectionData } = useSectionData()

  const fetchPayload = async (resolved: RuntimeResolvedRoute): Promise<StorefrontPayload | null> => {
    const key = createTenantCacheKey(`payload:${resolved.type}:${resolved.resourceId}`)

    const { data } = await useAsyncData(key, async () => {
      // In Phase 2/3, we orchestrate the payload
      const mockPayload = getMockPayload(resolved)
      
      // Fetch data for each section
      const sectionsWithData = await Promise.all(
        mockPayload.sections.map(async (section) => {
          const sectionData = await fetchSectionData(section.type, section.settings)
          return {
            ...section,
            data: sectionData
          }
        })
      )

      return {
        ...mockPayload,
        sections: sectionsWithData
      } as StorefrontPayload
    })

    return data.value || null
  }

  const getMockPayload = (resolved: RuntimeResolvedRoute): StorefrontPayload => {
    if (resolved.type === 'product') {
      return {
        id: resolved.resourceId,
        title: `Product ${resolved.slug}`,
        sections: [
          {
            id: 'product-detail-1',
            type: 'product_detail',
            settings: { slug: resolved.slug },
            data: {}
          }
        ],
        seo: {
          title: `Buy ${resolved.slug}`,
          description: `Best price for ${resolved.slug}`
        },
        theme: {}
      }
    }

    if (resolved.type === 'category' || resolved.type === 'collection') {
      return {
        id: resolved.resourceId,
        title: `${resolved.type} ${resolved.slug}`,
        sections: [
          {
            id: 'shop-grid-1',
            type: 'shop_grid',
            settings: { 
              categorySlug: resolved.type === 'category' ? resolved.slug : undefined,
              params: resolved.metadata?.params || {}
            },
            data: {}
          }
        ],
        seo: {
          title: `Shop ${resolved.slug}`,
          description: `Browse our ${resolved.slug} collection`
        },
        theme: {}
      }
    }

    return {
      id: resolved.resourceId,
      title: `Mock ${resolved.type}`,
      sections: [
        {
          id: 'section-1',
          type: 'hero_section',
          settings: {},
          data: {}
        },
        {
          id: 'section-2',
          type: 'best_sellers',
          settings: {},
          data: {}
        }
      ],
      seo: {
        title: `Storefront - ${resolved.type}`,
        description: 'Dynamic Storefront Platform'
      },
      theme: {}
    }
  }

  return {
    fetchPayload
  }
}
