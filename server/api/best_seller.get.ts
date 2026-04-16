import { useServerApi } from "../utils/api"

export default defineEventHandler(async (event) => {
  const api = useServerApi(event)
  const response = await api('homepage/best-seller');

    return response;

})