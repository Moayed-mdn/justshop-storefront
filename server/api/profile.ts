import { useServerApi } from "../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const api = useServerApi(event)

  if (event.method === 'GET') {
    return await api(EXTERNAL_API_ROUTES.profile.show)
  }

  if (event.method === 'DELETE') {
    const body = await readBody(event).catch(() => undefined)
    return await api(EXTERNAL_API_ROUTES.profile.destroy, {
      method: 'DELETE',
      body: body ?? {},
    })
  }
})
