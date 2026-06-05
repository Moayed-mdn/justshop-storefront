<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <NuxtLink
          to="/merchant/hero-banners"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">Create Hero Banner</h1>
      </div>
      <p class="text-sm text-gray-700">
        Create a new hero banner for your store's homepage
      </p>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="mb-6 rounded-md bg-green-50 p-4">
      <div class="flex">
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <div class="bg-white shadow rounded-lg p-6">
      <HeroBannerForm
        :store-id="STORE_ID"
        :loading="loading"
        :error="error"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { HeroBannerFormData } from '~/types/heroBanner'
import { useHeroBanners } from '~/app/composables/useHeroBanners'
import HeroBannerForm from '~/app/components/merchant/hero-banners/HeroBannerForm.vue'

// TODO: Get actual store ID from auth context
const STORE_ID = 1

const router = useRouter()
const successMessage = ref<string | null>(null)

const {
  loading,
  error,
  createBanner,
} = useHeroBanners(STORE_ID)

// Handle form submission
async function handleSubmit(formData: HeroBannerFormData) {
  const banner = await createBanner(formData)
  
  if (banner) {
    successMessage.value = 'Hero banner created successfully!'
    
    // Redirect to list page after 1 second
    setTimeout(() => {
      router.push('/merchant/hero-banners')
    }, 1000)
  }
}
</script>
