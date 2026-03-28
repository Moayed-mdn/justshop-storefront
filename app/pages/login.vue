<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div class="flex flex-col items-center">
        <div class="w-40 mx-auto">
            <NuxtLinkLocale  to="/" class="block w-full h-full">
              <img src="~/assets/icons/logo.png" alt="" class="h-full w-full">
            </NuxtLinkLocale>
        </div>
        <h2 class="mt-4 text-2xl font-bold text-center text-gray-900">Log into your account</h2>
      </div>

      <!-- General Error Alert -->
      <div v-if="errors?.message" class="p-3 text-sm text-red-600 bg-red-50 rounded-md">
        {{ errors.message }}
      </div>

    

      <!-- Prevent default form submission to handle it via JS -->
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
          <div class="mt-1">
            <input 
              id="email" 
              v-model="form.email" 
              type="email" 
              required 
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#003D29] focus:border-[#003D29] sm:text-sm"
            >
            <!-- Laravel specific validation error -->
            <span v-if="errors?.errors?.email" class="text-xs text-red-500">{{ errors.errors.email[0] }}</span>
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1">
            <input 
              id="password" 
              v-model="form.password" 
              type="password" 
              required 
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#003D29] focus:border-[#003D29] sm:text-sm"
            >
            <span v-if="errors?.errors?.password" class="text-xs text-red-500">{{ errors.errors.password[0] }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm">
            <NuxtLink 
              to="/forgot-password" 
              class="font-medium text-[#003D29] hover:text-[#00251C]"
            >
              Forgot password?
            </NuxtLink>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full flex justify-center px-4 py-2 text-sm font-medium text-white 
                   bg-[#003D29] border border-transparent rounded-md shadow-sm 
                   hover:bg-[#00251C] focus:outline-none disabled:opacity-50"
          >
            {{ loading ? 'Signing in...' : 'Log in' }}
          </button>
        </div>
      </form>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 text-gray-500 bg-white">Or</span>
        </div>
      </div>

      <div>
        <button @click="loginWithGoogle" class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
          <img class="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo">
          <span class="ml-2">Sign up with Google</span>
        </button>
      </div>

      <p class="text-sm text-center text-gray-600">
        Don't have an account?
        <NuxtLink 
          to="/register" 
          class="font-medium text-[#003D29] hover:text-[#00251C]"
        >
          Sign Up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth',
  middleware: 'guest',  
})
const { login, loading, loginWithGoogle } = useAuth()
const { loadGuestCart } = useCartStore()
const errors = ref(null)
const toast = useToast()
const form = reactive({
  email: '',
  password: 'password',
})


const handleLogin = async () => {
  errors.value = null // Clear previous errors
  try {
    await login(form)
  } catch (err) {
    // 1. Handle General "Invalid Credentials" Error
    if (err.data?.error) {
      toast.add({
        title: 'Authentication Failed',
        description: err.data.error,
        color: 'error',
        icon: 'i-heroicons-x-circle ',
      })
    } 
    // 2. Fallback for unexpected errors
    else if (!err.data?.errors) {
      toast.add({
        title: 'Authentication Failed',
        description: 'An unexpected error occurred. Please try again.',
        color: 'error',
        icon: 'i-heroicons-x-circle'
      })
    }
    // 3. Handle Field-Specific Validation Errors (Laravel style)
    if (err.data?.errors) {
        errors.value = err.data
      }


  }
}
</script>