import { useServerApi } from "~~/server/utils/api"
import { transformResponseUrls } from "~~/server/utils/transformImageUrls"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const storeSlug = event.context.params?.store as string
  const api = useServerApi(event)
  
  const response = await api(EXTERNAL_API_ROUTES.addresses.index(storeSlug))
  
  return transformResponseUrls(event, response)
})
