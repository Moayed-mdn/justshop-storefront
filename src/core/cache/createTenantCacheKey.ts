import { useStorefrontContext } from '../tenant/composables'

export const createTenantCacheKey = (key: string) => {
  const context = useStorefrontContext()
  const tenantId = context.value.tenant?.id || 'default'
  const locale = context.value.locale || 'en'
  const preview = context.value.preview ? 'preview' : 'live'
  
  return `tenant:${tenantId}:locale:${locale}:state:${preview}:key:${key}`
}
