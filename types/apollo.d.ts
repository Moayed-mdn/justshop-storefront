// types/apollo.d.ts

import type { ApolloClient, NormalizedCacheObject } from '@apollo/client/core'

declare module '#app' {
  interface NuxtApp {
    $apollo: ApolloClient<NormalizedCacheObject>
  }
}

export {}