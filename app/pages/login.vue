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

    <AuthAlert type="error" :message="errors?.message && !errors?.errors ? errors.message : undefined" />

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
        <NuxtLink to="/forgot-password" class="text-sm font-medium text-(--color-primary) hover:text-(--green-950)">
          {{ $t('login.forgot_password') }}
        </NuxtLink>
      </div>

      <AuthSubmitButton
        :loading="loading"
        :text="$t('login.log_in')"
        :loading-text="$t('login.signing_in')"
      />
    </form>

    <template v-if="!isEmailNotVerified">
      <AuthDivider :text="$t('login.or')" />
      <AuthGoogleButton :text="$t('login.sign_in_with_google')" @click="loginWithGoogle" />
      <AuthFooterLink
        :text="$t('login.no_account')"
        :link-text="$t('login.sign_up')"
        to="/register"
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

const { login, loading, loginWithGoogle, resendVerificationEmail } = useAuth()
const errors = ref<ApiError | null>(null)

// ✨ New state for email verification flow
const isEmailNotVerified = ref(false)
const pendingEmail = ref('')

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
  } catch (err) {
    const error = err as Error & { data: ApiError }
    
    // if (error.data?.isEmailNotVerified || error.data?.message?.toLowerCase()?.includes('email not verified')) {
    //   isEmailNotVerified.value = true
    //   pendingEmail.value = error.data.email || form.email
    //   errors.value = { message: t('login.verify_email_before_login') }
    
    // General errors are now handled by the useAuth composable.
    // Handle Field-Specific Validation Errors (Laravel style)
    if (error.data.errors) {
      errors.value = error.data
    }
  }
}
</script>