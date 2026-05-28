import { useStorefrontContext } from '../tenant/composables'

export const getStorefrontHeaders = () => {
  const context = useStorefrontContext()
  const headers: Record<string, string> = {
    'X-Tenant-Id': String(context.value.tenant?.id || ''),
    'X-Storefront-Locale': context.value.locale,
    'X-Storefront-Version': '1.0.0', // TODO: pull from config
  }

  if (context.value.preview) {
    headers['X-Preview-Token'] = 'true' // TODO: handle real tokens
  }

  return headers
}
