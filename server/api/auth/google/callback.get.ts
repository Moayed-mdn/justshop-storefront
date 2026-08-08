import { EXTERNAL_API_ROUTES } from '~~/shared/utils/routes'
import {
  buildExternalApiUrl,
  getNormalizedRequestHost,
  normalizeProxySetCookie,
  requestWithForwardedHost,
} from '../../../utils/api'
import { STOREFRONT_RUNTIME_CONTRACT_VERSION } from '../../../../src/core/runtime/contracts/constants'

export default defineEventHandler(async (event) => {
  // #region debug-point G:nitro-proxy-start
  console.debug('[DEBUG G] Nitro proxy for Google callback started', {
    timestamp: new Date().toISOString(),
    url: getRequestURL(event).href,
    query: getQuery(event),
    hasTenantId: !!event.context.tenantId,
    tenantId: event.context.tenantId,
  })
  // #endregion

  const configuredTarget = buildExternalApiUrl(event, EXTERNAL_API_ROUTES.auth.googleCallback)
  const targetBase = configuredTarget
  const requestUrl = getRequestURL(event)
  const host = getNormalizedRequestHost(event)
  const rawLocale = String(getCookie(event, 'i18n_redirected') || getHeader(event, 'accept-language') || 'en')
  const locale = rawLocale.split('-')[0].split(',')[0].trim().toLowerCase()
  const tenantId = String(event.context.tenantId || '')
  
  // #region debug-point H:nitro-proxy-request-details
  console.debug('[DEBUG H] Nitro proxy request details', {
    timestamp: new Date().toISOString(),
    configuredTarget,
    targetBase,
    finalUrl: `${targetBase}${requestUrl.search}`,
    headers: {
      Host: host,
      'X-Tenant-Id': tenantId,
      'X-Storefront-Locale': locale,
      'X-Storefront-Version': STOREFRONT_RUNTIME_CONTRACT_VERSION,
    },
  })
  // #endregion
  
  // Get all cookies from the incoming request
  const cookieHeader = getHeader(event, 'cookie') || ''
  console.log('[GOOGLE CALLBACK DEBUG] Incoming cookie header:', cookieHeader)
  
  // Bootstrap CSRF cookie if we don't have the required session cookies
  const hasXsrfToken = cookieHeader.includes('XSRF-TOKEN')
  const hasEcommerceSession = cookieHeader.includes('ecommerce_session')
  console.log('[GOOGLE CALLBACK DEBUG] Has XSRF-TOKEN:', hasXsrfToken, 'Has ecommerce_session:', hasEcommerceSession)
  
  if (!hasXsrfToken || !hasEcommerceSession) {
    console.log('[GOOGLE CALLBACK DEBUG] Bootstrapping CSRF cookie before Google callback')
    const apiBase = useRuntimeConfig().public.apiBase
    const buildApiRoot = (apiBase: string) => apiBase.replace(/\/api\/?(v1|users)?\/?$/, '')
    const apiRoot = buildApiRoot(apiBase)
    const csrfUrl = `${apiRoot}/sanctum/csrf-cookie`
    
    try {
      const csrfResponse = await requestWithForwardedHost(csrfUrl, {
        method: 'GET',
        headers: new Headers({
          Accept: 'application/json',
          Host: host,
          'X-Tenant-Id': tenantId,
          'X-Storefront-Locale': locale,
          'X-Storefront-Version': STOREFRONT_RUNTIME_CONTRACT_VERSION,
        }),
      })
      console.log('[GOOGLE CALLBACK DEBUG] CSRF bootstrap successful, status:', csrfResponse.statusCode)
      // Forward the new cookies from the CSRF request
      for (const setCookieHeader of csrfResponse.setCookie) {
        appendResponseHeader(event, 'set-cookie', normalizeProxySetCookie(setCookieHeader))
      }
      // Update cookie header with new cookies
      const newCookies = csrfResponse.setCookie.map(c => c.split(';')[0]).join('; ')
      const updatedCookieHeader = cookieHeader ? `${cookieHeader}; ${newCookies}` : newCookies
      console.log('[GOOGLE CALLBACK DEBUG] Updated cookie header:', updatedCookieHeader)
    } catch (csrfErr) {
      console.error('[GOOGLE CALLBACK DEBUG] CSRF bootstrap failed:', csrfErr)
    }
  }
  
  const finalCookieHeader = getHeader(event, 'cookie') || cookieHeader
  const response = await requestWithForwardedHost(`${targetBase}${requestUrl.search}`, {
    method: 'GET',
    headers: new Headers({
      Accept: 'application/json',
      Host: host,
      'X-Tenant-Id': tenantId,
      'X-Storefront-Locale': locale,
      'X-Storefront-Version': STOREFRONT_RUNTIME_CONTRACT_VERSION,
      Cookie: finalCookieHeader,
    }),
  })

  for (const setCookieHeader of response.setCookie) {
    appendResponseHeader(event, 'set-cookie', normalizeProxySetCookie(setCookieHeader))
  }

  const redirectLocation = response.location
  if (redirectLocation) {
    const redirectUrl = new URL(redirectLocation, requestUrl.origin)
    if (redirectUrl.pathname.startsWith('/auth/google/callback')) {
      redirectUrl.protocol = requestUrl.protocol
      redirectUrl.host = requestUrl.host
      redirectUrl.pathname = `/${locale}${redirectUrl.pathname}`
    }

    return sendRedirect(event, redirectUrl.toString(), response.statusCode)
  }

  const contentType = response.contentType || ''
  if (contentType.includes('application/json')) {
    return response.data
  }

  return typeof response.data === 'string' ? response.data : ''
})