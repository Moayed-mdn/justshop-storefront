export type StorefrontShellVariant = 'full' | 'minimal' | 'runtime-bridge' | 'auth-template'

export interface StorefrontShellConfig {
  variant: StorefrontShellVariant
  showTopbar: boolean
  showSearch: boolean
  showCart: boolean
  showAccount: boolean
  showFooter: boolean
  showRuntimeNavigation: boolean
}

const STOREFRONT_SHELL_KEY = Symbol('storefront-shell-config')

export const defaultStorefrontShellConfig = (
  variant: StorefrontShellVariant = 'full',
): StorefrontShellConfig => ({
  variant,
  showTopbar: variant !== 'minimal' && variant !== 'auth-template',
  showSearch: variant !== 'minimal' && variant !== 'auth-template',
  showCart: true,
  showAccount: true,
  showFooter: variant !== 'minimal',
  showRuntimeNavigation: variant !== 'minimal',
})

export function provideStorefrontShell(config: MaybeRefOrGetter<StorefrontShellConfig>) {
  provide(STOREFRONT_SHELL_KEY, config)
}

/**
 * SSR-safe storefront shell visibility model shared by legacy and runtime surfaces.
 */
export function useStorefrontShell() {
  const injected = inject<MaybeRefOrGetter<StorefrontShellConfig> | null>(
    STOREFRONT_SHELL_KEY,
    null,
  )

  const config = computed(() => {
    if (injected) {
      return toValue(injected)
    }

    return defaultStorefrontShellConfig('full')
  })

  const isMinimal = computed(() => config.value.variant === 'minimal')
  const isRuntimeBridge = computed(() => config.value.variant === 'runtime-bridge')
  const isAuthTemplate = computed(() => config.value.variant === 'auth-template')

  return {
    config,
    isMinimal,
    isRuntimeBridge,
    isAuthTemplate,
  }
}
