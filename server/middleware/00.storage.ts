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

      setHeader(event, 'cache-control', 'no-store, no-cache, must-revalidate')

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
