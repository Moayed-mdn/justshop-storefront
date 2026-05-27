import { useServerApi } from "../../../../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const hash = getRouterParam(event, 'hash')
  const query = getQuery(event)
  const api = useServerApi(event)

  return await api(EXTERNAL_API_ROUTES.auth.emailVerify(id as string, hash as string), {
    query,
  })
})
