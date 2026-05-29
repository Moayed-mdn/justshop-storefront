import { EXTERNAL_API_ROUTES } from '~~/shared/utils/routes'
import { useRuntimeServerApi } from '../../../../utils/api'

export default defineEventHandler(async (event) => {
  const pageId = String(getRouterParam(event, 'id') || '')
  const api = useRuntimeServerApi(event)

  return await api(EXTERNAL_API_ROUTES.storefront.runtime.page(pageId), {
    query: getQuery(event),
  })
})
