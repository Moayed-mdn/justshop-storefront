import { proxySessionAuthRequest } from "../../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const tenantSlug = event.context.tenantSlug as string
  const itemId = getRouterParam(event, 'itemId')
  const body = await readBody(event)

  return await proxySessionAuthRequest(event, EXTERNAL_API_ROUTES.cart.updateItem(tenantSlug, itemId as string), {
    method: 'PATCH',
    body
  })
})
