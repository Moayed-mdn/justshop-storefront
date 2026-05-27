
import { EXTERNAL_API_ROUTES } from "../../shared/utils/routes"

// server/api/hero.get.ts
export default defineEventHandler(async (event) => {
  const api = useServerApi(event)
  return await api(EXTERNAL_API_ROUTES.homepage.hero)
  
})