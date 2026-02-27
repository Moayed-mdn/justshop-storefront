import { $api } from "~/utils/api"

export default defineEventHandler(async (event) => {
  
    const response = await $api(event,'homepage/best-seller');

    return response;

})
