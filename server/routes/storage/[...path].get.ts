/**
 * Proxy storage assets from Laravel backend
 * 
 * This route handles requests to /storage/* and proxies them to the backend
 * so images can be served through the frontend domain.
 * 
 * Example:
 * - Request: http://demo.justshop.test:3000/storage/variants/default.png
 * - Proxies to: http://localhost:8000/storage/variants/default.png
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const path = getRouterParam(event, 'path')

  if (!path) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Storage path not found',
    })
  }

  // Build backend storage URL
  const backendUrl = String(config.apiBase || 'http://localhost:8000').replace(/\/api\/v1.*$/, '')
  const storageUrl = `${backendUrl}/storage/${path}`

  try {
    // Fetch the asset from backend
    const response = await fetch(storageUrl)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch storage asset: ${response.statusText}`,
      })
    }

    // Get the content type
    const contentType = response.headers.get('content-type')
    if (contentType) {
      setHeader(event, 'content-type', contentType)
    }

    // Set cache headers for images
    setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')

    // Return the asset
    return response.arrayBuffer()
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to proxy storage asset: ${error}`,
    })
  }
})
