// composables/useProfile.ts
import type { Profile, ProfileResponse, UpdateAvatarResponse } from '~~/types/profile'

export const useProfile = () => {
  const authStore = useAuthStore()
  const { showSuccessToast } = useAppToast()
  const loading = useState('profile_loading', () => false)
  const baseURL = useRuntimeConfig().public.apiBase
  const localePath = useLocalePath()
  // ── Fetch full profile ─────────────────────────────────────
  const fetchProfile = async () => {
    loading.value = true
    try {
      const { data, error } = await useApi<ProfileResponse>(`${baseURL}/profile`)
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
      const { data, error } = await useApi<ProfileResponse>(`${baseURL}/profile/info`, {
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
      const { data, error } = await useApi<ProfileResponse>(`${baseURL}/profile/password`, {
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
      const { data, error } = await useApi<UpdateAvatarResponse>(`${baseURL}/profile/avatar`, {
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
      const { error } = await useApi(`${baseURL}/profile`, { method: 'DELETE' })
      if (error) throw error
      authStore.clearAuth()
      return navigateTo(localePath('/login'))
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