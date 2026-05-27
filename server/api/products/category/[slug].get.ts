import { useServerApi } from "../../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const query = getQuery(event)
  const api = useServerApi(event)
  
  return await api(EXTERNAL_API_ROUTES.products.category(slug as string), {
    query
  })
})
