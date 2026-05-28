import { useStorefrontContext } from '../tenant/composables'

export interface SeoMetadata {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: string
  noIndex?: boolean
  jsonLd?: any[]
}

export const useRuntimeSeo = () => {
  const context = useStorefrontContext()
  const { locale } = context.value

  const injectSeo = (metadata: SeoMetadata) => {
    const title = metadata.title || 'JustShop Storefront'
    const description = metadata.description || ''
    
    useHead({
      title,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: metadata.ogType || 'website' },
        { name: 'robots', content: metadata.noIndex ? 'noindex, nofollow' : 'index, follow' },
      ],
      link: [
        { rel: 'canonical', href: metadata.canonical || '' }
      ],
      script: (metadata.jsonLd || []).map(item => ({
        type: 'application/ld+json',
        children: JSON.stringify(item)
      }))
    })

    // Handle language alternates (hreflang)
    // This would typically come from the route resolver
  }

  return {
    injectSeo
  }
}
