import { useServerApi } from "../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const api = useServerApi(event)
  const headers = getHeaders(event)
  const body = await readRawBody(event)

  return await api(EXTERNAL_API_ROUTES.profile.updateAvatar, {
    method: 'POST',
    headers: {
      'content-type': headers['content-type'] as string,
    },
    body
  })
})
