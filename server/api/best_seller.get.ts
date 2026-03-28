import { $serverApi } from "~/utils/serverApi"

export default defineEventHandler(async (event) => {
  
    const response = await $serverApi(event,'homepage/best-seller');

    return response;

})
