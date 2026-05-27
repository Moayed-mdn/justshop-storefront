import { useServerApi } from "../../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'sessionId')
  const api = useServerApi(event)
  
  return await api(EXTERNAL_API_ROUTES.checkout.status(sessionId as string))
})
