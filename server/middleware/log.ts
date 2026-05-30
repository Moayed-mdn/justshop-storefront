/**
 * Request logging middleware.
 * Restricted to development to avoid log noise in production.
 *
 * Wave 1 fix: was unconditionally logging every request.
 */
export default defineEventHandler((event) => {
  if (import.meta.dev) {
    console.log('[request]', getRequestURL(event).toString())
  }
})
