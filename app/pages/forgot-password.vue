<template>
  <AuthCard>
    <AuthHeader :title="$t('login.forgot_password')" />

    <div v-if="success" class="text-center space-y-4">
      <AuthAlert type="success" :message="successMessage" />
      <p class="text-sm text-(--color-text-secondary)">
        {{ $t('forgot_password_success_note') }}
      </p>
      <NuxtLinkLocale
        :to="routes.login()"
        class="inline-block mt-4 text-sm font-medium text-(--color-primary) hover:text-(--color-primary-hover)"
      >
        {{ $t('back_to_login') }}
      </NuxtLinkLocale>
    </div>

    <form v-else class="space-y-6" @submit.prevent="handleForgot">
      <p class="text-sm text-(--color-text-secondary)">
        {{ $t('forgot_password_description') }}
      </p>

      <AuthAlert type="error" :message="error || undefined" />

      <AuthFormInput
        id="email"
        type="email"
        :label="$t('login.email_address')"
        v-model="email"
        required
        autocomplete="email"
        :error="fieldError"
      />

      <AuthSubmitButton
        :loading="loading"
        :text="$t('send_reset_link')"
        :loading-text="$t('sending')"
      />

      <div class="text-center">
        <NuxtLinkLocale
          :to="routes.login()"
          class="text-sm font-medium text-(--color-primary) hover:text-(--color-primary-hover)"
        >
          {{ $t('back_to_login') }}
        </NuxtLinkLocale>
      </div>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
const { forgotPassword, loading } = useAuth()
const routes = useStorefrontRoutes()
const { t } = useI18n()

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useHead({
  title: t('forgot_password.page_title'),
  meta: [
    { name: 'description', content: t('forgot_password.page_description') },
  ],
})

const email = ref('')
const success = ref(false)
const successMessage = ref('')
const error = ref<string | null>(null)
const fieldError = ref<string | undefined>(undefined)

const handleForgot = async () => {
  error.value = null
  fieldError.value = undefined

  try {
    const response = await forgotPassword(email.value)
    success.value = true
    successMessage.value = response?.message || t('password_reset_link_sent')
  } catch (err: any) {
    const errorData = err?.data?.data || err?.data
    if (errorData?.errors?.email) {
      fieldError.value = errorData.errors.email[0]
    } else {
      error.value = errorData?.message || t('failed_to_send_reset_link')
    }
  }
}
</script>
