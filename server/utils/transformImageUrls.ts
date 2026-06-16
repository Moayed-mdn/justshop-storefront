import type { H3Event } from 'h3'

/**
 * Transform image URLs from backend domain to frontend domain
 * 
 * This utility recursively traverses response data and rewrites any URLs
 * that point to the backend domain to use the frontend domain instead.
 * 
 * Example:
 * - Input:  http://localhost:8000/storage/variants/default.png
 * - Output: http://demo.justshop.test:3000/storage/variants/default.png
 * 
 * @param data - The response data (object, array, or primitive)
 * @param backendUrl - The backend base URL (e.g., "http://localhost:8000")
 * @param frontendUrl - The frontend base URL (e.g., "http://demo.justshop.test:3000")
 * @returns Transformed data with rewritten URLs
 */
export const transformImageUrls = (data: any, backendUrl: string, frontendUrl: string): any => {
  if (!data || typeof data !== 'object') {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(item => transformImageUrls(item, backendUrl, frontendUrl))
  }

  const transformed: any = {}
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string' && value.startsWith(backendUrl)) {
      // Rewrite backend URL to frontend URL
      transformed[key] = value.replace(backendUrl, frontendUrl)
    } else if (typeof value === 'object') {
      transformed[key] = transformImageUrls(value, backendUrl, frontendUrl)
    } else {
      transformed[key] = value
    }
  }
  return transformed
}

/**
 * Get the frontend URL from the request headers
 * 
 * @param event - The H3 event
 * @returns The frontend URL (protocol + host)
 */
export const getFrontendUrl = (event: H3Event): string => {
  const protocol = getHeader(event, 'x-forwarded-proto') || 'http'
  const host = getHeader(event, 'host') || 'localhost:3000'
  return `${protocol}://${host}`
}

/**
 * Get the backend URL from runtime config
 * 
 * @param event - The H3 event
 * @returns The backend base URL
 */
export const getBackendUrl = (event: H3Event): string => {
  const config = useRuntimeConfig(event)
  return String(config.apiBase || 'http://localhost:8000').replace(/\/api\/v1.*$/, '')
}

/**
 * Transform response data to use frontend URLs for images
 * 
 * Convenience function that automatically gets backend and frontend URLs
 * from the event context and applies the transformation.
 * 
 * @param event - The H3 event
 * @param data - The response data to transform
 * @returns Transformed data with rewritten image URLs
 */
export const transformResponseUrls = (event: H3Event, data: any): any => {
  const backendUrl = getBackendUrl(event)
  const frontendUrl = getFrontendUrl(event)
  return transformImageUrls(data, backendUrl, frontendUrl)
}
