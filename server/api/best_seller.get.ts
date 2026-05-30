import { useServerApi } from "../utils/api"
import { EXTERNAL_API_ROUTES } from "../../shared/utils/routes"

export default defineEventHandler(async (event) => {
  const tenantId = event.context.tenantId as string
  const api = useServerApi(event)
  const response = await api(EXTERNAL_API_ROUTES.homepage.bestSeller(tenantId));

    return response;

})