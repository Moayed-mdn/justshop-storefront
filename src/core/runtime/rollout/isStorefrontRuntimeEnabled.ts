import type { Tenant } from '../../tenant/types'

export type StorefrontRuntimeRolloutMode = 'off' | 'internal' | 'pilot' | 'full'

export interface StorefrontRuntimeRolloutConfig {
  mode: StorefrontRuntimeRolloutMode
  killSwitch: boolean
  internalTenantKeys: string[]
  pilotTenantKeys: string[]
}

const parseTenantKeys = (value: string | string[] | undefined): string[] => {
  if (Array.isArray(value)) {
    return value.map(String).map(key => key.trim()).filter(Boolean)
  }

  return String(value || '')
    .split(',')
    .map(key => key.trim())
    .filter(Boolean)
}

export const normalizeStorefrontRuntimeRolloutConfig = (
  config?: Partial<StorefrontRuntimeRolloutConfig> & {
    internalTenantKeys?: string | string[]
    pilotTenantKeys?: string | string[]
  },
): StorefrontRuntimeRolloutConfig => ({
  mode: (config?.mode || 'full') as StorefrontRuntimeRolloutMode,
  killSwitch: Boolean(config?.killSwitch),
  internalTenantKeys: parseTenantKeys(config?.internalTenantKeys),
  pilotTenantKeys: parseTenantKeys(config?.pilotTenantKeys),
})

const matchesTenantList = (tenant: Tenant, keys: string[]): boolean => {
  if (keys.length === 0) {
    return false
  }

  const candidates = [
    String(tenant.slug || ''),
    String(tenant.id || ''),
    `store_${String(tenant.id || '')}`,
    String(tenant.domain || ''),
  ].filter(Boolean)

  return keys.some(key => candidates.includes(key))
}

export const isStorefrontRuntimeEnabledForTenant = (
  tenant: Tenant | null,
  rollout: StorefrontRuntimeRolloutConfig,
): boolean => {
  if (!tenant || rollout.killSwitch) {
    return false
  }

  switch (rollout.mode) {
    case 'full':
      return true
    case 'off':
      return false
    case 'internal':
      return matchesTenantList(tenant, rollout.internalTenantKeys)
    case 'pilot':
      return matchesTenantList(tenant, rollout.internalTenantKeys)
        || matchesTenantList(tenant, rollout.pilotTenantKeys)
    default:
      return false
  }
}

export const isStorefrontRuntimeEnabled = (): boolean => {
  const runtimeConfig = useRuntimeConfig()
  const storefrontContext = useStorefrontContext()
  const rollout = normalizeStorefrontRuntimeRolloutConfig(
    runtimeConfig.storefrontRuntimeRollout as StorefrontRuntimeRolloutConfig,
  )

  return isStorefrontRuntimeEnabledForTenant(storefrontContext.value.tenant, rollout)
}
