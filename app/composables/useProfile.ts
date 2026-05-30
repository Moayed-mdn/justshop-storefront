// composables/useProfile.ts
import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes'
import type { Profile, ProfileResponse, UpdateAvatarResponse } from '~~/types/profile'

export const useProfile = () => {
  const authStore = useAuthStore()
  const { showSuccessToast } = useAppToast()
  const loading = useState('profile_loading', () => false)
  const storefrontRoutes = useStorefrontRoutes()
  const api = useApi()
  // ── Fetch full profile ─────────────────────────────────────
  const fetchProfile = async () => {
    loading.value = true
    try {
      const { data, error } = await api<ProfileResponse>(API_ROUTES.profile.index)
      if (error) throw error
      if (data) {
        authStore.setUser(data.data)
        return data.data
      }
    } finally {
      loading.value = false
    }
  }

  // ── Update info (name, email, phone) ───────────────────────
  const updateInfo = async (
    form: { name: string; email: string; phone?: string },
    options?: { successMessage?: string },
  ) => {
    loading.value = true
    try {
      const { data, error } = await api<ProfileResponse>(API_ROUTES.profile.info, {
        method: 'PUT',
        body: form,
      })
      if (error) throw error
      if (data) {
        authStore.setUser(data.data)
        if (options?.successMessage) {
          showSuccessToast(options.successMessage)
        }
        return data
      }
    } finally {
      loading.value = false
    }
  }

  // ── Update password ────────────────────────────────────────
  const updatePassword = async (
    form: {
      current_password?: string
      password: string
      password_confirmation: string
    },
    options?: { successMessage?: string },
  ) => {
    loading.value = true
    try {
      const { data, error } = await api<ProfileResponse>(API_ROUTES.profile.password, {
        method: 'PUT',
        body: form,
      })
      if (error) throw error
      if (data && options?.successMessage) {
        showSuccessToast(options.successMessage)
      }
      return data
    } finally {
      loading.value = false
    }
  }

  // ── Update avatar ──────────────────────────────────────────
  const updateAvatar = async (file: File, options?: { successMessage?: string }) => {
    loading.value = true
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const { data, error } = await api<UpdateAvatarResponse>(API_ROUTES.profile.avatar, {
        method: 'POST',
        body: formData,
      })

      if (error) throw error

      // Update the user's avatar in the store
      if (data && authStore.user) {
        authStore.setUser({ ...authStore.user, avatar: data.data.avatar })
        if (options?.successMessage) {
          showSuccessToast(options.successMessage)
        }
      }

      return data
    } finally {
      loading.value = false
    }
  }

  // ── Delete account ─────────────────────────────────────────
  const deleteAccount = async () => {
    loading.value = true
    try {
      const { error } = await api(API_ROUTES.profile.index, { method: 'DELETE' })
      if (error) throw error
      authStore.clearAuth()
      return navigateTo(storefrontRoutes.login())
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    fetchProfile,
    updateInfo,
    updatePassword,
    updateAvatar,
    deleteAccount,
  }
}