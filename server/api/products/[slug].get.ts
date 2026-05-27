import { useServerApi } from "../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const api = useServerApi(event)
  
  return await api(EXTERNAL_API_ROUTES.products.show(slug as string))
})
