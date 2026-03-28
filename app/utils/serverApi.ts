// utils/$serverApi.ts
export const $serverApi = async (
  event: any,
  endpoint: string,
  options: Record<string, any> = {}
) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // dev delay

  const config = useRuntimeConfig()
  const base = config.public.apiBase || 'https://e-commerce-backend-production-4b78.up.railway.app/api/v1/users/products?page=1'

  // ── Locale ──
  let lang: string | undefined
  lang = getCookie(event, 'i18n_redirected')

  // ── Token from persisted Pinia cookie ──
  // pinia-plugin-persistedstate stores as JSON: {"token":"xxx"}
  let token: string | null = null
  try {
    const authCookie = getCookie(event, 'auth')
    if (authCookie) {
      const parsed = typeof authCookie === 'string' ? JSON.parse(authCookie) : authCookie
      token = parsed?.token ?? null
    }
  } catch {
    token = null
  }

  const fetchInstance = $fetch.create({
    baseURL: base,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(lang ? { locale: lang } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  return fetchInstance(endpoint, options)
}