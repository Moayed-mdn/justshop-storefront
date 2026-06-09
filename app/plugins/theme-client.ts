/**
 * Client-side theme token injector
 * 
 * This plugin ensures theme CSS variables are applied on the client side
 * after hydration, in case SSR injection fails or theme changes dynamically.
 */

export default defineNuxtPlugin({
  name: 'theme-client',
  enforce: 'post',
  async setup() {
    // Only run on client
    if (process.server) return

    const { theme, fetchTheme, applyThemeTokens } = useStoreTheme()

    // If theme is not already loaded, fetch it
    if (!theme.value) {
      await fetchTheme()
    }

    // Apply theme tokens to the DOM
    if (theme.value) {
      await applyThemeTokens()
      
      console.info('[Theme Client] Theme tokens applied', {
        themeName: theme.value.name,
        themeVersion: theme.value.version
      })
    }
  }
})
