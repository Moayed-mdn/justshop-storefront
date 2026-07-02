import type { H3Event } from 'h3'

/**
 * Transform storage URLs from backend domain to relative storage paths
 * 
 * This utility recursively traverses response data and rewrites any storage URLs
 * that point to the backend domain to use relative /storage/ paths instead.
 * 
 * Example:
 * - Input:  http://localhost:8000/storage/variants/default.png
 * - Output: /storage/variants/default.png
 * 
 * @param data - The response data (object, array, or primitive)
 * @param backendUrl - The backend base URL (e.g., "http://localhost:8000")
 * @returns Transformed data with rewritten URLs
 */
export const transformImageUrls = (data: any, backendUrl: string): any => {
  if (!data || typeof data !== 'object') {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(item => transformImageUrls(item, backendUrl))
  }

  const transformed: any = {}
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Check if it's a backend storage URL (with or without trailing slash on backendUrl)
      const backendStoragePrefix1 = backendUrl + '/storage/'
      const backendStoragePrefix2 = backendUrl + 'storage/'
      
      if (value.startsWith(backendStoragePrefix1)) {
        // Transform to relative path: /storage/...
        transformed[key] = value.replace(backendUrl, '')
      } else if (value.startsWith(backendStoragePrefix2)) {
        // Transform to relative path (add leading slash if needed)
        transformed[key] = '/' + value.replace(backendUrl, '')
      } else {
        // Leave all other URLs as-is
        transformed[key] = value
      }
    } else if (typeof value === 'object') {
      transformed[key] = transformImageUrls(value, backendUrl)
    } else {
      transformed[key] = value
    }
  }
  return transformed
}

/**
 * Get the backend URL from runtime config
 * 
 * @param event - The H3 event
 * @returns The backend base URL
 */
export const getBackendUrl = (event: H3Event): string => {
  const config = useRuntimeConfig(event)
  return String(config.apiBase || 'http://localhost:8000')
    .replace(/\/api\/v1.*$/, '')
    .replace(/\/$/, '') // Ensure no trailing slash
}

/**
 * Transform response data to use relative storage paths for images
 * 
 * Convenience function that automatically gets backend URL
 * from the event context and applies the transformation.
 * 
 * @param event - The H3 event
 * @param data - The response data to transform
 * @returns Transformed data with rewritten image URLs
 */
export const transformResponseUrls = (event: H3Event, data: any): any => {
  const backendUrl = getBackendUrl(event)
  return transformImageUrls(data, backendUrl)
}
