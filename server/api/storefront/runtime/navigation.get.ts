import { EXTERNAL_API_ROUTES } from '~~/shared/utils/routes'
import { useRuntimeServerApi } from '../../../utils/api'

export default defineEventHandler(async (event) => {
  const api = useRuntimeServerApi(event)

  const response = await api(EXTERNAL_API_ROUTES.storefront.runtime.navigation, {
    query: getQuery(event),
  })

  // #region debug-point A:navigation-proxy
  fetch('http://127.0.0.1:7777/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: 'storefront-footer-nav', runId: 'pre-fix', hypothesisId: 'A', location: 'server/api/storefront/runtime/navigation.get.ts', msg: '[DEBUG] proxied runtime navigation response', data: { query: getQuery(event), hasData: Boolean(response?.data), headerCount: Array.isArray((response as any)?.data?.header) ? (response as any).data.header.length : null, footerCount: Array.isArray((response as any)?.data?.footer) ? (response as any).data.footer.length : null, keys: Object.keys((response as any)?.data ?? {}) }, ts: Date.now() }) }).catch(() => {})
  // #endregion

  return response
})
