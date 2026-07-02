import { resolveTenant } from '../../src/core/tenant/resolver'
import {
  isStorefrontRuntimeEnabledForTenant,
  normalizeStorefrontRuntimeRolloutConfig,
} from '../../src/core/runtime/rollout/isStorefrontRuntimeEnabled'

const legacyPassthroughPrefixes = [
  '/login',
  '/register',
  '/cart',
  '/checkout',
  '/orders',
  '/profile',
  '/verify-email',
  '/auth',
  '/storage',
]

const isLegacyPassthroughPath = (path: string): boolean => {
  return legacyPassthroughPrefixes.some(prefix => path === prefix || path.startsWith(`${prefix}/`))
}

export default defineEventHandler(async (event) => {
  // 1. Resolve hostname
  const hostname = getHeader(event, 'host') || 'localhost'
  
  // 2. Resolve tenant
  const tenant = await resolveTenant(hostname)
  
  // 3. Reject malformed tenants
  if (!tenant) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tenant not found',
      data: { runtimeCode: 'runtime.tenant_not_found' },
    })
  }

  // 4. Inject tenant into context
  event.context.tenant = tenant
  event.context.tenantId = tenant.id
  event.context.tenantSlug = tenant.slug
  
  // 5. Setup initial storefront context for SSR
  // This will be picked up by useStorefrontContext on the client
  const locale = String(getCookie(event, 'i18n_redirected') || getHeader(event, 'x-storefront-locale') || 'en')
  const query = getQuery(event)
  const preview = query.preview === 'true' || query.preview === '1'
  const previewToken = typeof query.previewToken === 'string'
    ? query.previewToken
    : typeof query.token === 'string'
      ? query.token
      : null
  const requestId = String(getHeader(event, 'x-request-id') || crypto.randomUUID())
  const runtimeConfig = useRuntimeConfig(event)
  const rollout = normalizeStorefrontRuntimeRolloutConfig(runtimeConfig.storefrontRuntimeRollout)
  const storefrontRuntimeEnabled = isStorefrontRuntimeEnabledForTenant(tenant, rollout)

  event.context.storefrontContext = {
    tenant,
    locale,
    currency: tenant.settings?.currency || 'USD',
    theme: tenant.settings?.theme || 'default',
    preview,
    previewToken,
    route: event.path,
    featureFlags: {
      storefront_runtime: storefrontRuntimeEnabled,
    },
    requestId,
    navigation: null,
    themePayload: null,
  }

  if (
    !storefrontRuntimeEnabled
    && !event.path.startsWith('/api/')
    && !isLegacyPassthroughPath(event.path)
  ) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found',
    })
  }
})
