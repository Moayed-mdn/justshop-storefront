// server/utils/api.ts
import type { H3Event } from 'h3'

export const useServerApi = (event: H3Event) => {
  const config = useRuntimeConfig(event)

  // Locale from cookie
  const locale = getCookie(event, 'i18n_redirected') || getHeader(event, 'accept-language') || 'en'

  // Tenant from event context
  const tenantId = event.context.tenantId || ''

  // Token from auth cookie
  let token: string | null = null
  try {
    const authCookie = getCookie(event, 'auth')
    if (authCookie) {
      const parsed = JSON.parse(authCookie)
      token = parsed?.token ?? null
    }
  } catch {}

  return $fetch.create({
    baseURL: config.apiBase, // private runtime config (server-only)

    onRequest({ options }) {
      options.headers.set('Accept', 'application/json')
      options.headers.set('X-Tenant-Id', String(tenantId))
      options.headers.set('X-Storefront-Locale', locale)
      options.headers.set('X-Storefront-Version', '1.0.0')

      if (locale) {
        options.headers.set('Accept-Language', locale)
      }

      if (token) {
        options.headers.set('Authorization', `Bearer ${token}`)
      }
    },
  })
}

export const buildExternalApiUrl = (event: H3Event, path: string) => {
  const config = useRuntimeConfig(event)
  const base = String(config.apiBase || '').replace(/\/+$/, '')
  const normalizedPath = path.replace(/^\/+/, '')

  return `${base}/${normalizedPath}`
}
