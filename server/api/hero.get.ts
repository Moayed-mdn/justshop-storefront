import { $serverApi } from "~/utils/serverApi";

export default defineEventHandler(async (event) => {

  const config = useRuntimeConfig()
  // const lang = getCookie(event, 'i18n_redirected')

  const response = await $serverApi(event, 'homepage/hero');
  
  return response;
})