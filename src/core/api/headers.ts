import { useStorefrontContext } from '../tenant/composables'
import { STOREFRONT_RUNTIME_CONTRACT_VERSION } from '../runtime/contracts/constants'

export const getStorefrontHeaders = () => {
  const context = useStorefrontContext()
  const headers: Record<string, string> = {
    'X-Tenant-Id': String(context.value.tenant?.id || ''),
    'X-Storefront-Locale': context.value.locale,
    'X-Storefront-Version': STOREFRONT_RUNTIME_CONTRACT_VERSION,
  }

  if (context.value.requestId) {
    headers['X-Request-Id'] = context.value.requestId
  }

  if (context.value.preview && context.value.previewToken) {
    headers['X-Preview-Token'] = context.value.previewToken
  }

  if (import.meta.server) {
    const requestHeaders = useRequestHeaders(['host', 'x-forwarded-host'])

    if (requestHeaders.host) {
      headers.host = requestHeaders.host
    }

    if (requestHeaders['x-forwarded-host']) {
      headers['x-forwarded-host'] = requestHeaders['x-forwarded-host']
    }
  }

  return headers
}
