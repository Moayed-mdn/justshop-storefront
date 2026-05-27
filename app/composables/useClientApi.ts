// composables/useClientApi.ts
export const useClientApi = () => {
  const authStore = useAuthStore()
  const { showErrorToast, showSuccessToast } = useAppToast()

  const nuxtApp = useNuxtApp()

  // Access via $i18n which is provided by the @nuxtjs/i18n module
  const i18n = nuxtApp.$i18n
  const locale = i18n.locale // This is a Ref, so use locale.value

  return $fetch.create({
    onRequest(ctx: any) {
      const { options } = ctx
      if (authStore.token) {
        options.headers.set('Authorization', `Bearer ${authStore.token}`)
      }
      options.headers.set('Accept', 'application/json')
      options.headers.set('Accept-Language', locale.value)   // ← ADDED
    },

    onResponse(ctx: any) {
      const { options, response } = ctx
      if (options.successMessage) {
        const message =
          typeof options.successMessage === 'string'
            ? options.successMessage
            : response._data?.message ?? 'Success'
        showSuccessToast(message)
      }
    },
    onResponseError(ctx: any) {
      const { response, options } = ctx
      if (options.showError !== false) {
        const message = response._data?.message ?? 'An unexpected error occurred'
        showErrorToast(message)
      }

      if (response.status === 401) {
        authStore.clearAuth()
      }
    },
  } as any)
}
