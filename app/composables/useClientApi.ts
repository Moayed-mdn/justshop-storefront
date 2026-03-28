// composables/useClientApi.ts
export const useClientApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  // const { locale } = useI18n()                      // ← ADDED

  const nuxtApp = useNuxtApp()

  // Access via $i18n which is provided by the @nuxtjs/i18n module
  const i18n = nuxtApp.$i18n
  const locale = i18n.locale // This is a Ref, so use locale.value

  return $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }) {
      if (authStore.token) {
        options.headers.set('Authorization', `Bearer ${authStore.token}`)
      }
      options.headers.set('Accept', 'application/json')
      options.headers.set('Accept-Language', locale.value)   // ← ADDED
    },

    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.clearAuth()
      }
    },
  })
}