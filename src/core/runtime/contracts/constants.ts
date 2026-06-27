export const STOREFRONT_RUNTIME_CONTRACT_VERSION = '2026-05-28' as const

export const STOREFRONT_RUNTIME_SUPPORTED_LOCALES = ['en', 'ar'] as const

export const STOREFRONT_RUNTIME_PAGE_TYPES = [
  'home',
  'marketing_page',
  'category_page',
  'product_page',
  'auth_page',
] as const

export const STOREFRONT_RUNTIME_LAYOUTS = [
  'default',
  'marketing',
  'catalog',
  'product',
  'auth',
] as const

export const STOREFRONT_RUNTIME_CACHE_ARTIFACTS = [
  'route',
  'page',
  'navigation',
  'theme',
  'seo',
] as const

export const STOREFRONT_RUNTIME_LOG_FIELDS = [
  'tenant_id',
  'locale',
  'path',
  'request_id',
] as const
