/**
 * Global middleware to fix double locale prefix in URLs.
 * 
 * Problem: When redirecting from external sources (like the Next.js merchant dashboard)
 * with locale-prefixed URLs, Nuxt's i18n can add another locale prefix.
 * 
 * Example: /en/login from external redirect becomes /en/en/login
 * 
 * This middleware detects and fixes such cases by redirecting to the correct URL.
 */
export default defineNuxtRouteMiddleware((to) => {
  // Pattern to detect double locale prefix: /en/en/... or /ar/ar/... or /en/ar/... etc.
  const doubleLocalePattern = /^\/(en|ar)\/(en|ar)/
  
  if (doubleLocalePattern.test(to.path)) {
    // Extract the first locale and the rest of the path
    const match = to.path.match(/^\/(en|ar)\/(en|ar)(.*)$/)
    
    if (match) {
      const firstLocale = match[1]
      const restOfPath = match[3] || '/'
      
      // Reconstruct the correct path with only one locale prefix
      const fixedPath = `/${firstLocale}${restOfPath}`
      
      console.warn('[fix-double-locale] Detected double locale prefix:', {
        original: to.path,
        fixed: fixedPath,
      })
      
      return navigateTo({
        path: fixedPath,
        query: to.query,
        hash: to.hash,
      }, { 
        redirectCode: 302,  // Changed from 301 to 302 (temporary)
        replace: true,
      })
    }
  }
})
