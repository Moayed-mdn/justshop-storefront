<!-- pages/auth/google/callback.vue -->
<template>
  <div class="mx-auto max-w-md px-4 py-16 text-center">
    <!-- Loading State -->
    <div v-if="!error">
      <div class="flex justify-center">
        <svg class="animate-spin h-10 w-10 text-(--color-text-secondary)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <p class="mt-4 text-(--color-text-secondary)">Signing you in with Google...</p>
    </div>

    <!-- Error State -->
    <div v-else>
      <div class="flex justify-center text-(--color-danger)">
        <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="mt-4 font-medium text-(--color-danger)">{{ error }}</p>
      <NuxtLinkLocale
        :to="routes.login()"
        class="mt-6 inline-flex items-center gap-2 rounded-(--radius) bg-(--color-primary) px-6 py-2.5 text-sm font-medium text-(--color-primary-foreground) transition-colors hover:opacity-90"
      >
        Back to Login
      </NuxtLinkLocale>
    </div>
  </div>
</template>

<script setup lang="ts">
const routes = useStorefrontRoutes()

definePageMeta({
  layout: 'system',
})

const route = useRoute()
const { handleGoogleCallback } = useAuth()
const { showSuccessToast, showErrorToast } = useAppToast()
const error = ref<string | null>(null)

onMounted(async () => {
  const errorParam = route.query.error

  // Handle error from Laravel
  if (errorParam) {
    error.value = 'Google authentication failed. Please try again.'
    showErrorToast('Could not sign in with Google.')
    return
  }

  // The backend callback establishes the session and then redirects here.
  try {
    await handleGoogleCallback()
    showSuccessToast('Signed in with Google successfully.')
  } catch (err) {
    error.value = 'Failed to complete sign-in. Please try again.'
    showErrorToast('Could not complete Google sign-in.')
  }
})
</script>
