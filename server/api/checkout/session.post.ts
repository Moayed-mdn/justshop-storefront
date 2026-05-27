import { useServerApi } from "../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const api = useServerApi(event)
  
  return await api(EXTERNAL_API_ROUTES.checkout.session, {
    method: 'POST',
    body
  })
})
