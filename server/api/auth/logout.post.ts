// server/api/auth/logout.post.ts
import { proxySessionAuthRequest } from '../../utils/api'
import { EXTERNAL_API_ROUTES } from '../../../shared/utils/routes'

export default defineEventHandler(async (event) => {
  const response = await proxySessionAuthRequest(event, EXTERNAL_API_ROUTES.auth.logout, {
    method: 'POST',
  })

  return response
})
