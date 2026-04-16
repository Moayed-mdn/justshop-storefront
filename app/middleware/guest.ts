// middleware/guest.ts
export default defineNuxtRouteMiddleware((to) => {
    const { isLoggedIn } = useAuth()
    const localePath = useLocalePath()
  
    if (isLoggedIn.value) {
      return navigateTo(localePath('/'))
    }
  })