<template>
  <AuthCard>
    <AuthHeader :title="$t('auth.reset_password_title')" />

    <div v-if="success" class="text-center space-y-4">
      <AuthAlert type="success" :message="successMessage" />
      <p class="text-sm text-(--color-text-secondary)">
        {{ $t('auth.password_reset_success_note') }}
      </p>
      <NuxtLinkLocale
        :to="routes.login()"
        :style="{ backgroundColor: primary, color: onPrimary }"
        class="inline-block mt-4 px-6 py-2 text-sm font-medium rounded-md hover-primary-link"
      >
        {{ $t('auth.go_to_login') }}
      </NuxtLinkLocale>
    </div>

    <form v-else class="space-y-6" @submit.prevent="handleReset">
      <AuthAlert type="error" :message="error || undefined" />

      <AuthFormInput
        id="password"
        type="password"
        :label="$t('auth.new_password')"
        v-model="form.password"
        required
        autocomplete="new-password"
        :error="fieldErrors.password"
      />

      <AuthFormInput
        id="password_confirmation"
        type="password"
        :label="$t('auth.confirm_new_password')"
        v-model="form.password_confirmation"
        required
        autocomplete="new-password"
        :error="fieldErrors.password_confirmation"
      />

      <AuthSubmitButton
        :loading="loading"
        :text="$t('auth.reset_password_button')"
        :loading-text="$t('auth.resetting')"
      />
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
// Inline theme colors for SSR compatibility
const getCSSVar = (varName: string, fallback: string): string => {
  if (!process.client) return fallback
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    return value || fallback
  } catch {
    return fallback
  }
}

const primary = computed(() => getCSSVar('--color-primary', '#3b82f6'))
const onPrimary = computed(() => getCSSVar('--color-on-primary', '#ffffff'))

const { resetPassword, loading } = useAuth()
const routes = useStorefrontRoutes()
const route = useRoute()
const { t } = useI18n()

definePageMeta({
  layout: 'system',
  middleware: 'guest',
})

useHead({
  title: t('reset_password.page_title'),
  meta: [
    { name: 'description', content: t('reset_password.page_description') },
  ],
})

const form = reactive({
  token: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const success = ref(false)
const successMessage = ref('')
const error = ref<string | null>(null)
const fieldErrors = reactive({
  password: '',
  password_confirmation: '',
})

onMounted(() => {
  form.token = (route.query.token as string) || ''
  form.email = (route.query.email as string) || ''

  if (!form.token || !form.email) {
    error.value = t('auth.invalid_reset_link')
  }
})

const handleReset = async () => {
  error.value = null
  fieldErrors.password = ''
  fieldErrors.password_confirmation = ''

  if (!form.token || !form.email) {
    error.value = t('auth.invalid_reset_link')
    return
  }

  try {
    const response = await resetPassword(form)
    success.value = true
    successMessage.value = response?.message || t('auth.password_reset_success')
  } catch (err: any) {
    const errorData = err?.data?.data || err?.data
    if (errorData?.errors) {
      if (errorData.errors.password) fieldErrors.password = errorData.errors.password[0]
      if (errorData.errors.password_confirmation) fieldErrors.password_confirmation = errorData.errors.password_confirmation[0]
    } else {
      error.value = errorData?.message || t('auth.failed_to_reset_password')
    }
  }
}
</script>

<style scoped>
.hover-primary-link:hover {
  filter: brightness(0.9);
}
</style>
