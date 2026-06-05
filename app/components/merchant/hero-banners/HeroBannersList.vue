<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!banners || banners.length === 0"
      class="text-center py-12 bg-gray-50 rounded-lg"
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No hero banners</h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by creating a new hero banner.
      </p>
      <div class="mt-6">
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

    <!-- Banners Table -->
    <div v-else class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Position
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Title
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Visual Type
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Created
            </th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="banner in banners" :key="banner.id" :class="{ 'opacity-50': banner.deleted_at }">
            <!-- Position -->
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              {{ banner.position }}
            </td>

            <!-- Title -->
            <td class="px-3 py-4 text-sm text-gray-900">
              <div class="font-medium">
                {{ getTranslation(banner, 'en')?.title || 'No title' }}
              </div>
              <div class="text-gray-500 text-xs mt-1">
                {{ getTranslation(banner, 'ar')?.title || 'بدون عنوان' }}
              </div>
            </td>

            <!-- Visual Type -->
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span
                :class="[
                  'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
                  banner.visual_type === 'image' ? 'bg-blue-100 text-blue-800' :
                  banner.visual_type === 'gradient' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                ]"
              >
                {{ banner.visual_type }}
              </span>
            </td>

            <!-- Status -->
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span
                v-if="banner.deleted_at"
                class="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800"
              >
                Deleted
              </span>
              <span
                v-else-if="banner.is_active"
                class="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800"
              >
                Active
              </span>
              <span
                v-else
                class="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800"
              >
                Inactive
              </span>
            </td>

            <!-- Created Date -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ formatDate(banner.created_at) }}
            </td>

            <!-- Actions -->
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <div class="flex justify-end gap-2">
                <!-- Edit Button -->
                <NuxtLink
                  v-if="!banner.deleted_at"
                  :to="`/merchant/hero-banners/${banner.id}/edit`"
                  class="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </NuxtLink>

                <!-- Delete Button -->
                <button
                  v-if="!banner.deleted_at"
                  type="button"
                  class="text-red-600 hover:text-red-900"
                  @click="$emit('delete', banner.id)"
                >
                  Delete
                </button>

                <!-- Restore Button -->
                <button
                  v-if="banner.deleted_at"
                  type="button"
                  class="text-green-600 hover:text-green-900"
                  @click="$emit('restore', banner.id)"
                >
                  Restore
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeroBanner } from '~/types/heroBanner'

defineProps<{
  banners: HeroBanner[]
  loading: boolean
}>()

defineEmits<{
  'delete': [id: number]
  'restore': [id: number]
}>()

// Get translation for a specific locale
function getTranslation(banner: HeroBanner, locale: string) {
  return banner.translations.find(t => t.locale === locale)
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}
</script>
