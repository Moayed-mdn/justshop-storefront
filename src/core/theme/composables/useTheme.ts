import { inject, type InjectionKey, type Ref } from 'vue'
import type { RuntimeThemeResponse } from '~/core/runtime/contracts/types'

const THEME_CONTEXT_KEY: InjectionKey<Ref<RuntimeThemeResponse['data'] | null>> = Symbol('theme-context')

/**
 * Composable to access the current theme configuration from runtime context
 */
export function useTheme() {
  const theme = inject(THEME_CONTEXT_KEY, ref(null))

  return {
    theme,
  }
}

/**
 * Provide theme context (used by app root or layout)
 */
export function provideTheme(themeData: Ref<RuntimeThemeResponse['data'] | null>) {
  provide(THEME_CONTEXT_KEY, themeData)
}
