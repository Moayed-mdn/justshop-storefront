// config/cache.ts
export const CACHE_DURATION = {
    SHORT: 5 * 60 * 1000,        // 5 minutes
    MEDIUM: 10 * 60 * 1000,      // 10 minutes
    LONG: 30 * 60 * 1000,        // 30 minutes
    HOUR: 60 * 60 * 1000,        // 1 hour
    DAY: 24 * 60 * 60 * 1000,    // 1 day
  } as const
  
  export const CACHE_KEYS = {
    HERO: 'hero-data',
    USER: 'user-data',
    POSTS: 'posts-data',
  } as const
  
  // Helper type for cache durations
  export type CacheDuration = typeof CACHE_DURATION[keyof typeof CACHE_DURATION]
  export type CacheKey = typeof CACHE_KEYS[keyof typeof CACHE_KEYS]
  
  // Utility function to check cache validity
  export const isCacheValid = (fetchedAt: number, duration: CacheDuration): boolean => {
    return Date.now() - fetchedAt < duration
  }