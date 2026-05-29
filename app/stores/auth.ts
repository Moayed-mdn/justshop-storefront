import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AuthUser } from '~~/types/auth';

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(null);
  const user = ref<AuthUser | null>(null);

  // Getters
  const isLoggedIn = computed(() => !!token.value);

  // Actions
  function setToken(newToken: string | null) {
    token.value = newToken;
  }

  function setUser(newUser: AuthUser | null) {
    
    user.value = newUser;
  }

  function clearAuth() {
    token.value = null;
    user.value = null;
  }

  return {
    token,
    user,
    isLoggedIn,
    setToken,
    setUser,
    clearAuth,
  };
}, {
  persist: {
    key: 'js_auth',
    storage: piniaPluginPersistedstate.cookies(),
    pick: ['token'],
  },
});
