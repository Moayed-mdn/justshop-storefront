<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Error Message -->
    <div v-if="errorMessage" class="rounded-md bg-(--color-error-bg) p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-(--color-error)" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-(--color-error)">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <!-- Visual Type Selector -->
    <VisualTypeSelector
      v-model:visual-type="formData.visual_type"
      v-model:image-path="formData.image_path"
      v-model:gradient-from="formData.gradient_from"
      v-model:gradient-to="formData.gradient_to"
      v-model:video-url="formData.video_url"
      :store-id="storeId"
    />

    <!-- Translation Fields -->
    <div>
      <h3 class="text-lg font-medium text-(--color-text-primary) mb-4">Content Translations</h3>
      <TranslationTabs v-model:translations="formData.translations" />
    </div>

    <!-- Basic Settings -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <!-- Category URL -->
      <div>
        <label for="cat-url" class="block text-sm font-medium text-(--color-text-primary) mb-2">
          Category URL *
        </label>
        <input
          id="cat-url"
          v-model="formData.cat_url"
          type="text"
          required
          placeholder="/shop"
          class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
        />
      </div>

      <!-- Position -->
      <div>
        <label for="position" class="block text-sm font-medium text-(--color-text-primary) mb-2">
          Position *
        </label>
        <input
          id="position"
          v-model.number="formData.position"
          type="number"
          required
          min="0"
          class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
        />
      </div>
    </div>

    <!-- Link Configuration -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-(--color-text-primary)">Link Configuration (Optional)</h3>
      
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <!-- Link URL -->
        <div>
          <label for="link-url" class="block text-sm font-medium text-(--color-text-primary) mb-2">
            Link URL
          </label>
          <input
            id="link-url"
            v-model="formData.link_url"
            type="text"
            placeholder="/shop/category"
            class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          />
        </div>

        <!-- Link Text -->
        <div>
          <label for="link-text" class="block text-sm font-medium text-(--color-text-primary) mb-2">
            Link Text
          </label>
          <input
            id="link-text"
            v-model="formData.link_text"
            type="text"
            placeholder="Shop Now"
            class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          />
        </div>
      </div>

      <!-- Link Target -->
      <div>
        <label class="block text-sm font-medium text-(--color-text-primary) mb-2">
          Link Target
        </label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="formData.link_target"
              type="radio"
              value="_self"
              class="h-4 w-4 text-(--color-primary) focus:ring-(--color-primary)"
            />
            <span class="text-sm text-(--color-text-primary)">Same Tab (_self)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="formData.link_target"
              type="radio"
              value="_blank"
              class="h-4 w-4 text-(--color-primary) focus:ring-(--color-primary)"
            />
            <span class="text-sm text-(--color-text-primary)">New Tab (_blank)</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Schedule -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-(--color-text-primary)">Schedule (Optional)</h3>
      
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <!-- Start Date -->
        <div>
          <label for="starts-at" class="block text-sm font-medium text-(--color-text-primary) mb-2">
            Start Date
          </label>
          <input
            id="starts-at"
            v-model="formData.starts_at"
            type="datetime-local"
            class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          />
        </div>

        <!-- End Date -->
        <div>
          <label for="ends-at" class="block text-sm font-medium text-(--color-text-primary) mb-2">
            End Date
          </label>
          <input
            id="ends-at"
            v-model="formData.ends_at"
            type="datetime-local"
            class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          />
        </div>
      </div>
    </div>

    <!-- Active Status -->
    <div class="flex items-center gap-2">
      <input
        id="is-active"
        v-model="formData.is_active"
        type="checkbox"
        class="h-4 w-4 rounded text-(--color-primary) focus:ring-(--color-primary)"
      />
      <label for="is-active" class="text-sm font-medium text-(--color-text-primary)">
        Active (visible on storefront)
      </label>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end gap-3 pt-6 border-t">
      <NuxtLink
        to="/merchant/hero-banners"
        class="px-4 py-2 text-sm font-medium text-(--color-text-primary) bg-white border border-(--color-border-default) rounded-md hover:bg-(--color-bg-hover) focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-primary)"
      >
        Cancel
      </NuxtLink>
      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) border border-transparent rounded-md hover:bg-(--color-primary-hover) focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-primary) disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        </span>
        <span v-else>{{ isEdit ? 'Update' : 'Create' }} Banner</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { HeroBanner, HeroBannerFormData } from '~/types/heroBanner'
import VisualTypeSelector from './VisualTypeSelector.vue'
import TranslationTabs from './TranslationTabs.vue'

const props = defineProps<{
  banner?: HeroBanner
  loading?: boolean
  error?: string | null
  storeId: number
}>()

const emit = defineEmits<{
  'submit': [data: HeroBannerFormData]
}>()

const isEdit = computed(() => !!props.banner)
const errorMessage = ref(props.error)

// Form data with defaults
const formData = ref<HeroBannerFormData>({
  cat_url: '/shop',
  position: 0,
  visual_type: 'image',
  image_path: '',
  gradient_from: '#ec8d8d',
  gradient_to: '#6669cc',
  video_url: '',
  link_url: '',
  link_text: '',
  link_target: '_self',
  is_active: true,
  starts_at: '',
  ends_at: '',
  translations: [
    { locale: 'en', title: '', subtitle: '', cta_text: '' },
    { locale: 'ar', title: '', subtitle: '', cta_text: '' },
  ],
})

// Initialize form with existing banner data
function initializeForm() {
  if (props.banner) {
    formData.value = {
      cat_url: props.banner.cat_url,
      position: props.banner.position,
      visual_type: props.banner.visual_type,
      image_path: props.banner.image_path || '',
      gradient_from: props.banner.gradient_from || '#ec8d8d',
      gradient_to: props.banner.gradient_to || '#6669cc',
      video_url: props.banner.video_url || '',
      link_url: props.banner.link_url || '',
      link_text: props.banner.link_text || '',
      link_target: props.banner.link_target || '_self',
      is_active: props.banner.is_active,
      starts_at: props.banner.starts_at ? formatDateForInput(props.banner.starts_at) : '',
      ends_at: props.banner.ends_at ? formatDateForInput(props.banner.ends_at) : '',
      translations: props.banner.translations.map(t => ({
        locale: t.locale,
        title: t.title,
        subtitle: t.subtitle || '',
        cta_text: t.cta_text || '',
      })),
    }
  }
}

// Format ISO date string to datetime-local input format
function formatDateForInput(isoString: string): string {
  const date = new Date(isoString)
  return date.toISOString().slice(0, 16)
}

// Handle form submission
function handleSubmit() {
  // Validate translations
  const hasEnglishTitle = formData.value.translations.some(
    t => t.locale === 'en' && t.title
  )
  const hasArabicTitle = formData.value.translations.some(
    t => t.locale === 'ar' && t.title
  )

  if (!hasEnglishTitle || !hasArabicTitle) {
    errorMessage.value = 'Please provide titles for both English and Arabic'
    return
  }

  errorMessage.value = null
  emit('submit', formData.value)
}

// Watch for banner prop changes
watch(() => props.banner, () => {
  initializeForm()
}, { immediate: true })

// Watch for error prop changes
watch(() => props.error, (newError) => {
  errorMessage.value = newError
})
</script>
