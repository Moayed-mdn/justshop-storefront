import {
  STOREFRONT_ROUTE_PATHS,
  type StorefrontRoutePaths,
} from '~~/shared/utils/storefront-routes'

/**
 * Locale-aware storefront route builders.
 * Use for all storefront navigation, breadcrumbs, and deep links.
 */
export function useStorefrontRoutes() {
  const localePath = useLocalePath()

  const paths = STOREFRONT_ROUTE_PATHS

  const home = () => localePath(paths.home)
  const shop = () => localePath(paths.shop)
  const search = (query?: string) => {
    const base = localePath(paths.search)
    if (!query?.trim()) {
      return base
    }
    return { path: base, query: { q: query.trim() } }
  }
  const cart = () => localePath(paths.cart)
  const login = () => localePath(paths.login)
  const register = () => localePath(paths.register)
  const forgotPassword = () => localePath(paths.forgotPassword)
  const resetPassword = () => localePath(paths.resetPassword)
  const profile = () => localePath(paths.profile)
  const category = (slug: string) => localePath(paths.category(slug))
  const product = (slug: string) => localePath(paths.product(slug))
  const orders = () => localePath(paths.orders.index)
  const orderDetail = (orderNumber: string | number) =>
    localePath(paths.orders.detail(orderNumber))
  const orderTrack = () => localePath(paths.orders.track)
  const checkoutSuccess = () => localePath(paths.checkout.success)
  const checkoutCancel = () => localePath(paths.checkout.cancel)
  const verifyEmail = (id: string | number, hash: string) =>
    localePath(paths.verifyEmail(id, hash))

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
    /** Raw locale-prefixed path for arbitrary canonical segments. */
    to: (path: string) => localePath(path),
  }
}
