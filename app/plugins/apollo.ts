// app/plugins/apollo.ts

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { token } = useAuthStore()

  const httpLink = new HttpLink({
    uri: config.public.graphqlUrl as string,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const apolloClient = new ApolloClient({
    link: httpLink,
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