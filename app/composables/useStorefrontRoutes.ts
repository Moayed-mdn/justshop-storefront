import {
  STOREFRONT_ROUTE_PATHS,
  type StorefrontRoutePaths,
} from '~~/shared/utils/storefront-routes'

/**
 * Storefront route builders.
 * Returns locale-neutral paths (e.g. "/shop", "/cart").
 * Use with <NuxtLinkLocale> in templates for automatic locale prefixing.
 */
export function useStorefrontRoutes() {
  const paths = STOREFRONT_ROUTE_PATHS

  const home = () => paths.home
  const shop = () => paths.shop
  const search = (query?: string) => {
    if (!query?.trim()) {
      return paths.search
    }
    return { path: paths.search, query: { q: query.trim() } }
  }
  const cart = () => paths.cart
  const login = () => paths.login
  const register = () => paths.register
  const forgotPassword = () => paths.forgotPassword
  const resetPassword = () => paths.resetPassword
  const profile = () => paths.profile
  const category = (slug: string) => paths.category(slug)
  const product = (slug: string) => paths.product(slug)
  const orders = () => paths.orders.index
  const orderDetail = (orderNumber: string | number) =>
    paths.orders.detail(orderNumber)
  const orderTrack = () => paths.orders.track
  const checkoutSuccess = () => paths.checkout.success
  const checkoutCancel = () => paths.checkout.cancel
  const verifyEmail = (id: string | number, hash: string) =>
    paths.verifyEmail(id, hash)

  return {
    paths: paths satisfies StorefrontRoutePaths,
    home,
    shop,
    search,
    cart,
    login,
    register,
    forgotPassword,
    resetPassword,
    profile,
    category,
    product,
    orders,
    orderDetail,
    orderTrack,
    checkoutSuccess,
    checkoutCancel,
    verifyEmail,
  }
}
