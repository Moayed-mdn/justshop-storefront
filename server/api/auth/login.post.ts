// server/api/auth/login.post.ts
import { proxySessionAuthRequest } from '../../utils/api'
import { EXTERNAL_API_ROUTES } from '../../../shared/utils/routes'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const response = await proxySessionAuthRequest(event, EXTERNAL_API_ROUTES.auth.login, {
    method: 'POST',
    body,
  })

  return response
})
