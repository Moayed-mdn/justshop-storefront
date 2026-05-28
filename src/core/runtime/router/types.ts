export type ResourceType = 'page' | 'product' | 'category' | 'collection' | 'home' | 'search' | 'cart'

export interface RuntimeResolvedRoute {
  status: 'matched' | 'not_found' | 'redirect'
  type: ResourceType
  resourceId: string | number
  slug: string
  layout: string
  redirectUrl?: string
  cacheTtl: number
  metadata: Record<string, any>
}

export interface StorefrontPayload {
  id: string | number
  title: string
  description?: string
  sections: CmsSection[]
  seo: Record<string, any>
  theme: Record<string, any>
}

export interface CmsSection {
  id: string | number
  type: string
  settings: Record<string, any>
  data: any
}
