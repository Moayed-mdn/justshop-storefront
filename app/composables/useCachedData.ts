import type { NuxtApp } from '#app'
import { CACHE_DURATION } from '~/config/cache'

interface CachedPayload<T> {
  data: T
  fetchedAt: number
}

/**
 * Composable for handling cached data with a timestamp.
 *
 * @param duration - The cache duration in milliseconds. Defaults to CACHE_DURATION.MEDIUM.
 * @returns An object with transform and getCachedData functions.
 */
export const useCachedData = <T>(duration: number = CACHE_DURATION.MEDIUM) => {
  /**
   * Transforms the data to include a 'fetchedAt' timestamp.
   * @param data - The data to be transformed.
   * @returns The data wrapped in an object with a 'fetchedAt' timestamp.
   */
  const transform = (data: T) => {
    return {
      data,
      fetchedAt: Date.now(),
    }
  }

  /**
   * Retrieves cached data if it's still fresh.
   * @param key - The cache key.
   * @param nuxtApp - The Nuxt application instance.
   * @returns The cached data or undefined if it's stale or not present.
   */
  const getCachedData = (key: string, nuxtApp: NuxtApp) => {
    const cached = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
    if (!cached) {
      return undefined
    }

    const age = Date.now() - (cached as CachedPayload<T>).fetchedAt
    if (age > duration) {
      return undefined // too old → refetch
    }

    return cached as CachedPayload<T> // fresh → reuse
  }

  return {
    transform,
    getCachedData,
  }
}
