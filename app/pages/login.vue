<template>
  <AuthCard>
    <AuthHeader :title="$t('login.title')" />

    <AuthEmailVerificationNotice
      v-if="isEmailNotVerified"
      :email="pendingEmail"
      :sending-text="$t('login.sending')"
      :resend-text="$t('login.resend_verification_email')"
      :resend="resendVerificationEmail"
    >
      <template #content>
        <p class="font-semibold">
          <strong class="text-(--color-primary)">{{ $t('login.email_not_verified_title') }}</strong><br>
          {{ $t('login.email_not_verified_description', { email: pendingEmail }) }}
        </p>
      </template>
    </AuthEmailVerificationNotice>

    <AuthAlert type="error" :message="errors?.message && (!errors?.errors || Object.keys(errors.errors).length === 0) ? errors.message : undefined" />
    <AuthAlert type="success" :message="successMessage" />

    <form v-if="!isEmailNotVerified" class="space-y-6" @submit.prevent="handleLogin">
      <AuthFormInput
        id="email"
        type="email"
        :label="$t('login.email_address')"
        v-model="form.email"
        required
        autocomplete="email"
        :error="errors?.errors?.email?.[0]"
      />

      <AuthFormInput
        id="password"
        type="password"
        :label="$t('login.password')"
        v-model="form.password"
        required
        autocomplete="current-password"
        :error="errors?.errors?.password?.[0]"
      />

      <div class="flex items-center justify-between">
        <NuxtLinkLocale :to="routes.forgotPassword()" class="text-sm font-medium text-(--color-primary) hover:text-(--green-950)">
          {{ $t('login.forgot_password') }}
        </NuxtLinkLocale>
      </div>

      <AuthSubmitButton
        :loading="loading"
        :text="$t('login.log_in')"
        :loading-text="$t('login.signing_in')"
      />
    </form>

    <template v-if="!isEmailNotVerified">
      <AuthFooterLink
        :text="$t('login.no_account')"
        :link-text="$t('login.sign_up')"
        :to="routes.register()"
      />
    </template>
  </AuthCard>
</template>

<script setup lang='ts'>
import type { ApiError } from '~~/types/api'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',  
})

const routes = useStorefrontRoutes()
const { login, loading, resendVerificationEmail } = useAuth()
const { t } = useI18n()

useHead({
  title: t('login.page_title'),
  meta: [
    { name: 'description', content: t('login.page_description') },
  ],
})

const errors = ref<ApiError | null>(null)
const successMessage = ref<string | undefined>(undefined)
const route = useRoute()

// ✨ New state for email verification flow
const isEmailNotVerified = ref(false)
const pendingEmail = ref('')

onMounted(() => {
  if (route.query.registered === 'true') {
    successMessage.value = t('login.registered_successfully')
  }
})

const form = reactive({
  email: '',
  password: 'password',
})

const handleLogin = async () => {
  errors.value = null
  isEmailNotVerified.value = false
  pendingEmail.value = ''
  
  try {
    await login(form)
  } catch (err: any) {
    const errorData = err?.data?.data || err?.data || err
    
    // ✨ Handle email not verified error (AUTH_002)
    if (errorData?.error_code === 'AUTH_002' || err?.statusCode === 403 && errorData?.message === 'auth.verify_email_before_login') {
      isEmailNotVerified.value = true
      pendingEmail.value = form.email
      errors.value = { 
        status: false,
        message: t('login.verify_email_before_login'),
        error_code: 'AUTH_002',
        errors: null
      }
      return
    }
    
    // General errors are now handled by the useAuth composable.
    // Handle Field-Specific Validation Errors (Laravel style)
    if (errorData) {
      errors.value = {
        status: false,
        message: errorData.message || 'Unable to sign in.',
        error_code: errorData.error_code || errorData.code || 'UNKNOWN_ERROR',
        errors: errorData.errors || null,
      }
    }
  }
}
</script>
