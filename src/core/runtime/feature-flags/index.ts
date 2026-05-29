import { useStorefrontContext } from '../../tenant/composables'

export interface FeatureFlags {
  storefront_runtime: boolean
  dynamic_rendering: boolean
  new_checkout: boolean
  merchant_previews: boolean
}

export const useFeatureFlags = () => {
  const context = useStorefrontContext()
  
  const isEnabled = (flag: keyof FeatureFlags) => {
    return !!context.value.featureFlags[flag]
  }
  
  return {
    isEnabled,
  }
}
