import { EXTERNAL_API_ROUTES } from '~~/shared/utils/routes'
import { useRuntimeServerApi } from '~~/server/utils/api'

export default defineEventHandler(async (event) => {
  const api = useRuntimeServerApi(event)

  return await api(EXTERNAL_API_ROUTES.storefront.runtime.sectionGroups, {
    query: getQuery(event),
  })
})
