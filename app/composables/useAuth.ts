// composables/useAuth.ts
export const useAuth = () => {
  const authStore = useAuthStore()
  const api = useClientApi()
  const config = useRuntimeConfig()

  const loading = useState('auth_loading', () => false)

  // ── Login ──────────────────────────────────────────────────
  const login = async (credentials: Record<string, string>) => {
    loading.value = true
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: credentials,
      })
      console.log('user', data.data.user)
      console.log('data', data.data)

      authStore.setToken(data.data.token)
      authStore.setUser(data.data.user)

      const cartStore = useCartStore()
      await cartStore.onLogin()

      return navigateTo('/')
    } catch (err: any) {
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── Register ───────────────────────────────────────────────
  const register = async (form: Record<string, string>) => {
    loading.value = true
    try {
      const data = await api('/auth/register', {
        method: 'POST',
        body: form,
      })
      return data
    } catch (err: any) {
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── Google OAuth ───────────────────────────────────────────
  const loginWithGoogle = () => {
    // Simply redirect the browser to the Laravel Google redirect endpoint.
    // Laravel will handle redirecting to Google, and Google will redirect
    // back to Laravel's callback, which will redirect to Nuxt's callback page.
    const apiBase = config.public.apiBase as string
    window.location.href = `${apiBase}/auth/google/redirect`
  }

  // Called from the /auth/google/callback page after Google redirects back
  const handleGoogleCallback = async (token: string) => {
    loading.value = true
    console.log('the Token',token)
    try {
      // 1. Store the token
      authStore.setToken(token)

      // 2. Fetch the full user profile using /auth/me
      await fetchUser()

      // 3. Merge guest cart → server cart
      const cartStore = useCartStore()
      await cartStore.onLogin()

      return navigateTo('/')
    } catch (err: any) {
      authStore.clearAuth()
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── Logout ─────────────────────────────────────────────────
  const logout = async () => {
    loading.value = true
    try {
      await api('/auth/logout', { method: 'POST' })
    } catch {
      // Even if API fails, clear local state
    } finally {
      authStore.clearAuth()

      const cartStore = useCartStore()
      cartStore.onLogout()

      loading.value = false
      return navigateTo('/login')
    }
  }

  // ── Fetch current user (for page refresh / SSR hydration) ──
  const fetchUser = async () => {
    if (!authStore.isLoggedIn) return null

    try {
      const data = await api('/auth/me')
      authStore.setUser(data.user ?? data.data?.user ?? data)
      return authStore.user
    } catch {
      authStore.clearAuth()
      return null
    }
  }

  return {
    user: computed(() => authStore.user),
    isLoggedIn: computed(() => authStore.isLoggedIn),
    loading,

    login,
    register,
    logout,
    fetchUser,
    loginWithGoogle,         // ← NEW
    handleGoogleCallback,    // ← NEW
  }
}