// app/plugins/apollo.client.ts

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const httpLink = new HttpLink({
    uri: config.public.graphqlUrl as string,  // → http://localhost:8000/graphql ✅
  })

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
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