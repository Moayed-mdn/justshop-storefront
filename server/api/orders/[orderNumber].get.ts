import { useServerApi } from "../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const tenantSlug = event.context.tenantSlug as string
  const orderNumber = getRouterParam(event, 'orderNumber')
  const api = useServerApi(event)
  
  return await api(EXTERNAL_API_ROUTES.orders.show(tenantSlug, orderNumber as string))
})
