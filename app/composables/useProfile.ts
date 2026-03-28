// composables/useProfile.ts
export const useProfile = () => {
    const api = useClientApi()
    const authStore = useAuthStore()
    const loading = useState('profile_loading', () => false)
  
    // ── Fetch full profile ─────────────────────────────────────
    const fetchProfile = async () => {
      loading.value = true
      try {
        const data = await api('/profile')
        authStore.setUser(data.data.user)
        return data.data.user
      } catch (err: any) {
        throw err
      } finally {
        loading.value = false
      }
    }
  
    // ── Update info (name, email, phone) ───────────────────────
    const updateInfo = async (form: { name: string; email: string; phone?: string }) => {
      loading.value = true
      try {
        const data = await api('/profile/info', {
          method: 'PUT',
          body: form,
        })
        authStore.setUser(data.data.user)
        return data
      } catch (err: any) {
        throw err
      } finally {
        loading.value = false
      }
    }
  
    // ── Update password ────────────────────────────────────────
    const updatePassword = async (form: {
      current_password?: string
      password: string
      password_confirmation: string
    }) => {
      loading.value = true
      try {
        const data = await api('/profile/password', {
          method: 'PUT',
          body: form,
        })
        return data
      } catch (err: any) {
        throw err
      } finally {
        loading.value = false
      }
    }
  
    // ── Update avatar ──────────────────────────────────────────
    const updateAvatar = async (file: File) => {
      loading.value = true
      try {
        const formData = new FormData()
        formData.append('avatar', file)
  
        const data = await api('/profile/avatar', {
          method: 'POST',
          body: formData,
        })
  
        // Update the user's avatar in the store
        if (authStore.user) {
          authStore.setUser({ ...authStore.user, avatar: data.data.avatar })
        }
  
        return data
      } catch (err: any) {
        throw err
      } finally {
        loading.value = false
      }
    }
  
    // ── Delete account ─────────────────────────────────────────
    const deleteAccount = async () => {
      loading.value = true
      try {
        await api('/profile', { method: 'DELETE' })
        authStore.clearAuth()
        return navigateTo('/login')
      } catch (err: any) {
        throw err
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