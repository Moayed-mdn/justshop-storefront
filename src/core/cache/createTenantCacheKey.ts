import { useStorefrontContext } from '../tenant/composables'
import { STOREFRONT_RUNTIME_CONTRACT_VERSION } from '../runtime/contracts/constants'

type RuntimeCacheArtifact = 'route' | 'page' | 'navigation' | 'theme' | 'seo'

const normalizeRuntimePath = (path: string) => {
  const trimmed = path.trim()

  if (!trimmed || trimmed === '/') {
    return '/'
  }

  const normalized = `/${trimmed.replace(/^\/+/, '')}`.replace(/\/{2,}/g, '/')

  return normalized !== '/' ? normalized.replace(/\/+$/, '') : '/'
}

export const createTenantCacheKey = (
  key: string,
  options?: {
    route?: string
    runtimeVersion?: string
    previewState?: string
    artifact?: RuntimeCacheArtifact
  },
) => {
  const context = useStorefrontContext()
  const tenantKey = String(context.value.tenant?.slug || context.value.tenant?.id || 'default')
  const locale = context.value.locale || 'en'
  const preview = options?.previewState || (context.value.preview ? 'preview' : 'live')
  const route = normalizeRuntimePath(options?.route || context.value.route || '/')
  const runtimeVersion = options?.runtimeVersion || STOREFRONT_RUNTIME_CONTRACT_VERSION

  if (options?.artifact) {
    const runtimeKey = `storefront_runtime:${runtimeVersion}:tenant:${tenantKey}:locale:${locale}:artifact:${options.artifact}:path:${route}`

    return preview !== 'live'
      ? `${runtimeKey}:preview:${preview}`
      : runtimeKey
  }

  return `tenant:${tenantKey}:locale:${locale}:runtime:${runtimeVersion}:route:${route}:state:${preview}:key:${key}`
}
