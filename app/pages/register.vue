<template>
  <AuthCard>
    <AuthHeader :title="$t('register.title')" />

    <AuthAlert type="error" :message="errors?.message && (!errors?.errors || Object.keys(errors.errors).length === 0) ? errors.message : undefined" />

    <form class="space-y-6" @submit.prevent="handleRegister" novalidate>
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
        :error="errors?.errors?.password_confirmation?.[0]"
      />

      <AuthSubmitButton
        :loading="loading"
        :text="$t('register.register')"
        :loading-text="$t('register.creating_account')"
      />

      <!-- Divider -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t" :style="{ borderColor: 'var(--color-border-default)' }"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-(--color-bg-page) text-(--color-text-secondary)">
            {{ $t('register.or_continue_with') }}
          </span>
        </div>
      </div>

      <!-- Google OAuth Button -->
      <AuthGoogleButton
        :text="$t('register.sign_up_with_google')"
        @click="handleGoogleLogin"
      />
    </form>

    <AuthFooterLink
      :text="$t('register.already_have_account')"
      :link-text="$t('register.log_in')"
      :to="routes.login()"
    />
  </AuthCard>
</template>

<script setup lang='ts'>
import type { ApiError } from '~~/types/api'
import { API_ROUTES } from '~~/shared/utils/routes'

definePageMeta({
  layout: 'system',
  middleware: 'guest',
})

const { t } = useI18n()
const routes = useStorefrontRoutes()
const { register, loading } = useAuth()

const handleGoogleLogin = () => {
  window.location.href = API_ROUTES.auth.googleRedirect
}

useHead({
  title: t('register.page_title'),
  meta: [
    { name: 'description', content: t('register.page_description') },
  ],
})
const errors = ref<ApiError | null>(null)
const router = useRouter()

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
  
  try {
    const response = await register(form)
    
    // ✨ Redirect to login with success message indicator
    if (response?.message) {
      router.push({
        path: routes.login(),
        query: { registered: 'true' }
      })
      return
    }
    
  } catch (err: any) {
    const errorData = err?.data?.data || err?.data || err
    if (errorData) {
      errors.value = {
        status: false,
        message: errorData.message || 'Unable to create your account.',
        error_code: errorData.error_code || errorData.code || 'UNKNOWN_ERROR',
        errors: errorData.errors || null,
      }
    }
  }
}
</script>
