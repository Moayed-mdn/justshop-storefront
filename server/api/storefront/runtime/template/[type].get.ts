import { EXTERNAL_API_ROUTES } from '~~/shared/utils/routes'
import { useRuntimeServerApi } from '~~/server/utils/api'
import { transformResponseUrls } from '~~/server/utils/transformImageUrls'

export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  if (!type) {
    throw createError({ statusCode: 400, statusMessage: 'Missing template type parameter' })
  }

  const api = useRuntimeServerApi(event)

  const response = await api(EXTERNAL_API_ROUTES.storefront.runtime.systemTemplate(type), {
    query: getQuery(event),
  })

  return transformResponseUrls(event, response)
})
