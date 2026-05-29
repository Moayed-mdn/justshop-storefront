// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const { fetchUser, isLoggedIn } = useAuth()

  // Always try to fetch user if logged in, even on server to enable SSR identity
  if (isLoggedIn.value) {
    try {
      await fetchUser()
    } catch (e) {
      // Fail silently on SSR to avoid breaking the initial render
      if (import.meta.dev) {
        console.error('[auth-plugin] fetchUser failed during initialization', e)
      }
    }
  }
})