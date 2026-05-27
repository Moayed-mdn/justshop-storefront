import { useServerApi } from "../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const api = useServerApi(event)
  
  if (event.method === 'GET') {
    return await api(EXTERNAL_API_ROUTES.profile.show)
  }
  
  if (event.method === 'DELETE') {
    return await api(EXTERNAL_API_ROUTES.profile.destroy, {
      method: 'DELETE'
    })
  }
})
