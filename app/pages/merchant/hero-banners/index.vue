<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Hero Banners</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage hero banners for your store's homepage
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/merchant/hero-banners/create"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Banner
        </NuxtLink>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <HeroBannerFilters
      v-model="filters"
      @filter-change="handleFilterChange"
    />

    <!-- Banners List -->
    <HeroBannersList
      :banners="banners"
      :loading="loading"
      @delete="handleDelete"
      @restore="handleRestore"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { HeroBannersFilters } from '~/types/heroBanner'
import { useHeroBanners } from '~/app/composables/useHeroBanners'
import HeroBannerFilters from '~/app/components/merchant/hero-banners/HeroBannerFilters.vue'
import HeroBannersList from '~/app/components/merchant/hero-banners/HeroBannersList.vue'

// TODO: Get actual store ID from auth context
// For now, using store ID 1 as default
const STORE_ID = 1

const filters = ref<HeroBannersFilters>({
  status: 'all',
  search: '',
})

const {
  banners,
  loading,
  error,
  fetchBanners,
  deleteBanner,
  restoreBanner,
} = useHeroBanners(STORE_ID)

// Fetch banners on mount
onMounted(() => {
  fetchBanners(filters.value)
})

// Handle filter changes
function handleFilterChange(newFilters: HeroBannersFilters) {
  fetchBanners(newFilters)
}

// Handle delete
async function handleDelete(bannerId: number) {
  if (!confirm('Are you sure you want to delete this banner?')) {
    return
  }

  const success = await deleteBanner(bannerId)
  if (success) {
    // Refresh list
    await fetchBanners(filters.value)
  }
}

// Handle restore
async function handleRestore(bannerId: number) {
  const success = await restoreBanner(bannerId)
  if (success) {
    // Refresh list
    await fetchBanners(filters.value)
  }
}
</script>
