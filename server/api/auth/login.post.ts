// server/api/auth/login.post.ts
import { useServerApi } from '../../utils/api'
import { EXTERNAL_API_ROUTES } from '../../../shared/utils/routes'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const api = useServerApi(event)
  const response = await api(EXTERNAL_API_ROUTES.auth.login, {
    method: 'POST',
    body,
  })
  
  return response
})