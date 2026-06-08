import type {
  RuntimeNavigationResponse,
  RuntimePagePayloadResponse,
  RuntimePreviewValidationResponse,
  RuntimeThemeResponse,
} from '../contracts/types'
import type { RuntimeResolvedRoute, StorefrontRuntimeBundle } from './types'
import { useStorefrontApi } from '../../api/client'
import { API_ROUTES } from '../../../../shared/utils/routes'
import { useStorefrontContext } from '../../tenant/composables'

/**
 * Normalize a runtime API tenantId for use as the canonical tenant identifier.
 *
 * The runtime API returns tenantId in "store_{id}" format (e.g. "store_42").
 * The canonical tenant identifier expected by Store::find() and all downstream
 * X-Tenant-Id header generators is the bare numeric ID ("42") or numeric (42).
 *
 * Only strips the "store_" prefix when the value matches the exact pattern
 * /^store_\d+$/. All other values pass through unchanged.
 *
 * Accepts:
 *   "store_1"   -> "1"
 *   "store_42"  -> "42"
 *   1           -> 1
 *   "merchant-store" -> "merchant-store"
 *   "abc"       -> "abc"
 *   undefined   -> undefined
 *   null        -> undefined
 */
export function normalizeTenantId(value: string | number | null | undefined): string | number | undefined {
  if (value === null || value === undefined) {
    return undefined
  }
  if (typeof value === 'string' && /^store_\d+$/.test(value)) {
    return value.replace(/^store_/, '')
  }
  return value
}

// Plain error factory — no Nuxt composables, safe to call anywhere
const makeError = (statusCode: number, message: string, data?: any): Error => {
  const err = new Error(message) as any
  err.statusCode = statusCode
  err.data = data
  err.__storefront_error = true
  return err
}

export const useStorefrontPayload = () => {
  const context = useStorefrontContext()
  const storefrontApi = useStorefrontApi()
  const requestHost = import.meta.server
    ? useRequestHeaders(['host']).host || context.value.tenant?.domain || 'localhost'
    : null

  const fetchPayload = async (resolved: RuntimeResolvedRoute): Promise<StorefrontRuntimeBundle | null> => {
    if (resolved.status !== 'matched' || resolved.pageId === null || resolved.legacyPassthrough) {
      return null
    }

    if (context.value.preview && context.value.previewToken) {
      await validatePreview(resolved)
    }

    const [pageResponse, navigationResponse, themeResponse] = await Promise.all([
      storefrontApi<RuntimePagePayloadResponse>(
        API_ROUTES.storefront.runtime.page(resolved.pageId as string),
        {
          query: {
            path: resolved.path,
            ...(context.value.preview ? { preview: 1 } : {}),
          },
          showError: false,
        },
      ),
      storefrontApi<RuntimeNavigationResponse>(
        API_ROUTES.storefront.runtime.navigation,
        {
          query: { path: resolved.path },
          showError: false,
        },
      ),
      storefrontApi<RuntimeThemeResponse>(
        API_ROUTES.storefront.runtime.theme,
        {
          query: { path: resolved.path },
          showError: false,
        },
      ),
    ])

    if (pageResponse.error) {
      throw makeError(
        pageResponse.error.statusCode || 500,
        pageResponse.error.message,
        pageResponse.error,
      )
    }

    if (navigationResponse.error) {
      throw makeError(
        navigationResponse.error.statusCode || 500,
        navigationResponse.error.message,
        navigationResponse.error,
      )
    }

    if (themeResponse.error) {
      throw makeError(
        themeResponse.error.statusCode || 500,
        themeResponse.error.message,
        themeResponse.error,
      )
    }

    if (!pageResponse.data || !navigationResponse.data || !themeResponse.data) {
      throw makeError(500, 'The storefront runtime payload is incomplete.')
    }

    // #region debug-point B:payload-navigation-response
    fetch('http://127.0.0.1:7777/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: 'storefront-footer-nav', runId: 'pre-fix', hypothesisId: 'B', location: 'src/core/runtime/router/useStorefrontPayload.ts:117', msg: '[DEBUG] runtime payload fetched navigation response', data: { resolvedPath: resolved.path, hasNavigation: Boolean(navigationResponse.data?.data), headerCount: navigationResponse.data?.data?.header?.length ?? null, footerCount: navigationResponse.data?.data?.footer?.length ?? null, navigationKeys: Object.keys(navigationResponse.data?.data ?? {}) }, ts: Date.now() }) }).catch(() => {})
    // #endregion

    syncTenantContext(pageResponse.data, navigationResponse.data, themeResponse.data)

    return {
      page: pageResponse.data.data.page,
      navigation: navigationResponse.data.data,
      theme: themeResponse.data.data,
    } satisfies StorefrontRuntimeBundle
  }

  const validatePreview = async (resolved: RuntimeResolvedRoute): Promise<void> => {
    const previewToken = context.value.previewToken

    if (!previewToken || resolved.pageId === null) {
      throw makeError(403, 'Preview access requires a valid preview token.')
    }

    const { data, error } = await storefrontApi<RuntimePreviewValidationResponse>(
      API_ROUTES.storefront.runtime.previewValidate,
      {
        method: 'POST',
        body: {
          token: previewToken,
          pageId: resolved.pageId,
          path: resolved.path,
          locale: context.value.locale,
        },
        showError: false,
      },
    )

    if (error) {
      throw makeError(error.statusCode || 403, error.message, error)
    }

    if (!data?.data.valid || data.data.previewState !== 'authorized') {
      throw makeError(403, 'Preview access was denied.')
    }
  }

  const syncTenantContext = (
    pageResponse: RuntimePagePayloadResponse,
    navigationResponse: RuntimeNavigationResponse,
    themeResponse: RuntimeThemeResponse,
  ): void => {
    const host = import.meta.server
      ? requestHost || context.value.tenant?.domain || 'localhost'
      : window.location.host

    if (pageResponse.requestContext?.requestId) {
      context.value.requestId = pageResponse.requestContext.requestId
    }

    const storeName =
      themeResponse.data.branding?.storeName ||
      context.value.tenant?.name ||
      'Storefront'

    context.value.tenant = {
      id: normalizeTenantId(pageResponse.requestContext?.tenantId) || context.value.tenant?.id || 'default',
      name: storeName,
      slug: pageResponse.requestContext?.tenantKey || context.value.tenant?.slug || 'default',
      domain: host.split(':')[0] || 'localhost',
      status: 'active',
      settings: {
        ...(context.value.tenant?.settings || {}),
        theme: themeResponse.data.themeKey,
        direction: themeResponse.data.settings.direction,
      },
    }

    context.value.theme = themeResponse.data.themeKey
    context.value.navigation = navigationResponse.data
    context.value.themePayload = themeResponse.data

    // #region debug-point C:context-sync
    fetch('http://127.0.0.1:7777/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: 'storefront-footer-nav', runId: 'pre-fix', hypothesisId: 'C', location: 'src/core/runtime/router/useStorefrontPayload.ts:191', msg: '[DEBUG] storefront context navigation synced', data: { host, tenantId: context.value.tenant?.id ?? null, navigationHeaderCount: context.value.navigation?.header?.length ?? null, navigationFooterCount: context.value.navigation?.footer?.length ?? null }, ts: Date.now() }) }).catch(() => {})
    // #endregion
  }

  return { fetchPayload }
}
