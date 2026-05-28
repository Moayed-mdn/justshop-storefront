import type { FetchOptions } from 'ofetch'
import { useStorefrontApi } from '~/../src/core/api/client'

export const useApi = async <T>(url: string, options?: FetchOptions & { successMessage?: string | boolean, showError?: boolean }) => {
  return useStorefrontApi<T>(url, options)
}