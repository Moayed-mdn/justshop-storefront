// plugins/auth.client.ts
export default defineNuxtPlugin(async () => {
    const { fetchUser, isLoggedIn } = useAuth()
  
    if (isLoggedIn.value) {
      await fetchUser()
    }
  })