import {
  STOREFRONT_RUNTIME_CACHE_ARTIFACTS,
  STOREFRONT_RUNTIME_CONTRACT_VERSION,
  STOREFRONT_RUNTIME_LAYOUTS,
  STOREFRONT_RUNTIME_PAGE_TYPES,
  STOREFRONT_RUNTIME_SUPPORTED_LOCALES,
} from './constants'

export type StorefrontRuntimeVersion = typeof STOREFRONT_RUNTIME_CONTRACT_VERSION
export type StorefrontRuntimeLocale = (typeof STOREFRONT_RUNTIME_SUPPORTED_LOCALES)[number]
export type RuntimePageType = (typeof STOREFRONT_RUNTIME_PAGE_TYPES)[number]
export type RuntimeLayout = (typeof STOREFRONT_RUNTIME_LAYOUTS)[number]
export type RuntimeCacheArtifact = (typeof STOREFRONT_RUNTIME_CACHE_ARTIFACTS)[number]

export type RuntimeRouteStatus = 'matched' | 'not_found'
export type RuntimeErrorCode =
  | 'runtime.tenant_not_found'
  | 'runtime.tenant_inactive'
  | 'runtime.invalid_locale'
  | 'runtime.route_not_found'
  | 'runtime.page_not_found'
  | 'runtime.preview_invalid'
  | 'runtime.preview_expired'
  | 'runtime.validation_failed'
  | 'runtime.rollout_disabled'
  | 'runtime.internal_error'

export interface RuntimeRequestHeaders {
  host: string
  storefrontVersion: StorefrontRuntimeVersion
  storefrontLocale: StorefrontRuntimeLocale
  requestId: string
  previewToken?: string | null
}

export interface RuntimeRouteResolutionRequest {
  headers: RuntimeRequestHeaders
  query: {
    path: string
    locale?: StorefrontRuntimeLocale
  }
}

export interface RuntimePagePayloadRequest {
  headers: RuntimeRequestHeaders
  params: {
    id: string
  }
  query: {
    preview?: boolean
  }
}

export interface RuntimeNavigationRequest {
  headers: RuntimeRequestHeaders
}

export interface RuntimeThemeRequest {
  headers: RuntimeRequestHeaders
}

export interface RuntimePreviewValidationRequest {
  headers: RuntimeRequestHeaders
  body: {
    token: string
    pageId: string
    path: string
    locale: StorefrontRuntimeLocale
  }
}

export interface RuntimeRequestContext {
  requestId: string
  tenantId: string | null
  tenantKey: string | null
  locale: StorefrontRuntimeLocale
  path: string
  runtimeVersion: StorefrontRuntimeVersion
  preview: boolean
}

export interface RuntimeCacheDescriptor {
  key: string
  artifact: RuntimeCacheArtifact
  ttlSeconds: number
  tags: string[]
  bypassed: boolean
}

export interface RuntimeRouteMatch {
  status: RuntimeRouteStatus
  routeType: RuntimePageType
  pageId: string | null
  resourceType: 'page' | 'product' | 'category' | 'none'
  resourceId: string | null
  path: string
  locale: StorefrontRuntimeLocale
  layout: RuntimeLayout | null
  legacyPassthrough: boolean
}

export interface RuntimeRouteResolutionResponse {
  requestContext: RuntimeRequestContext
  data: RuntimeRouteMatch
  cache: RuntimeCacheDescriptor
}

export interface RuntimeSectionDto {
  id: string
  type: string
  component: string
  props: Record<string, unknown>
  version: string
  dataState: 'ready' | 'empty' | 'error'
}

export interface RuntimeSeoPayload {
  title: string
  description: string
  canonicalUrl: string
  robots: 'index,follow' | 'noindex,nofollow' | 'noindex,follow'
  hreflang: Array<{
    locale: StorefrontRuntimeLocale
    url: string
  }>
  openGraph: {
    title: string
    description: string
    type: 'website' | 'product'
    imageUrl: string | null
  }
  twitter: {
    card: 'summary' | 'summary_large_image'
    title: string
    description: string
    imageUrl: string | null
  }
  jsonLd: Record<string, unknown>[]
}

export interface RuntimePagePayload {
  id: string
  pageType: RuntimePageType
  title: string
  slug: string
  locale: StorefrontRuntimeLocale
  layout: RuntimeLayout
  status: 'published' | 'draft'
  sections: RuntimeSectionDto[]
  seo: RuntimeSeoPayload
  publishedAt: string | null
  updatedAt: string
}

export interface RuntimePagePayloadResponse {
  requestContext: RuntimeRequestContext
  data: {
    page: RuntimePagePayload
  }
  cache: RuntimeCacheDescriptor
}

export interface RuntimeNavigationItem {
  id: string
  label: string
  path: string
  external: boolean
  children: RuntimeNavigationItem[]
}

export interface RuntimeNavigationResponse {
  requestContext: RuntimeRequestContext
  data: {
    header: RuntimeNavigationItem[]
    footer: RuntimeNavigationItem[]
  }
  cache: RuntimeCacheDescriptor
}

export interface RuntimeThemeResponse {
  requestContext: RuntimeRequestContext
  data: {
    themeKey: string
    branding?: {
      storeName: string
      tagline: string
    }
    tokens: {
      colorPrimary: string
      colorSecondary: string
      colorAccent: string
      colorSurface: string
      colorText: string
      fontBody: string
      fontHeading: string
    }
    assets: {
      logoUrl: string | null
      faviconUrl: string | null
    }
    settings: {
      radius: 'none' | 'sm' | 'md' | 'lg'
      direction: 'ltr' | 'rtl'
    }
  }
  cache: RuntimeCacheDescriptor
}

export interface RuntimePreviewValidationResponse {
  requestContext: RuntimeRequestContext
  data: {
    valid: boolean
    previewState: 'authorized' | 'denied' | 'expired'
    pageId: string | null
    expiresAt: string | null
    cacheBypass: boolean
  }
}

export interface RuntimeErrorResponse {
  requestContext: RuntimeRequestContext
  error: {
    code: RuntimeErrorCode
    message: string
    httpStatus: 400 | 401 | 403 | 404 | 409 | 422 | 500 | 503
    retryable: boolean
    details: Record<string, unknown>
  }
}
