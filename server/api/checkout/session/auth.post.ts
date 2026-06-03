import { proxySessionAuthRequest } from "../../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const tenantId = event.context.tenantId as string
  const body = await readBody(event)
  
  return await proxySessionAuthRequest(event, EXTERNAL_API_ROUTES.checkout.sessionAuth(tenantId), {
    method: 'POST',
    body
  })
})
