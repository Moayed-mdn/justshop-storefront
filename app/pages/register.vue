<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div class="flex flex-col items-center">
        <div class="w-40 mx-auto">
            <NuxtLinkLocale  to="/" class="block w-full h-full">
              <img src="~/assets/icons/logo.png" alt="" class="h-full w-full">
            </NuxtLinkLocale>
        </div>
        <h2 class="mt-6 text-2xl font-bold text-center text-gray-900">Create your account</h2>
      </div>

      <!-- General Error Alert -->
      <div v-if="errors?.message && !errors?.errors" class="p-3 text-sm text-red-600 bg-red-50 rounded-md">
        {{ errors.message }}
      </div>

      <!-- Success Message Alert -->
      <div v-if="successMessage" class="p-3 text-sm text-green-600 bg-green-50 rounded-md">
        {{ successMessage }}
      </div>

      <form class="space-y-6" @submit.prevent="handleRegister">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <div class="mt-1">
            <input id="name" v-model="form.name" type="text" required class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
            <span v-if="errors?.name" class="text-xs text-red-500">{{ errors.name[0] }}</span>
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
          <div class="mt-1">
            <input id="email" v-model="form.email" type="email" required class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
            <span v-if="errors?.email" class="text-xs text-red-500">{{ errors.email[0] }}</span>
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="mt-1">
            <input id="password" v-model="form.password" type="password" required class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
            <span v-if="errors?.password" class="text-xs text-red-500">{{ errors.password[0] }}</span>
          </div>
        </div>

        <div>
          <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <div class="mt-1">
            <input id="password_confirmation" v-model="form.password_confirmation" type="password" required class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
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
          {{ loading ? 'Creating account...' : 'Register' }}
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
        Already have an account?
        <NuxtLink to="/login" class="font-medium text-brand-600 hover:text-brand-500">Log in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth',
  middleware: 'guest',  // ← add this
})

const { register, loading, loginWithGoogle } = useAuth()
const errors = ref(null)
const successMessage = ref(null)
const toast = useToast()
const form = reactive({
  name: '',
  email: '',
  password: 'password',
  password_confirmation: 'password'
})

const handleRegister = async () => {
  errors.value = null // Clear previous errors
  successMessage.value = null
  try {
    const response = await register(form)
    if (response.message) {
      successMessage.value = response.message
      toast.add({
        title: 'Registration Successful',
        description: response.message,
        color: 'success',
        icon: 'i-heroicons-check-circle'
      })
      // Reset form
      form.name = ''
      form.email = ''
      form.password = ''
      form.password_confirmation = ''
    }
  } catch (err) {
    errors.value = err.data?.errors
    // Handle Field-Specific Validation Errors
    if (err.data?.errors) {
      errors.value = err.data?.errors
    } 
    // Handle General Error
   if (err.data?.message) {
    toast.add({
      title: 'Registration Failed',
      description: err.data.message,
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  }
    // Fallback for unexpected errors
    else {
      toast.add({
        title: 'Registration Failed',
        description: 'An unexpected error occurred. Please try again.',
        color: 'error',
        icon: 'i-heroicons-x-circle'
      })
    }
  }
}
</script>