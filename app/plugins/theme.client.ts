import { useTheme } from '~/composables/useTheme'

export default defineNuxtPlugin(() => {
  const { initTheme } = useTheme()
  initTheme()
})
