import { useServerApi } from "../../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const tenantId = event.context.tenantId as string
  const itemId = getRouterParam(event, 'itemId')
  const body = await readBody(event)
  const api = useServerApi(event)
  
  return await api(EXTERNAL_API_ROUTES.cart.updateItem(tenantId, itemId as string), {
    method: 'PATCH',
    body
  })
})
