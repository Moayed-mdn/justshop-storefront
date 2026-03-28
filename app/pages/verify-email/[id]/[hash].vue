<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)
const error = ref<string | null>(null)
const success = ref(false)
definePageMeta({
  layout: false
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
   
    await $fetch(`/email/verify/${id}/${hash}`, {
      method: 'GET',
      baseURL: 'http://localhost:8000/api/v1/users/auth',
      params: {
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
  <div class="flex items-center justify-center min-h-screen bg-(--color-primary)">
    <div class="p-8 bg-white rounded-lg shadow-md w-96 text-center">
        <div class="flex justify-center py-10 ">
            <img  src="~/assets/icons/logo.png" alt="">
        </div>
      <h1 class="text-2xl font-bold mb-4">Email Verification</h1>
     
      <div v-if="loading">
        <p class="animate-pulse">Checking your email...</p>
      </div>
     
      <div v-else-if="error" class="text-red-500">
        <p class="mb-4">{{ error }}</p>
        <NuxtLink to="/resend-verification" class="text-blue-500 underline">
          Resend Verification Email
        </NuxtLink>
      </div>

      <div v-else-if="success" class="text-green-500">
        <p class="mb-4">Your email has been successfully verified!</p>
        <NuxtLink to="/login" class="bg-blue-600 text-white px-4 py-2 rounded inline-block">
          Go to Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
