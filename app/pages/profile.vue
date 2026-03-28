<!-- pages/profile.vue -->
<template>
    <div class="min-h-screen bg-gray-50 py-8 px-4">
      <div class="max-w-2xl mx-auto space-y-6">
  
        <!-- Page Header -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
          <p class="text-sm text-gray-500 mt-1">Manage your account settings</p>
        </div>
  
        <!-- ═══ AVATAR SECTION ═══ -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h2>
  
          <div class="flex items-center gap-6">
            <!-- Current Avatar -->
            <div class="relative group">
              <div class="w-20 h-20 rounded-full overflow-hidden bg-[#003D29] flex items-center justify-center">
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                >
                <span v-else class="text-white text-2xl font-bold">
                  {{ initials }}
                </span>
              </div>
            </div>
  
            <div class="flex flex-col gap-2">
              <label
                class="px-4 py-2 text-sm font-medium text-[#003D29] border border-[#003D29] rounded-md cursor-pointer hover:bg-[#003D29]/5 transition-colors text-center"
              >
                Change Photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  class="hidden"
                  @change="handleAvatarChange"
                >
              </label>
              <p class="text-xs text-gray-400">JPG, PNG or WebP. Max 2MB.</p>
            </div>
          </div>
        </div>
  
        <!-- ═══ PERSONAL INFO SECTION ═══ -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Personal Information</h2>
            <div v-if="user?.has_google_linked" class="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-full">
              <img class="w-4 h-4" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="">
              <span class="text-xs text-gray-500">Google linked</span>
            </div>
          </div>
  
          <form @submit.prevent="handleUpdateInfo" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                v-model="infoForm.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#003D29] focus:border-[#003D29] sm:text-sm"
              >
              <span v-if="infoErrors?.name" class="text-xs text-red-500">{{ infoErrors.name[0] }}</span>
            </div>
  
            <div>
              <label for="profile-email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="profile-email"
                v-model="infoForm.email"
                type="email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#003D29] focus:border-[#003D29] sm:text-sm"
              >
              <span v-if="infoErrors?.email" class="text-xs text-red-500">{{ infoErrors.email[0] }}</span>
            </div>
  
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                v-model="infoForm.phone"
                type="tel"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#003D29] focus:border-[#003D29] sm:text-sm"
                placeholder="Optional"
              >
              <span v-if="infoErrors?.phone" class="text-xs text-red-500">{{ infoErrors.phone[0] }}</span>
            </div>
  
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="profileLoading"
                class="px-6 py-2 text-sm font-medium text-white bg-[#003D29] rounded-md hover:bg-[#00251C] disabled:opacity-50 transition-colors"
              >
                {{ profileLoading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
  
        <!-- ═══ PASSWORD SECTION ═══ -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">
            {{ user?.has_password ? 'Change Password' : 'Set a Password' }}
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            {{
              user?.has_password
                ? 'Update your password to keep your account secure.'
                : 'You signed up with Google. Set a password to also log in with email.'
            }}
          </p>
  
          <form @submit.prevent="handleUpdatePassword" class="space-y-4">
            <!-- Only show current password if user has one -->
            <div v-if="user?.has_password">
              <label for="current_password" class="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                id="current_password"
                v-model="passwordForm.current_password"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#003D29] focus:border-[#003D29] sm:text-sm"
              >
              <span v-if="passwordErrors?.current_password" class="text-xs text-red-500">
                {{ passwordErrors.current_password[0] }}
              </span>
            </div>
  
            <div>
              <label for="new_password" class="block text-sm font-medium text-gray-700">New Password</label>
              <input
                id="new_password"
                v-model="passwordForm.password"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#003D29] focus:border-[#003D29] sm:text-sm"
              >
              <span v-if="passwordErrors?.password" class="text-xs text-red-500">
                {{ passwordErrors.password[0] }}
              </span>
            </div>
  
            <div>
              <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                id="password_confirmation"
                v-model="passwordForm.password_confirmation"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#003D29] focus:border-[#003D29] sm:text-sm"
              >
            </div>
  
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="profileLoading"
                class="px-6 py-2 text-sm font-medium text-white bg-[#003D29] rounded-md hover:bg-[#00251C] disabled:opacity-50 transition-colors"
              >
                {{ profileLoading ? 'Saving...' : user?.has_password ? 'Update Password' : 'Set Password' }}
              </button>
            </div>
          </form>
        </div>
  
        <!-- ═══ DANGER ZONE ═══ -->
        <div class="bg-white rounded-lg shadow-sm p-6 border border-red-200">
          <h2 class="text-lg font-semibold text-red-600 mb-1">Danger Zone</h2>
          <p class="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back.</p>
  
          <button
            @click="showDeleteConfirm = true"
            class="px-6 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
          >
            Delete Account
          </button>
  
          <!-- Delete Confirmation Modal -->
          <div
            v-if="showDeleteConfirm"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            @click.self="showDeleteConfirm = false"
          >
            <div class="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h3 class="text-lg font-bold text-gray-900">Delete Account?</h3>
              <p class="text-sm text-gray-500 mt-2">
                This will permanently delete your account, orders, and all associated data. This action cannot be undone.
              </p>
              <div class="flex justify-end gap-3 mt-6">
                <button
                  @click="showDeleteConfirm = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  @click="handleDeleteAccount"
                  :disabled="profileLoading"
                  class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {{ profileLoading ? 'Deleting...' : 'Yes, Delete' }}
                </button>
              </div>
            </div>
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
  })
  
  const { user } = useAuth()
  const { fetchProfile, updateInfo, updatePassword, updateAvatar, deleteAccount, loading: profileLoading } = useProfile()
  const { getAvatarUrl, getInitials } = useAvatar()
  const toast = useToast()
  
  // ── Reactive Data ──
  const infoForm = reactive({
    name: '',
    email: '',
    phone: '',
  })
  
  const passwordForm = reactive({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  
  const infoErrors = ref<Record<string, string[]> | null>(null)
  const passwordErrors = ref<Record<string, string[]> | null>(null)
  const showDeleteConfirm = ref(false)
  
  const avatarUrl = computed(() => getAvatarUrl(user.value?.avatar))
  const initials = computed(() => getInitials(user.value?.name))
  
  // ── Load profile on mount ──
  onMounted(async () => {
    try {
      await fetchProfile()
      // Pre-fill form
      if (user.value) {
        infoForm.name = user.value.name || ''
        infoForm.email = user.value.email || ''
        infoForm.phone = user.value.phone || ''
      }
    } catch {
      toast.add({
        title: 'Error',
        description: 'Failed to load profile.',
        color: 'error',
      })
    }
  })
  
  // ── Handlers ──
  const handleUpdateInfo = async () => {
    infoErrors.value = null
    try {
      await updateInfo(infoForm)
      toast.add({
        title: 'Success',
        description: 'Profile updated successfully.',
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })
    } catch (err: any) {
      if (err.data?.errors) {
        infoErrors.value = err.data.errors
      } else {
        toast.add({
          title: 'Error',
          description: err.data?.message || 'Failed to update profile.',
          color: 'error',
        })
      }
    }
  }
  
  const handleUpdatePassword = async () => {
    passwordErrors.value = null
    try {
      const response = await updatePassword(passwordForm)
      toast.add({
        title: 'Success',
        description: response.message,
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })
      // Clear form
      passwordForm.current_password = ''
      passwordForm.password = ''
      passwordForm.password_confirmation = ''
      // Refresh profile to update has_password
      await fetchProfile()
    } catch (err: any) {
      if (err.data?.errors) {
        passwordErrors.value = err.data.errors
      } else {
        toast.add({
          title: 'Error',
          description: err.data?.message || 'Failed to update password.',
          color: 'error',
        })
      }
    }
  }
  
  const handleAvatarChange = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
  
    try {
      await updateAvatar(file)
      toast.add({
        title: 'Success',
        description: 'Avatar updated.',
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })
      // Refresh profile to get fresh avatar URL
      await fetchProfile()
    } catch (err: any) {
      toast.add({
        title: 'Error',
        description: err.data?.message || 'Failed to upload avatar.',
        color: 'error',
      })
    }
  }
  
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
    } catch {
      toast.add({
        title: 'Error',
        description: 'Failed to delete account.',
        color: 'error',
      })
    }
  }
  </script>