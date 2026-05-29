import { STOREFRONT_RUNTIME_CONTRACT_VERSION } from '../contracts/constants'
import { useStorefrontContext } from '../../tenant/composables'

export type RuntimeLogStatus = 'success' | 'failure' | 'bypassed'

export interface RuntimeLogContext {
  artifact: 'route' | 'page' | 'navigation' | 'theme' | 'seo' | 'preview' | 'section'
  event: string
  status: RuntimeLogStatus
  path?: string
  duration_ms?: number
  details?: Record<string, unknown>
}

const normalizeRuntimePath = (path: string) => {
  const trimmed = path.trim()

  if (!trimmed || trimmed === '/') {
    return '/'
  }

  const normalized = `/${trimmed.replace(/^\/+/, '')}`.replace(/\/{2,}/g, '/')

  return normalized !== '/' ? normalized.replace(/\/+$/, '') : '/'
}

export const logRuntimeEvent = (context: RuntimeLogContext, level: 'info' | 'warn' | 'error' = 'info') => {
  const storefrontContext = useStorefrontContext()
  const tenant = storefrontContext.value.tenant
  const path = normalizeRuntimePath(context.path || storefrontContext.value.route || '/')

  const record = {
    tenant_id: tenant?.id ? String(tenant.id) : null,
    tenant_key: tenant?.slug || null,
    locale: storefrontContext.value.locale || 'en',
    path,
    request_id: storefrontContext.value.requestId || null,
    runtime_version: STOREFRONT_RUNTIME_CONTRACT_VERSION,
    artifact: context.artifact,
    event: context.event,
    status: context.status,
    ...(context.duration_ms !== undefined ? { duration_ms: context.duration_ms } : {}),
    ...(context.details ? { details: context.details } : {}),
  }

  const message = `[${context.event}]`

  if (level === 'error') {
    console.error(message, record)
    return
  }

  if (level === 'warn') {
    console.warn(message, record)
    return
  }

  console.info(message, record)
}
