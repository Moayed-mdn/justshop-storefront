import type { RuntimeSeoPayload } from '../runtime/contracts/types'

export interface SeoMetadata {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: string
  noIndex?: boolean
  jsonLd?: any[]
  hreflang?: Array<{
    locale: string
    url: string
  }>
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
}

export const useRuntimeSeo = () => {
  const seoMetadata = shallowRef<SeoMetadata | null>(null)

  useHead(() => {
    const current = seoMetadata.value

    if (!current) {
      return {}
    }

    const title = current.title || 'JustShop Storefront'
    const description = current.description || ''
    const canonical = current.canonical || ''
    const robots = current.noIndex ? 'noindex,nofollow' : 'index,follow'

    return {
      title,
      meta: [
        { name: 'description', content: description },
        { name: 'robots', content: robots },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: current.ogType || 'website' },
        ...(current.ogImage
          ? [{ property: 'og:image', content: current.ogImage }]
          : []),
        ...(current.twitterCard
          ? [{ name: 'twitter:card', content: current.twitterCard }]
          : []),
        ...(current.twitterTitle
          ? [{ name: 'twitter:title', content: current.twitterTitle }]
          : []),
        ...(current.twitterDescription
          ? [{ name: 'twitter:description', content: current.twitterDescription }]
          : []),
        ...(current.twitterImage
          ? [{ name: 'twitter:image', content: current.twitterImage }]
          : []),
      ],
      link: [
        ...(canonical ? [{ rel: 'canonical', href: canonical }] : []),
        ...((current.hreflang || []).map(entry => ({
          rel: 'alternate',
          hreflang: entry.locale,
          href: entry.url,
        }))),
      ],
      script: (current.jsonLd || []).map(item => ({
        type: 'application/ld+json',
        children: JSON.stringify(item),
      })),
    }
  })

  const injectSeo = (metadata: SeoMetadata) => {
    seoMetadata.value = metadata
  }

  return { injectSeo }
}

export const mapRuntimeSeoPayload = (seo: RuntimeSeoPayload): SeoMetadata => ({
  title: seo.title,
  description: seo.description,
  canonical: seo.canonicalUrl,
  ogImage: seo.openGraph.imageUrl || undefined,
  ogType: seo.openGraph.type,
  noIndex: seo.robots !== 'index,follow',
  jsonLd: seo.jsonLd,
  hreflang: seo.hreflang,
  twitterCard: seo.twitter.card,
  twitterTitle: seo.twitter.title,
  twitterDescription: seo.twitter.description,
  twitterImage: seo.twitter.imageUrl || undefined,
})
