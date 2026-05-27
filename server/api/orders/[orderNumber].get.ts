import { useServerApi } from "../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const orderNumber = getRouterParam(event, 'orderNumber')
  const api = useServerApi(event)
  
  return await api(EXTERNAL_API_ROUTES.orders.show(orderNumber as string))
})
