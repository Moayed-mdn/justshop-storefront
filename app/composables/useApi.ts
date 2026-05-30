import type { FetchOptions } from 'ofetch'
import { useStorefrontApi } from '~/../src/core/api/client'

export const useApi = () => {
  const storefrontApi = useStorefrontApi()
  return async <T>(url: string, options?: FetchOptions & { successMessage?: string | boolean, showError?: boolean }) => {
    return storefrontApi<T>(url, options)
  }
}