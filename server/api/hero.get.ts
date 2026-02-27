import { $api } from '../../app/utils/api';

export default defineEventHandler(async (event) => {

  const response =  await $api(event, 'homepage/hero')
  
  return response;
})
