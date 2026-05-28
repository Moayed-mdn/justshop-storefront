import { resolveTenant } from '../../src/core/tenant/resolver'

export default defineEventHandler(async (event) => {
  // 1. Resolve hostname
  const hostname = getHeader(event, 'host') || 'localhost'
  
  // 2. Resolve tenant
  const tenant = await resolveTenant(hostname)
  
  // 3. Reject unknown or suspended tenants
  if (!tenant) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tenant not found',
    })
  }
  
  if (tenant.status === 'suspended') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Storefront suspended',
    })
  }

  // 4. Inject tenant into context
  event.context.tenant = tenant
  event.context.tenantId = tenant.id
  
  // 5. Setup initial storefront context for SSR
  // This will be picked up by useStorefrontContext on the client
  const locale = getCookie(event, 'i18n_redirected') || 'en'
  
  event.context.storefrontContext = {
    tenant,
    locale,
    currency: tenant.settings?.currency || 'USD',
    theme: tenant.settings?.theme || 'default',
    preview: false, // TODO: handle preview mode
    route: event.path,
    featureFlags: {}, // TODO: handle feature flags
    requestId: event.id || Math.random().toString(36).substring(7),
  }
})
