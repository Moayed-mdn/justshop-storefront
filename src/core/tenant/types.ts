export interface Tenant {
  id: string | number
  name: string
  slug: string
  domain: string
  status: 'active' | 'suspended' | 'maintenance'
  settings: Record<string, any>
}

export interface StorefrontContext {
  tenant: Tenant | null
  locale: string
  currency: string
  theme: string
  preview: boolean
  route: string
  featureFlags: Record<string, boolean>
  requestId: string
}
