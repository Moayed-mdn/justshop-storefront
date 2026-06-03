import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { useTenant } from '../../src/core/tenant/composables'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const authStore = useAuthStore()
  const { tenantId } = useTenant()
  const locale = (nuxtApp as any).$i18n.locale

  const httpLink = new HttpLink({
    uri: config.public.graphqlUrl as string,
  })

  const authLink = setContext(() => {
    const extraHeaders: Record<string, string> = {}

    if (tenantId.value) {
      extraHeaders['X-Tenant-Id'] = String(tenantId.value)
    }

    if (locale.value) {
      extraHeaders['Accept-Language'] = locale.value
    }

    if (authStore.token) {
      extraHeaders['Authorization'] = `Bearer ${authStore.token}`
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

  return {
    provide: {
      apollo: apolloClient,
    },
  }
})
