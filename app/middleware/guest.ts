// middleware/guest.ts
export default defineNuxtRouteMiddleware((to) => {
    const { isLoggedIn } = useAuth()
  
    if (isLoggedIn.value) {
      return navigateTo('/')
    }
  })