<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes'

const routes = useStorefrontRoutes()
const route = useRoute()
const loading = ref(true)
const error = ref<string | null>(null)
const success = ref(false)
const api = useApi()
definePageMeta({
  layout: 'auth'
})
onMounted(async () => {
 
  const id = route.params.id
  const hash = route.params.hash
  const expires = route.query.expires
  const signature = route.query.signature

 
  if (!id || !hash || !expires || !signature) {
    error.value = 'Verification link is incomplete or invalid.'
    loading.value = false
    return
  }

  try {
    await api(API_ROUTES.auth.emailVerify(id as string, hash as string), {
      query: {
        expires,
        signature,
      },
    })
    
   
    success.value = true
  } catch (err: any) {
   
    console.error('Verification Error:', err)
    
    if (err.data && err.data.message) {
      error.value = err.data.message
    } else {
      error.value = 'An error occurred while trying to verify your account. Please try again later.'
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AuthCard>
    <AuthHeader title="Email Verification" />

    <div v-if="loading" class="text-center">
      <p class="animate-pulse">Checking your email...</p>
    </div>

    <div v-else-if="error" class="text-center text-(--color-error)">
      <p class="mb-4">{{ error }}</p>
      <NuxtLinkLocale :to="routes.register()" class="text-(--color-info) underline">
        Resend Verification Email
      </NuxtLinkLocale>
    </div>

    <div v-else-if="success" class="text-center text-(--color-success)">
      <p class="mb-4">Your email has been successfully verified!</p>
      <NuxtLinkLocale :to="routes.login()" class="bg-(--color-primary) text-(--color-on-primary) px-4 py-2 rounded inline-block">
        Go to Login
      </NuxtLinkLocale>
    </div>
  </AuthCard>
</template>
