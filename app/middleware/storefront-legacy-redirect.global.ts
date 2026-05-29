import {
  logStorefrontLegacyRedirect,
  resolveStorefrontLegacyRedirect,
} from '~~/shared/utils/storefront-routes'

/**
 * Explicit legacy storefront redirects (logged, no silent rewrites).
 * Runtime resolve may also redirect `/products` → `/shop` on catch-all routes.
 */
export default defineNuxtRouteMiddleware((to) => {
  const redirect = resolveStorefrontLegacyRedirect(to.path)

  if (!redirect || redirect.to === to.path) {
    return
  }

  logStorefrontLegacyRedirect({
    from: to.path,
    to: redirect.to,
    id: redirect.id,
    status: redirect.status,
  })

  return navigateTo(redirect.to, {
    redirectCode: redirect.status,
    replace: true,
  })
})
