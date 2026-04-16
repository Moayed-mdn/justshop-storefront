// server/api/auth/logout.post.ts
import { useServerApi } from '../../utils/api'

export default defineEventHandler(async (event) => {
  const api = useServerApi(event)
  const response = await api('/auth/logout', {
    method: 'POST',
  })
  
  return response
})