import { EXTERNAL_API_ROUTES } from '~~/shared/utils/routes'
import { useRuntimeServerApi } from '../../../../utils/api'
import { transformResponseUrls } from '../../../../utils/transformImageUrls'

export default defineEventHandler(async (event) => {
  const pageId = String(getRouterParam(event, 'id') || '')
  const api = useRuntimeServerApi(event)

  const response = await api(EXTERNAL_API_ROUTES.storefront.runtime.page(pageId), {
    query: getQuery(event),
  })

  return transformResponseUrls(event, response)
})
