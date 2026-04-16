// server/api/auth/login.post.ts
import { useServerApi } from '../../utils/api'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const api = useServerApi(event)
  const response = await api('/auth/login', {
    method: 'POST',
    body,
  })
  
  return response
})