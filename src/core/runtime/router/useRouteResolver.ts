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

    // ✅ PERFORMANCE LOGGING
    console.log('[Resolver] Resolving route:', cleanPath, 'for locale:', context.value.locale)
    const resolveStartTime = Date.now()

    // Extract locale from path if it starts with a locale prefix
    let requestLocale = context.value.locale
    const pathParts = cleanPath.split('/').filter(Boolean)
    if (pathParts.length > 0 && ['en', 'ar'].includes(pathParts[0])) {
      requestLocale = pathParts[0] as 'en' | 'ar'
      console.log('[Resolver] Extracted locale from path:', requestLocale)
    }

    const apiStartTime = Date.now()
    const { data, error } = await storefrontApi<RuntimeRouteResolutionResponse>(
      API_ROUTES.storefront.runtime.resolve,
      {
        query: {
          path: cleanPath,
          locale: requestLocale,
        },
        showError: false,
      },
    )
    
    console.log('[Resolver] API call completed in:', Date.now() - apiStartTime, 'ms')

    if (error) {
      console.error('[Resolver] Error:', error)
      const err = new Error(error.message) as any
      err.statusCode = error.statusCode || 500
      err.data = error
      err.__storefront_error = true
      throw err
    }

    if (!data) {
      console.error('[Resolver] No data returned')
      const err = new Error('The storefront runtime route could not be resolved.') as any
      err.statusCode = 500
      err.__storefront_error = true
      throw err
    }

    if (data.requestContext?.requestId) {
      context.value.requestId = data.requestContext.requestId
    }

    console.log('[Resolver] Route resolved successfully in:', Date.now() - resolveStartTime, 'ms')
    console.log('[Resolver] Result:', data.data.status, 'pageId:', data.data.pageId)

    return data.data
  }

  return { resolveRoute }
}