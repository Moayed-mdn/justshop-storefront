// composables/useAuth.ts
import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes';
import { clearResourceCache, refreshResourceCache, CacheResources } from '~~/src/core/cache/createCacheKey';
import { useTenant } from '~~/src/core/tenant/composables';
import type { AuthResponse, UserResponse } from '~~/types/auth';
import type { ApiSuccess } from '~~/types/api';

const getLocale = () => {
  try {
    const nuxtApp = useNuxtApp()
    const i18n = (nuxtApp as any).$i18n
    return i18n?.locale?.value || 'en'
  } catch {
    return 'en'
  }
}

const getTenantSlug = () => {
  try {
    const { tenant } = useTenant()
    return tenant.value?.slug
  } catch {
    return null
  }
}

export const useAuth = () => {
  const authStore = useAuthStore();
  const { showSuccessToast } = useAppToast();
  const loading = useState('auth_loading', () => false);
  const storefrontRoutes = useStorefrontRoutes();
  const api = useApi();

  const login = async (credentials: Record<string, string>) => {
    loading.value = true;
    try {
      const { data, error } = await api<AuthResponse>(API_ROUTES.auth.login, {
        method: 'POST',
        body: credentials,
      });

      if (error || !data) {
        throw error;
      }

      authStore.setUser(data.data.user || null);

      const cartStore = useCartStore();
      await cartStore.onLogin();

      await refreshResourceCache([
        CacheResources.USER_PROFILE,
        CacheResources.CART_ITEMS,
      ], { locale: getLocale(), tenantSlug: getTenantSlug() });

      return navigateTo(storefrontRoutes.home());
    }finally {
      loading.value = false;
    }
  };

  const register = async (form: Record<string, string>) => {
    loading.value = true;
    try {
      const { data, error } = await api<ApiSuccess<{}>>(
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
      const { data, error } = await api<ApiSuccess<{}>>(
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

  const forgotPassword = async (email: string) => {
    loading.value = true;
    try {
      const { data, error } = await api<ApiSuccess<{}>>(
        API_ROUTES.auth.passwordForgot,
        {
          method: 'POST',
          body: { email },
        },
      );
      if (error) throw error;
      return data;
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (form: Record<string, string>) => {
    loading.value = true;
    try {
      const { data, error } = await api<ApiSuccess<{}>>(
        API_ROUTES.auth.passwordReset,
        {
          method: 'POST',
          body: form,
        },
      );
      if (error) throw error;
      return data;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await api(API_ROUTES.auth.logout, { method: 'POST' });
    } catch {
      // Still catch here if you want to ignore silent failures
    } finally {
      authStore.clearAuth();
      useCartStore().onLogout();
      
      await clearResourceCache([
        CacheResources.USER_PROFILE,
        CacheResources.USER_ORDERS,
        CacheResources.CART_ITEMS,
      ], { locale: getLocale(), tenantSlug: getTenantSlug() });
      
      loading.value = false;
      return navigateTo(storefrontRoutes.login());
    }
  };

  const fetchUser = async () => {
    const { data, error } = await api<UserResponse>(API_ROUTES.auth.me);
    if (error) throw error;
    authStore.setUser(data?.data);
    return authStore.user;
  };

  // ── Google OAuth ───────────────────────────────────────────
  const loginWithGoogle = () => {
    window.location.href = API_ROUTES.auth.googleRedirect;
  };

  const handleGoogleCallback = async () => {
    loading.value = true;
    try {
      // #region debug-point C:handle-google-callback-start
      console.debug('[DEBUG C] handleGoogleCallback started', {
        timestamp: new Date().toISOString(),
        hasAuthToken: !!authStore.token,
      })
      // #endregion

      const currentUser = await fetchUser();
      
      // #region debug-point D:after-fetch-user
      console.debug('[DEBUG D] After fetchUser in handleGoogleCallback', {
        timestamp: new Date().toISOString(),
        hasCurrentUser: !!currentUser,
        currentUser: currentUser,
        authStoreUser: authStore.user,
      })
      // #endregion
      
      if (!currentUser) {
        throw new Error('Authenticated user was not returned after Google callback.');
      }

      const cartStore = useCartStore();
      await cartStore.onLogin();

      await refreshResourceCache([
        CacheResources.USER_PROFILE,
        CacheResources.CART_ITEMS,
      ], { locale: getLocale(), tenantSlug: getTenantSlug() });

      // #region debug-point E:handle-google-callback-success
      console.debug('[DEBUG E] handleGoogleCallback completed successfully', {
        timestamp: new Date().toISOString(),
        willNavigateTo: storefrontRoutes.home(),
      })
      // #endregion

      return navigateTo(storefrontRoutes.home());
    } catch (err: any) {
      // #region debug-point F:handle-google-callback-error
      console.error('[DEBUG F] handleGoogleCallback failed', {
        timestamp: new Date().toISOString(),
        error: err,
        message: err?.message,
        stack: err?.stack,
        authStoreState: {
          hasToken: !!authStore.token,
          hasUser: !!authStore.user,
        },
      })
      // #endregion
      
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
    forgotPassword,
    resetPassword,
  };
};
