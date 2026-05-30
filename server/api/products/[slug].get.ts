import { useServerApi } from "../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const tenantId = event.context.tenantId as string
  const slug = getRouterParam(event, 'slug')
  const api = useServerApi(event)
  
  return await api(EXTERNAL_API_ROUTES.products.show(tenantId, slug as string))
})
