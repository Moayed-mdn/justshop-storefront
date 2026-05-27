//plugins/api.ts
export default defineNuxtPlugin((nuxtApp) => {
    const api = $fetch.create({
      credentials: 'include',
  
      async onRequest(ctx: any) {
        const { options } = ctx
        options.headers.set('Accept', 'application/json')
  
        // 🌍 Locale (works both sides)
        let locale: string | undefined
  
        if (import.meta.server) {
          const event = nuxtApp.ssrContext?.event
          locale = getCookie(event!, 'i18n_redirected')
        } else {
          locale = useNuxtApp().$i18n?.locale.value
        }
  
        if (locale) {
          options.headers.set('Accept-Language', locale)
        }
  
        // 🔐 Token handling
        let token: string | null = null
  
        if (import.meta.server) {
          const event = nuxtApp.ssrContext?.event
          try {
            const authCookie = getCookie(event!, 'auth')
            if (authCookie) {
              const parsed = JSON.parse(authCookie)
              token = parsed?.token ?? null
            }
          } catch {}
        } else {
          const authStore = useAuthStore()
          token = authStore.token
        }
  
        if (token) {
          options.headers.set('Authorization', `Bearer ${token}`)
        }
      },
  
      // ✅ Client-only UI handling
      onResponse(ctx: any) {
        const { options, response } = ctx
        if (import.meta.client && options.successMessage) {
          const { showSuccessToast } = useAppToast()
  
          const message =
            typeof options.successMessage === 'string'
              ? options.successMessage
              : response._data?.message ?? 'Success'
  
          showSuccessToast(message)
        }
      },
  
      onResponseError(ctx: any) {
        const { response, options } = ctx
        if (import.meta.client) {
          const { showErrorToast } = useAppToast()
  
          if (options.showError !== false) {
            const message =
              response._data?.message ?? 'An unexpected error occurred'
            showErrorToast(message)
          }
  
          if (response.status === 401) {
            const authStore = useAuthStore()
            authStore.clearAuth()
          }
        }
      },
    } as any)
  
    return {
      provide: {
        api,
      },
    }
  })
