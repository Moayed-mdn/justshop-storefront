import { useServerApi } from "../../../utils/api"
import { transformResponseUrls } from "../../../utils/transformImageUrls"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const tenantSlug = event.context.tenantSlug as string
  const slug = getRouterParam(event, 'slug')
  const query = getQuery(event)
  const api = useServerApi(event)
  
  const response = await api(EXTERNAL_API_ROUTES.products.category(tenantSlug, slug as string), {
    query
  })
  
  // Transform all image URLs from backend domain to frontend domain
  return transformResponseUrls(event, response)
})
