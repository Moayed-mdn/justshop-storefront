// middleware/guest.ts
export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn, user, fetchUser } = useAuth()
  const sessionCookie = useCookie('ecommerce_session')

  if (!user.value && sessionCookie.value) {
    await fetchUser()
  }

  if (isLoggedIn.value) {
    return navigateTo(useStorefrontRoutes().home())
  }
})
