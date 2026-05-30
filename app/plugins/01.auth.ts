// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
  const { fetchUser, user } = useAuth()
  const sessionCookie = useCookie('ecommerce_session')
  const xsrfCookie = useCookie('XSRF-TOKEN')

  // Rehydrate auth state from the backend session cookie instead of a persisted token.
  if (!user.value && (sessionCookie.value || xsrfCookie.value)) {
    try {
      await fetchUser()
    } catch (e) {
      // Fail silently on SSR to avoid breaking the initial render
      if (import.meta.dev) {
        console.error('[auth-plugin] fetchUser failed during initialization', e)
      }
      // Stale or invalid session — clear cookies so we don't retry forever
      sessionCookie.value = null
      xsrfCookie.value = null
    }
  }
})
