import type { FetchOptions, FetchContext, FetchResponse } from 'ofetch'
import { useStorefrontHeaders } from './headers'
import { normalizeError } from './errors'

export const useStorefrontApi = () => {
  const { getHeaders } = useStorefrontHeaders()
  const authStore = import.meta.client ? useAuthStore() : null

  const api = $fetch.create({
    onRequest({ options }) {
      // Inject storefront headers
      options.headers = {
        ...getHeaders(),
        ...options.headers,
      }
      
      // Inject auth token if available
      if (authStore?.token) {
        if (options.headers instanceof Headers) {
          options.headers.set('Authorization', `Bearer ${authStore.token}`)
        } else {
          (options.headers as Record<string, string>)['Authorization'] = `Bearer ${authStore.token}`
        }
      }
    },
    onResponseError(ctx: FetchContext & { response: FetchResponse<any> }) {
      if (ctx.options.showError !== false) {
        normalizeError(ctx.response)
      }
    },
  })

  return async <T>(url: string, options?: FetchOptions & { showError?: boolean }) => {
    try {
      const data = await api<T>(url, options as any)
      return { data, error: null }
    } catch (e) {
      return { data: null, error: normalizeError(e) }
    }
  }
}
