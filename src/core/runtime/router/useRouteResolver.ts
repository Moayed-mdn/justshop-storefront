import type { RuntimeRouteResolutionResponse } from '../contracts/types'
import type { RuntimeResolvedRoute } from './types'
import { useStorefrontApi } from '../../api/client'
import { API_ROUTES } from '../../../../shared/utils/routes'
import { useStorefrontContext } from '../../tenant/composables'

export const useRouteResolver = () => {
  const context = useStorefrontContext()

  const resolveRoute = async (path: string): Promise<RuntimeResolvedRoute> => {
    const cleanPath = path.replace(/\/$/, '') || '/'
    context.value.route = cleanPath

    const { data, error } = await useStorefrontApi<RuntimeRouteResolutionResponse>(
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
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.message,
        data: error,
      })
    }

    if (!data) {
      throw createError({
        statusCode: 500,
        statusMessage: 'The storefront runtime route could not be resolved.',
      })
    }

    if (data.requestContext.requestId) {
      context.value.requestId = data.requestContext.requestId
    }

    return data.data
  }

  return {
    resolveRoute
  }
}
