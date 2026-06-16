import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { useTenant } from '../../src/core/tenant/composables'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const graphqlUrl = config.public.graphqlUrl as string

  if (import.meta.dev) {
    console.log('[Apollo Plugin] Initializing...')
    console.log('[Apollo Plugin] GraphQL URL:', graphqlUrl)
  }

  if (!graphqlUrl) {
    console.error('[Apollo Plugin] NUXT_PUBLIC_GRAPHQL_URL is not set!')
    throw new Error('GraphQL URL is required but not configured in environment variables')
  }

  const authStore = useAuthStore()
  const { tenantId } = useTenant()
  const locale = (nuxtApp as any).$i18n?.locale

  const httpLink = new HttpLink({
    uri: graphqlUrl,
  })

  const authLink = setContext(() => {
    const extraHeaders: Record<string, string> = {}

    if (tenantId.value) {
      extraHeaders['X-Tenant-Id'] = String(tenantId.value)
    }

    if (locale?.value) {
      extraHeaders['Accept-Language'] = locale.value
    }

    if (authStore.token) {
      extraHeaders['Authorization'] = `Bearer ${authStore.token}`
    }

    if (import.meta.dev && Object.keys(extraHeaders).length > 0) {
      console.log('[Apollo Plugin] Request headers:', extraHeaders)
    }

    return {
      headers: extraHeaders,
    }
  })

  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    ssrMode: import.meta.server,
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  })

  if (import.meta.dev) {
    console.log('[Apollo Plugin] Client created successfully')
    console.log('[Apollo Plugin] SSR mode:', import.meta.server)
  }

  return {
    provide: {
      apollo: apolloClient,
    },
  }
})
