import { useServerApi } from "../utils/api"
import { transformResponseUrls } from "../utils/transformImageUrls"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const tenantId = event.context.tenantId as string
  const api = useServerApi(event)
  
  const response = await api(EXTERNAL_API_ROUTES.cart.show(tenantId))
  
  // Transform all image URLs from backend domain to frontend domain
  return transformResponseUrls(event, response)
})
