import type { FetchOptions } from 'ofetch'
import type { ApiError } from '~~/types/api'

  export const useApi = async <T>(url: string, options?: FetchOptions) => {
    // $fetch is a powerful tool from Nuxt/ofetch that can be configured globally.
    // For example, a `baseURL` can be set in your `nuxt.config.ts` file.
    // This makes calling API endpoints simpler as you only need to provide the path.
      try {
        const api = $fetch.create({
          onRequest(ctx: any) {
            const requestOptions = ctx.options as any
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
          onResponseError(ctx: any) {
            const response = ctx.response as any
            const { showErrorToast } = useAppToast()
            const payload = response?._data?.data as ApiError
            const message = payload?.message ||'Something went wrong'
            showErrorToast(message)
          },
        } as any)

        const data = await api<T>(url, options)
    
        return { data, error: null }
  } catch (e) {
    const error = e as Error & { data: ApiError }
    
    return { data: null, error }
  }
}