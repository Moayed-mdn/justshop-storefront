import type { FetchOptions } from 'ofetch'
import type { ApiError } from '~~/types/api'

  export const useApi = async <T>(url: string, options?: FetchOptions) => {
    // $fetch is a powerful tool from Nuxt/ofetch that can be configured globally.
    // For example, a `baseURL` can be set in your `nuxt.config.ts` file.
    // This makes calling API endpoints simpler as you only need to provide the path.
      try {
        const api = $fetch.create({
          onRequest(ctx: any) {
            const requestOptions = ctx.options as FetchOptions
            const authStore = useAuthStore()
            const token = authStore.token
            const requestHeaders = useRequestHeaders(['cookie'])
            const locale = useCookie('i18n_redirected')

            const defaultHeaders: Record<string, string> = {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Accept-Language': locale.value || 'en',
              ...requestHeaders,
            }

            const body = requestOptions.body
            const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
            if (isFormData) {
              // Let the browser set the correct multipart boundary.
              delete defaultHeaders['Content-Type']
            }

            if (token) {
              defaultHeaders.Authorization = `Bearer ${token}`
            }

            requestOptions.headers = {
              ...defaultHeaders,
              ...(requestOptions.headers as Record<string, string> | undefined),
            }
          },
          onResponse(ctx: any) {
            const { options, response } = ctx
            if (process.client && options.successMessage) {
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
            
            if (response.status === 500) return
            
            if (process.client) {
              const { showErrorToast } = useAppToast()

              if (options.showError !== false) {
                const payload = response?._data?.data as ApiError
                const message = payload?.message || response?._data?.message || 'Something went wrong'
                showErrorToast(message)
              }

              if (response.status === 401) {
                const authStore = useAuthStore()
                authStore.clearAuth()
              }
            }
          },
        } as any)

        const data = await api<T>(url, options as any)
    
        return { data, error: null }
  } catch (e) {
    const error = e as Error & { data: ApiError }
    
    return { data: null, error }
  }
}