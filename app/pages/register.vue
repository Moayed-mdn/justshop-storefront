<template>
  <AuthCard>
    <AuthHeader :title="$t('register.title')" />

    <AuthEmailVerificationNotice
      v-if="showVerificationPanel"
      :email="registeredEmail"
      :sending-text="$t('register.sending')"
      :resend-text="$t('register.resend_verification_email')"
      :resend="resendVerificationEmail"
      :already-verified-title="$t('register.already_verified_title')"
    >
      <template #content>
        <p>
          <strong class="text-(--color-primary)">{{ $t('register.check_your_email_title') }}</strong><br>
          {{ $t('register.verification_sent', { email: registeredEmail }) }}<br>
          {{ $t('register.verification_sent_description') }}
        </p>
      </template>

      <template #footer>
        <div class="pt-2 border-t border-gray-200">
          <NuxtLink
            :to="APP_ROUTES.login"
            class="text-sm font-medium text-(--color-primary) hover:text-(--green-950) inline-flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            {{ $t('register.back_to_login') }}
          </NuxtLink>
        </div>
      </template>
    </AuthEmailVerificationNotice>

    <AuthAlert type="error" :message="errors?.message && !errors?.errors ? errors.message : undefined" />
    <AuthAlert type="success" :message="successMessage && !showVerificationPanel ? successMessage : undefined" />

    <form v-if="!showVerificationPanel" class="space-y-6" @submit.prevent="handleRegister" novalidate>
      <AuthFormInput
        id="name"
        type="text"
        :label="$t('register.name')"
        v-model="form.name"
        required
        autocomplete="name"
        :error="errors?.errors?.name?.[0]"
      />

      <AuthFormInput
        id="email"
        type="email"
        :label="$t('register.email_address')"
        v-model="form.email"
        required
        autocomplete="email"
        :error="errors?.errors?.email?.[0]"
      />

      <AuthFormInput
        id="password"
        type="password"
        :label="$t('register.password')"
        v-model="form.password"
        required
        autocomplete="new-password"
        minlength="8"
        :error="errors?.errors?.password?.[0]"
      />

      <AuthFormInput
        id="password_confirmation"
        type="password"
        :label="$t('register.confirm_password')"
        v-model="form.password_confirmation"
        required
        autocomplete="new-password"
      />

      <AuthSubmitButton
        :loading="loading"
        :text="$t('register.register')"
        :loading-text="$t('register.creating_account')"
      />
    </form>

    <template v-if="!showVerificationPanel">
      <AuthDivider :text="$t('register.or_continue_with')" />
      <AuthGoogleButton :text="$t('register.sign_up_with_google')" @click="loginWithGoogle" />
      <AuthFooterLink
        :text="$t('register.already_have_account')"
        :link-text="$t('register.log_in')"
        :to="APP_ROUTES.login"
      />
    </template>
  </AuthCard>
</template>

<script setup lang='ts'>
import { APP_ROUTES } from '~~/shared/utils/routes'
import type { ApiError } from '~~/types/api'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const { register, loading, loginWithGoogle, resendVerificationEmail } = useAuth()
const errors = ref<ApiError | null>(null)
const successMessage = ref<string | null>(null)
const { showSuccessToast } = useAppToast()

// ✨ State for post-registration verification flow
const showVerificationPanel = ref(false)
const registeredEmail = ref('')

const form = reactive({
  name: '',
  email: '',
  password: 'password',
  password_confirmation: 'password'
})

/**
 * Handle registration form submission
 */
const handleRegister = async () => {
  errors.value = null
  successMessage.value = null
  
  try {
    const response = await register(form)
    
    // ✨ Handle successful registration with email verification requirement
    if (response?.message && 
        (response.message.toLowerCase().includes('verify') || 
         response.message.toLowerCase().includes('check your email'))) {
      
      showVerificationPanel.value = true
      registeredEmail.value = form.email
      successMessage.value = response.message
      
      return
    }
    
    // Fallback for other success responses
    if (response?.message) {
      successMessage.value = response.message
      
      // Reset form fields
      form.name = ''
      form.email = ''
      form.password = ''
      form.password_confirmation = ''
    }
    
  } catch (err) {
    // The useAuth composable now shows a toast for errors.
    // We just need to set the local errors state for the UI.
    // console.log({errData:err.data})
    const error = err?.data as Error & { data: ApiError }
    if(error?.data?.errors) {
      errors.value = error.data
    }
  }
}

/**
 * Clear verification state when navigating away
 */
onBeforeUnmount(() => {
  // Optional: Clear state if needed
})
</script>