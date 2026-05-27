// composables/useAuth.ts
import { useApi } from '~/composables/useApi';
import { API_ROUTES, APP_ROUTES } from '~~/shared/utils/routes';
import type { AuthResponse, UserResponse } from '~~/types/auth';
import type { ApiSuccess } from '~~/types/api';

export const useAuth = () => {
  const authStore = useAuthStore();
  const { showSuccessToast } = useAppToast();
  const loading = useState('auth_loading', () => false);
  const localePath = useLocalePath();

  const login = async (credentials: Record<string, string>) => {
    loading.value = true;
    try {
      const { data, error } = await useApi<AuthResponse>(API_ROUTES.auth.login, {
        method: 'POST',
        body: credentials,
      });

      if (error || !data) {
        throw error;
      }

      authStore.setToken(data.data.token);
      authStore.setUser(data.data.user);

      const cartStore = useCartStore();
      await cartStore.onLogin();

      return navigateTo(localePath(APP_ROUTES.home));
    }finally {
      loading.value = false;
    }
  };

  const register = async (form: Record<string, string>) => {
    loading.value = true;
    try {
      const { data, error } = await useApi<ApiSuccess<{}>>(
        API_ROUTES.auth.register,
        {
          method: 'POST',
          body: form,
        },
      );
      if (error) throw error;

      if (data?.message) showSuccessToast(data.message);
      return data;
    } finally {
      loading.value = false;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    loading.value = true;
    try {
      const { data, error } = await useApi<ApiSuccess<{}>>(
        API_ROUTES.auth.emailResend,
        {
          method: 'POST',
          body: { email },
        },
      );
      if (error) throw error;
      return {
        success: true,
        message: data?.message || 'Verification email sent!',
      };
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await useApi(API_ROUTES.auth.logout, { method: 'POST' });
    } catch {
      // Still catch here if you want to ignore silent failures
    } finally {
      authStore.clearAuth();
      useCartStore().onLogout();
      loading.value = false;
      return navigateTo(localePath(APP_ROUTES.login));
    }
  };

  const fetchUser = async () => {
    if (!authStore.isLoggedIn) return null;
    try {
      const { data, error } = await useApi<UserResponse>(API_ROUTES.auth.me);
      if (error) throw error;
      authStore.setUser(data?.data);
      return authStore.user;
    } catch {
      authStore.clearAuth();
      return null;
    }
  };

  // ── Google OAuth ───────────────────────────────────────────
  const loginWithGoogle = () => {
    window.location.href = API_ROUTES.auth.googleRedirect;
  };

  const handleGoogleCallback = async (token: string) => {
    loading.value = true;
    try {
      authStore.setToken(token);
      await fetchUser();

      const cartStore = useCartStore();
      await cartStore.onLogin();

      return navigateTo(localePath('/'));
    } catch (err: any) {
      authStore.clearAuth();
      throw err;
    } finally {
      loading.value = false;
    }
  };
  return {
    user: computed(() => authStore.user),
    isLoggedIn: computed(() => authStore.isLoggedIn),
    loading,
    login,
    register,
    logout,
    fetchUser,
    loginWithGoogle,
    handleGoogleCallback,
    resendVerificationEmail,
  };
};
