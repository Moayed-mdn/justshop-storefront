import type { FetchOptions, FetchContext, FetchResponse } from 'ofetch'
import { getStorefrontHeaders } from './headers'
import { normalizeError } from './errors'

export const useStorefrontApi = async <T>(url: string, options?: FetchOptions & { showError?: boolean }) => {
  const headers = getStorefrontHeaders()
  
  const api = $fetch.create({
    onRequest({ options }) {
      const authStore = useAuthStore()
      // Inject storefront headers
      options.headers = {
        ...headers,
        ...options.headers,
      }
      
      // Inject auth token if available
      if (authStore.token) {
        if (options.headers instanceof Headers) {
          options.headers.set('Authorization', `Bearer ${authStore.token}`)
        } else {
          (options.headers as Record<string, string>)['Authorization'] = `Bearer ${authStore.token}`
        }
      }
    },
    onResponseError(ctx: FetchContext & { response: FetchResponse<any> }) {
      // In Phase 1, we still want to show toasts if needed
      if (import.meta.client && ctx.options.showError !== false) {
        const { showErrorToast } = useAppToast()
        const error = normalizeError(ctx.response)
        showErrorToast(error.message)
      }
    }
  })

  try {
    const data = await api<T>(url, options as FetchOptions)
    return { data, error: null }
  } catch (e) {
    return { data: null, error: normalizeError(e) }
  }
}
