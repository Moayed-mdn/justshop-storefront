import type { RuntimeRouteResolutionResponse } from '../contracts/types'
import type { RuntimeResolvedRoute } from './types'
import { useStorefrontApi } from '../../api/client'
import { API_ROUTES } from '../../../../shared/utils/routes'
import { useStorefrontContext } from '../../tenant/composables'

export const useRouteResolver = () => {
  const context = useStorefrontContext()
  const storefrontApi = useStorefrontApi()

  const resolveRoute = async (path: string): Promise<RuntimeResolvedRoute> => {
    const cleanPath = path.replace(/\/$/, '') || '/'
    context.value.route = cleanPath

    const { data, error } = await storefrontApi<RuntimeRouteResolutionResponse>(
      API_ROUTES.storefront.runtime.resolve,
      {
        query: {
          path: cleanPath,
          locale: context.value.locale,
        },
        showError: false,
      },
    )

    if (error) {
      const err = new Error(error.message) as any
      err.statusCode = error.statusCode || 500
      err.data = error
      err.__storefront_error = true
      throw err
    }

    if (!data) {
      const err = new Error('The storefront runtime route could not be resolved.') as any
      err.statusCode = 500
      err.__storefront_error = true
      throw err
    }

    if (data.requestContext?.requestId) {
      context.value.requestId = data.requestContext.requestId
    }

    return data.data
  }

  return { resolveRoute }
}