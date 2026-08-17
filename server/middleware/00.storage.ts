export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/storage/')) {
    const config = useRuntimeConfig(event)
    const path = event.path.replace('/storage/', '')

    if (!path) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Storage path not found',
      })
    }

    const backendUrl = String(config.apiBase || 'http://localhost:8000').replace(/\/api\/v1.*$/, '')
    const storageUrl = `${backendUrl}/storage/${path}`

    try {
      const response = await fetch(storageUrl)

      if (!response.ok) {
        throw createError({
          statusCode: response.status,
          statusMessage: `Failed to fetch storage asset: ${response.statusText}`,
        })
      }

      const contentType = response.headers.get('content-type')
      if (contentType) {
        setHeader(event, 'content-type', contentType)
      }

      // ⚠️ PERF FIX: was 'no-store, no-cache, must-revalidate', which forced
      // every product/theme image to be re-downloaded through this proxy on
      // every single page view. Uploaded media is effectively immutable
      // (a new upload gets a new path), so let browsers cache it.
      setHeader(event, 'cache-control', 'public, max-age=86400, stale-while-revalidate=604800')

      event.node.res.end(Buffer.from(await response.arrayBuffer()))
      return
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to proxy storage asset: ${error}`,
      })
    }
  }
})
