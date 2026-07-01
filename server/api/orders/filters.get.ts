import { useServerApi } from "../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const tenantSlug = event.context.tenantSlug as string
  const api = useServerApi(event)
  return await api(EXTERNAL_API_ROUTES.orders.filters(tenantSlug))
})
