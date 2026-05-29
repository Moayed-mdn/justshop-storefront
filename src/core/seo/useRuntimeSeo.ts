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
  const injectSeo = (metadata: SeoMetadata) => {
    const title = metadata.title || 'JustShop Storefront'
    const description = metadata.description || ''
    const canonical = metadata.canonical || ''
    const robots = metadata.noIndex ? 'noindex,nofollow' : 'index,follow'

    useHead({
      title,
      meta: [
        { name: 'description', content: description },
        { name: 'robots', content: robots },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: metadata.ogType || 'website' },
        ...(metadata.ogImage ? [{ property: 'og:image', content: metadata.ogImage }] : []),
        ...(metadata.twitterCard ? [{ name: 'twitter:card', content: metadata.twitterCard }] : []),
        ...(metadata.twitterTitle ? [{ name: 'twitter:title', content: metadata.twitterTitle }] : []),
        ...(metadata.twitterDescription ? [{ name: 'twitter:description', content: metadata.twitterDescription }] : []),
        ...(metadata.twitterImage ? [{ name: 'twitter:image', content: metadata.twitterImage }] : []),
      ],
      link: [
        ...(canonical ? [{ rel: 'canonical', href: canonical }] : []),
        ...((metadata.hreflang || []).map(entry => ({
          rel: 'alternate',
          hreflang: entry.locale,
          href: entry.url,
        }))),
      ],
      script: (metadata.jsonLd || []).map(item => ({
        type: 'application/ld+json',
        children: JSON.stringify(item)
      })),
    })
  }

  return {
    injectSeo
  }
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
