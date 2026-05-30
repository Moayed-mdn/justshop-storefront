<!-- pages/profile.vue -->
  <template>
    <div class="min-h-screen py-8 px-4" :style="{ backgroundColor: 'var(--profile-page-bg)' }">
      <div class="max-w-2xl mx-auto space-y-6">

        <ProfilePageHeader
          :title="t('profile.title')"
          :subtitle="t('profile.subtitle')"
        />

        <ProfileAvatarSection
          :title="t('profile.avatar.title')"
          :avatar-url="avatarUrl"
          :initials="initials"
          :button-text="t('profile.avatar.change')"
          :hint="t('profile.avatar.hint')"
          @change="handleAvatarChange"
        />

        <ProfilePersonalInfoSection
          :title="t('profile.personalInfo.title')"
          :model="infoForm"
          :name-label="t('profile.personalInfo.nameLabel')"
          :email-label="t('profile.personalInfo.emailLabel')"
          :phone-label="t('profile.personalInfo.phoneLabel')"
          :phone-placeholder="t('profile.personalInfo.phonePlaceholder')"
          :save-button-text="t('profile.personalInfo.saveButton')"
          :saving-button-text="t('profile.personalInfo.savingButton')"
          :google-linked="Boolean(user?.has_google_linked)"
          :google-linked-text="t('profile.personalInfo.googleLinked')"
          :loading="profileLoading"
          :errors="infoErrors"
          @submit="handleUpdateInfo"
        />

        <ProfilePasswordSection
          :title="user?.has_password ? t('profile.password.changeTitle') : t('profile.password.setTitle')"
          :subtitle="user?.has_password ? t('profile.password.changeSubtitle') : t('profile.password.setSubtitle')"
          :model="passwordForm"
          :show-current-password="Boolean(user?.has_password)"
          :current-password-label="t('profile.password.currentPasswordLabel')"
          :new-password-label="t('profile.password.newPasswordLabel')"
          :confirm-password-label="t('profile.password.confirmPasswordLabel')"
          :submit-button-text="user?.has_password ? t('profile.password.updateButton') : t('profile.password.setButton')"
          :saving-button-text="t('profile.personalInfo.savingButton')"
          :loading="profileLoading"
          :errors="passwordErrors"
          @submit="handleUpdatePassword"
        />

        <ProfileDangerZoneSection
          :title="t('profile.dangerZone.title')"
          :subtitle="t('profile.dangerZone.subtitle')"
          :delete-button-text="t('profile.dangerZone.deleteButton')"
          :confirm-open="showDeleteConfirm"
          :confirm-title="t('profile.dangerZone.confirm.title')"
          :confirm-message="t('profile.dangerZone.confirm.message')"
          :cancel-text="t('profile.dangerZone.confirm.cancelButton')"
          :confirm-text="t('profile.dangerZone.confirm.confirmButton')"
          :loading-text="t('profile.dangerZone.confirm.deletingButton')"
          :loading="profileLoading"
          :require-password="Boolean(user?.has_password)"
          @request-delete="showDeleteConfirm = true"
          @cancel-delete="showDeleteConfirm = false"
          @confirm-delete="handleDeleteAccount"
          @confirm-delete-with-password="handleDeleteAccountWithPassword"
        />
  
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
  })
  
  const { t } = useI18n()
  const { user } = useAuth()
  const { fetchProfile, updateInfo, updatePassword, updateAvatar, deleteAccount, loading: profileLoading } = useProfile()
  const { getAvatarUrl, getInitials } = useAvatar()
  const { showErrorToast } = useAppToast()
  
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
      showErrorToast(t('profile.toasts.loadProfileError'))
    }
  })
  
  // ── Handlers ──
  const handleUpdateInfo = async () => {
    infoErrors.value = null
    try {
      await updateInfo(infoForm, { successMessage: t('profile.toasts.updateInfoSuccess') })
    } catch (err: any) {
      if (err.data?.errors) {
        infoErrors.value = err.data.errors
      }
    }
  }
  
  const handleUpdatePassword = async () => {
    passwordErrors.value = null
    try {
      await updatePassword(passwordForm, { successMessage: t('profile.toasts.updatePasswordSuccess') })
      // Clear form
      passwordForm.current_password = ''
      passwordForm.password = ''
      passwordForm.password_confirmation = ''
      // Refresh profile to update has_password
      await fetchProfile()
    } catch (err: any) {
      if (err.data?.errors) {
        passwordErrors.value = err.data.errors
      }
    }
  }
  
  const handleAvatarChange = async (file: File) => { 
    try {
      await updateAvatar(file, { successMessage: t('profile.toasts.updateAvatarSuccess') })
      await fetchProfile()
    } catch (err: any) {
    }
  }
  
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount()
    } catch {
      showErrorToast(t('profile.toasts.deleteAccountError'))
    }
  }

  const handleDeleteAccountWithPassword = async (password: string) => {
    try {
      await deleteAccount(password)
    } catch {
      showErrorToast(t('profile.toasts.deleteAccountError'))
    }
  }
  </script>