// server/api/auth/register.post.ts
import { proxySessionAuthRequest } from '../../utils/api'
import { EXTERNAL_API_ROUTES } from '../../../shared/utils/routes'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const response = await proxySessionAuthRequest(event, EXTERNAL_API_ROUTES.auth.register, {
    method: 'POST',
    body,
  })

  return response
})
