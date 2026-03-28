import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as any | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    setToken(token: string | null) {
      this.token = token
    },
    setUser(user: any | null) {
      console.log('this user',user)
      this.user = user
    },
    clearAuth() {
      this.token = null
      this.user = null
    },
  },

  persist: {
    key: 'auth',
    storage: piniaPluginPersistedstate.cookies(),   // ✅ correct auto-imported name
    pick: ['token'],
  },
})