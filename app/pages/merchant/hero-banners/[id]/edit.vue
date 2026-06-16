<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="loadingBanner" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="fetchError" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">{{ fetchError }}</p>
        </div>
      </div>
      <div class="mt-4">
        <NuxtLink
          to="/merchant/hero-banners"
          class="text-sm font-medium text-red-600 hover:text-red-500"
        >
          Back to list
        </NuxtLink>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-else>
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
          <h1 class="text-2xl font-bold text-gray-900">Edit Hero Banner</h1>
        </div>
        <p class="text-sm text-gray-700">
          Update hero banner details
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

      <!-- Banner Metadata -->
      <div v-if="banner" class="mb-6 bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="font-medium text-gray-700">Created:</span>
            <span class="ml-2 text-gray-600">{{ formatDate(banner.created_at) }}</span>
          </div>
          <div>
            <span class="font-medium text-gray-700">Updated:</span>
            <span class="ml-2 text-gray-600">{{ formatDate(banner.updated_at) }}</span>
          </div>
          <div v-if="banner.deleted_at">
            <span class="font-medium text-red-700">Deleted:</span>
            <span class="ml-2 text-red-600">{{ formatDate(banner.deleted_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white shadow rounded-lg p-6">
        <HeroBannerForm
          :store-id="STORE_ID"
          :banner="banner"
          :loading="loading"
          :error="error"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { HeroBanner, HeroBannerFormData } from '~/types/heroBanner'
import { useHeroBanners } from '~/composables/useHeroBanners'
import HeroBannerForm from '~/components/merchant/hero-banners/HeroBannerForm.vue'

// TODO: Get actual store ID from auth context
const STORE_ID = 1

const route = useRoute()
const router = useRouter()

const bannerId = computed(() => Number(route.params.id))

const banner = ref<HeroBanner | null>(null)
const loadingBanner = ref(true)
const fetchError = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const {
  loading,
  error,
  fetchBanner,
  updateBanner,
} = useHeroBanners(STORE_ID)

// Fetch banner data on mount
onMounted(async () => {
  loadingBanner.value = true
  fetchError.value = null
  
  try {
    banner.value = await fetchBanner(bannerId.value)
    if (!banner.value) {
      fetchError.value = 'Hero banner not found'
    }
  } catch (err: any) {
    fetchError.value = err.message || 'Failed to load hero banner'
  } finally {
    loadingBanner.value = false
  }
})

// Handle form submission
async function handleSubmit(formData: HeroBannerFormData) {
  const updatedBanner = await updateBanner(bannerId.value, formData)
  
  if (updatedBanner) {
    banner.value = updatedBanner
    successMessage.value = 'Hero banner updated successfully!'
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  }
}

// Format date helper
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>
