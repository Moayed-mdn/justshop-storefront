<!-- pages/auth/google/callback.vue -->
<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md text-center">
        <!-- Loading State -->
        <div v-if="!error">
          <div class="flex justify-center">
            <svg class="animate-spin h-10 w-10 text-[#003D29]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p class="mt-4 text-gray-600">Signing you in with Google...</p>
        </div>
  
        <!-- Error State -->
        <div v-else>
          <div class="flex justify-center text-red-500">
            <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="mt-4 text-red-600 font-medium">{{ error }}</p>
          <NuxtLink
            to="/login"
            class="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-[#003D29] rounded-md hover:bg-[#00251C]"
          >
            Back to Login
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  definePageMeta({
    layout: 'auth',
  })
  
  const route = useRoute()
  const { handleGoogleCallback } = useAuth()
  const toast = useToast()
  const error = ref(null)
  
  onMounted(async () => {
    const token = route.query.token
    const errorParam = route.query.error
  
    // Handle error from Laravel
    if (errorParam) {
      error.value = 'Google authentication failed. Please try again.'
      toast.add({
        title: 'Authentication Failed',
        description: 'Could not sign in with Google.',
        color: 'error',
        icon: 'i-heroicons-x-circle',
      })
      return
    }
  
    // Handle missing token
    if (!token) {
      error.value = 'No authentication token received.'
      return
    }
  
    // Process the token
    try {
      await handleGoogleCallback(token)
      toast.add({
        title: 'Welcome!',
        description: 'Signed in with Google successfully.',
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })
    } catch (err) {
      error.value = 'Failed to complete sign-in. Please try again.'
      toast.add({
        title: 'Authentication Failed',
        description: 'Could not complete Google sign-in.',
        color: 'error',
        icon: 'i-heroicons-x-circle',
      })
    }
  })
  </script>