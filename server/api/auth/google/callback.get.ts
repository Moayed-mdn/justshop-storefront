import { EXTERNAL_API_ROUTES } from '~~/shared/utils/routes'
import { buildExternalApiUrl } from '../../../utils/api'
import { STOREFRONT_RUNTIME_CONTRACT_VERSION } from '../../../../src/core/runtime/contracts/constants'

const collectSetCookieHeaders = (response: Response) => {
  const responseHeaders = response.headers as Headers & { getSetCookie?: () => string[] }

  if (typeof responseHeaders.getSetCookie === 'function') {
    return responseHeaders.getSetCookie()
  }

  const singleHeader = response.headers.get('set-cookie')
  return singleHeader ? [singleHeader] : []
}

const normalizeProxySetCookie = (setCookieHeader: string) => setCookieHeader
  .split(/;\s*/)
  .filter(part => !/^domain=/i.test(part))
  .join('; ')

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
  const targetBase = configuredTarget.includes('/v1/users/')
    ? configuredTarget.replace('/v1/users/', '/v1/merchant/')
    : configuredTarget.replace('/v1/', '/v1/merchant/')
  const requestUrl = getRequestURL(event)
  const host = requestUrl.host.split(':')[0] || 'localhost'
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
  
  const response = await fetch(`${targetBase}${requestUrl.search}`, {
    method: 'GET',
    redirect: 'manual',
    headers: {
      Accept: 'application/json',
      Host: host,
      'X-Tenant-Id': tenantId,
      'X-Storefront-Locale': locale,
      'X-Storefront-Version': STOREFRONT_RUNTIME_CONTRACT_VERSION,
    },
  })

  for (const setCookieHeader of collectSetCookieHeaders(response)) {
    appendResponseHeader(event, 'set-cookie', normalizeProxySetCookie(setCookieHeader))
  }

  const redirectLocation = response.headers.get('location')
  if (redirectLocation) {
    const redirectUrl = new URL(redirectLocation, requestUrl.origin)
    if (redirectUrl.pathname.startsWith('/auth/google/callback')) {
      redirectUrl.protocol = requestUrl.protocol
      redirectUrl.host = requestUrl.host
      redirectUrl.pathname = `/${locale}${redirectUrl.pathname}`
    }

    return sendRedirect(event, redirectUrl.toString(), response.status)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return await response.json()
  }

  return await response.text()
})
