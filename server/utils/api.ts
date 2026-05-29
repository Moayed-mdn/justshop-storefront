// server/utils/api.ts
import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'
import type { H3Event } from 'h3'
import { STOREFRONT_RUNTIME_CONTRACT_VERSION } from '../../src/core/runtime/contracts/constants'

export const useServerApi = (event: H3Event) => {
  const config = useRuntimeConfig(event)

  // Locale from cookie
  const locale = getCookie(event, 'i18n_redirected') || getHeader(event, 'accept-language') || 'en'

  // Tenant from event context
  const tenantId = event.context.tenantId || ''

  // Token from auth cookie (try new namespaced key then legacy key)
  let token: string | null = null
  try {
    const authCookie = getCookie(event, 'js_auth') || getCookie(event, 'auth')
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

export const useRuntimeServerApi = (event: H3Event) => {
  const config = useRuntimeConfig(event)
  const localeHeader = getHeader(event, 'x-storefront-locale')
  const localeCookie = getCookie(event, 'i18n_redirected')
  const locale = String(localeHeader || localeCookie || 'en')
  const requestId = String(getHeader(event, 'x-request-id') || crypto.randomUUID())
  const previewToken = getHeader(event, 'x-preview-token')
  const hostHeader = String(getHeader(event, 'host') || getHeader(event, 'x-forwarded-host') || 'localhost')
  const normalizedHost = hostHeader.split(',')[0]?.trim().split(':')[0] || 'localhost'
  const runtimeApiBase = String(config.apiBase || '')
    .replace(/\/+$/, '')
    .replace(/\/users$/, '')

  const appendQuery = (url: URL, query?: Record<string, unknown>) => {
    if (!query) {
      return
    }

    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) {
        continue
      }

      if (Array.isArray(value)) {
        for (const entry of value) {
          if (entry !== undefined && entry !== null) {
            url.searchParams.append(key, String(entry))
          }
        }
        continue
      }

      url.searchParams.append(key, String(value))
    }
  }

  const parsePayload = (raw: Buffer, contentType: string | undefined) => {
    const text = raw.toString('utf-8')

    if (!text.length) {
      return null
    }

    if (contentType?.includes('application/json')) {
      try {
        return JSON.parse(text)
      } catch {
        return text
      }
    }

    return text
  }

  // Use a low-level Node request so the tenant Host header reaches Laravel unchanged.
  return async (path: string, options?: {
    method?: string
    query?: Record<string, unknown>
    body?: unknown
    headers?: HeadersInit
  }) => {
    const url = new URL(`${runtimeApiBase}/${path.replace(/^\/+/, '')}`)
    const method = String(options?.method || 'GET').toUpperCase()
    appendQuery(url, options?.query)

    const headers = new Headers(options?.headers)
    headers.set('Accept', 'application/json')
    headers.set('Host', normalizedHost)
    headers.set('X-Storefront-Locale', locale)
    headers.set('X-Storefront-Version', STOREFRONT_RUNTIME_CONTRACT_VERSION)
    headers.set('X-Request-Id', requestId)

    if (previewToken) {
      headers.set('X-Preview-Token', previewToken)
    }

    let payload: string | Buffer | undefined

    if (options?.body !== undefined && method !== 'GET' && method !== 'HEAD') {
      if (typeof options.body === 'string' || Buffer.isBuffer(options.body)) {
        payload = options.body
      } else if (options.body instanceof Uint8Array) {
        payload = Buffer.from(options.body)
      } else {
        payload = JSON.stringify(options.body)
        if (!headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json')
        }
      }

      headers.set('Content-Length', String(Buffer.byteLength(payload)))
    }

    const request = url.protocol === 'https:' ? httpsRequest : httpRequest

    const response = await new Promise<{
      statusCode: number
      contentType?: string
      body: Buffer
    }>((resolve, reject) => {
      const req = request(url, {
        method,
        headers: Object.fromEntries(headers.entries()),
      }, (res) => {
        const chunks: Buffer[] = []

        res.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)))
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 500,
            contentType: typeof res.headers['content-type'] === 'string' ? res.headers['content-type'] : undefined,
            body: Buffer.concat(chunks),
          })
        })
      })

      req.on('error', reject)

      if (payload) {
        req.write(payload)
      }

      req.end()
    })

    const parsedBody = parsePayload(response.body, response.contentType)

    if (response.statusCode >= 400) {
      const message = typeof parsedBody === 'object' && parsedBody !== null
        ? String((parsedBody as { error?: { message?: string }, message?: string }).error?.message
            || (parsedBody as { message?: string }).message
            || `Runtime request failed with status ${response.statusCode}`)
        : String(parsedBody || `Runtime request failed with status ${response.statusCode}`)

      throw createError({
        statusCode: response.statusCode,
        statusMessage: message,
        data: parsedBody,
      })
    }

    return parsedBody
  }
}

export const buildExternalApiUrl = (event: H3Event, path: string) => {
  const config = useRuntimeConfig(event)
  const base = String(config.apiBase || '').replace(/\/+$/, '')
  const normalizedPath = path.replace(/^\/+/, '')

  return `${base}/${normalizedPath}`
}
