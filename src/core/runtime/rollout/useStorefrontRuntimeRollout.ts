import {
  isStorefrontRuntimeEnabled,
  isStorefrontRuntimeEnabledForTenant,
  normalizeStorefrontRuntimeRolloutConfig,
} from './isStorefrontRuntimeEnabled'
import { useStorefrontContext } from '../../tenant/composables'

export const useStorefrontRuntimeRollout = () => {
  const runtimeConfig = useRuntimeConfig()
  const storefrontContext = useStorefrontContext()
  const rollout = normalizeStorefrontRuntimeRolloutConfig(
    runtimeConfig.storefrontRuntimeRollout as Parameters<typeof normalizeStorefrontRuntimeRolloutConfig>[0],
  )

  const isEnabled = () => isStorefrontRuntimeEnabledForTenant(storefrontContext.value.tenant, rollout)

  return {
    rollout,
    isEnabled,
    isGloballyEnabled: () => isStorefrontRuntimeEnabled(),
  }
}
