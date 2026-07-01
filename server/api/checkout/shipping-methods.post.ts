import { proxySessionAuthRequest } from "../../utils/api"
import { EXTERNAL_API_ROUTES } from "~~/shared/utils/routes"

export default defineEventHandler(async (event) => {
  const tenantSlug = event.context.tenantSlug as string
  const body = await readBody(event)
  
  return await proxySessionAuthRequest(
    event,
    EXTERNAL_API_ROUTES.checkout.shippingMethods(tenantSlug),
    {
      method: 'POST',
      body,
    }
  )
})
