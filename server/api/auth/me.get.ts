// server/api/auth/me.get.ts
import { useServerApi } from '../../utils/api'

export default defineEventHandler(async (event) => {
  const api = useServerApi(event)
  const response = await api('/auth/me')
  return response
})