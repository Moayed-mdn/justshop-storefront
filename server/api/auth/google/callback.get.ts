// server/api/auth/google/callback.get.ts
import { $serverApi } from '~/utils/serverApi'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token = query.token as string
  
  // Forward token validation to backend if needed
  // Or handle token exchange here
  return { token }
})