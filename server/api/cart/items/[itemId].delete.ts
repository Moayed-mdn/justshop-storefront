import { proxySessionAuthRequest } from "../../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const tenantSlug = event.context.tenantSlug as string
  const itemId = getRouterParam(event, 'itemId')

  return await proxySessionAuthRequest(event, EXTERNAL_API_ROUTES.cart.removeItem(tenantSlug, itemId as string), {
    method: 'DELETE'
  })
})
