// app/utils/api.js
export const $api = (event:any, endpoint:any, options = {}) => {
  // 1. Detect the language from the browser's request to Nuxt
  const headers = getHeaders(event);
  const lang = getCookie(event, 'locale') 

  const config = useRuntimeConfig();
  const base = config.public.apiBase || 'http://localhost:8000';
  
  console.log('this is ',lang )
  // 2. Create a configured fetch instance
  const fetchInstance = $fetch.create({
    baseURL: base + '/api/v1/users/',
    headers: {
      'locale': lang,
      'Accept': 'application/json',
      ...options.headers, 
    },
  });

  return fetchInstance(endpoint, options);
};
