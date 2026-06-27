<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-(--color-primary)"></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!banners || banners.length === 0"
      class="text-center py-12 bg-(--color-bg-secondary) rounded-lg"
    >
      <svg
        class="mx-auto h-12 w-12 text-(--color-text-secondary)"
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
      <h3 class="mt-2 text-sm font-medium text-(--color-text-primary)">No hero banners</h3>
      <p class="mt-1 text-sm text-(--color-text-secondary)">
        Get started by creating a new hero banner.
      </p>
      <div class="mt-6">
        <NuxtLink
          to="/merchant/hero-banners/create"
          :style="{ backgroundColor: primary, color: onPrimary }"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 hover-primary-link"
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
      <table class="min-w-full divide-y divide-(--color-border-default)">
        <thead class="bg-(--color-bg-secondary)">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-(--color-text-primary) sm:pl-6">
              Position
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-(--color-text-primary)">
              Title
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-(--color-text-primary)">
              Visual Type
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-(--color-text-primary)">
              Status
            </th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-(--color-text-primary)">
              Created
            </th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-(--color-border-default) bg-white">
          <tr v-for="banner in banners" :key="banner.id" :class="{ 'opacity-50': banner.deleted_at }">
            <!-- Position -->
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-(--color-text-primary) sm:pl-6">
              {{ banner.position }}
            </td>

            <!-- Title -->
            <td class="px-3 py-4 text-sm text-(--color-text-primary)">
              <div class="font-medium">
                {{ getTranslation(banner, 'en')?.title || 'No title' }}
              </div>
              <div class="text-(--color-text-secondary) text-xs mt-1">
                {{ getTranslation(banner, 'ar')?.title || 'بدون عنوان' }}
              </div>
            </td>

            <!-- Visual Type -->
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span
                :class="[
                  'inline-flex rounded-full px-2 py-1 text-xs font-semibold',
                  banner.visual_type === 'image' ? 'bg-(--color-info-bg) text-(--color-info)' :
                  banner.visual_type === 'gradient' ? 'bg-purple-100 text-purple-800' :
                  'bg-(--color-success-bg) text-(--color-success)'
                ]"
              >
                {{ banner.visual_type }}
              </span>
            </td>

            <!-- Status -->
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span
                v-if="banner.deleted_at"
                class="inline-flex rounded-full bg-(--color-error-bg) px-2 py-1 text-xs font-semibold text-(--color-error)"
              >
                Deleted
              </span>
              <span
                v-else-if="banner.is_active"
                class="inline-flex rounded-full bg-(--color-success-bg) px-2 py-1 text-xs font-semibold text-(--color-success)"
              >
                Active
              </span>
              <span
                v-else
                class="inline-flex rounded-full bg-(--color-bg-secondary) px-2 py-1 text-xs font-semibold text-(--color-text-secondary)"
              >
                Inactive
              </span>
            </td>

            <!-- Created Date -->
            <td class="whitespace-nowrap px-3 py-4 text-sm text-(--color-text-secondary)">
              {{ formatDate(banner.created_at) }}
            </td>

            <!-- Actions -->
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <div class="flex justify-end gap-2">
                <!-- Edit Button -->
                <NuxtLink
                  v-if="!banner.deleted_at"
                  :to="`/merchant/hero-banners/${banner.id}/edit`"
                  class="text-(--color-primary) hover:text-(--color-primary-hover)"
                >
                  Edit
                </NuxtLink>

                <!-- Delete Button -->
                <button
                  v-if="!banner.deleted_at"
                  type="button"
                  class="text-(--color-error) hover:text-(--color-error-hover)"
                  @click="$emit('delete', banner.id)"
                >
                  Delete
                </button>

                <!-- Restore Button -->
                <button
                  v-if="banner.deleted_at"
                  type="button"
                  class="text-(--color-success) hover:text-(--color-success-hover)"
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

// Inline theme colors for SSR compatibility
const getCSSVar = (varName: string, fallback: string): string => {
  if (!process.client) return fallback
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    return value || fallback
  } catch {
    return fallback
  }
}

const primary = computed(() => getCSSVar('--color-primary', '#3b82f6'))
const onPrimary = computed(() => getCSSVar('--color-on-primary', '#ffffff'))

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

<style scoped>
.hover-primary-link:hover {
  filter: brightness(0.9);
}
</style>
