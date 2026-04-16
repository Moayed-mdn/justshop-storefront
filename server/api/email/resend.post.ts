import { useServerApi } from "../../utils/api"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const api = useServerApi(event)
  const response = await api('email/resend', {
    method: 'POST',
    body: { email: body.email },
  })

  return response
})