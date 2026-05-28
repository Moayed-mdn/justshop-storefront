import type { StorefrontContext, Tenant } from './types'

export const useStorefrontContext = () => {
  return useState<StorefrontContext>('storefront_context', () => ({
    tenant: null,
    locale: 'en',
    currency: 'USD',
    theme: 'default',
    preview: false,
    route: '',
    featureFlags: {},
    requestId: '',
  }))
}

export const useTenant = () => {
  const context = useStorefrontContext()
  
  const tenant = computed(() => context.value.tenant)
  const tenantId = computed(() => context.value.tenant?.id)
  
  const isActive = computed(() => context.value.tenant?.status === 'active')
  
  return {
    tenant,
    tenantId,
    isActive,
  }
}
