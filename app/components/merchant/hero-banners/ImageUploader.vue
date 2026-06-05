<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>

    <!-- Upload Area -->
    <div
      v-if="!previewUrl"
      class="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
      :class="{ 'border-blue-500 bg-blue-50': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        class="hidden"
        @change="handleFileSelect"
      />

      <div class="flex flex-col items-center">
        <svg
          class="w-12 h-12 text-gray-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p class="text-sm text-gray-600 mb-1">
          <span class="font-semibold text-blue-600">Click to upload</span>
          or drag and drop
        </p>
        <p class="text-xs text-gray-500">
          PNG, JPG, GIF, WEBP up to 5MB
        </p>
      </div>

      <!-- Upload Progress -->
      <div v-if="uploading" class="mt-4">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          />
        </div>
        <p class="text-xs text-gray-600 mt-1">Uploading... {{ uploadProgress }}%</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-4 text-sm text-red-600">
        {{ error }}
      </div>
    </div>

    <!-- Preview Area -->
    <div v-else class="relative">
      <div class="relative border-2 border-gray-200 rounded-lg overflow-hidden">
        <img
          :src="previewUrl"
          alt="Preview"
          class="w-full h-48 object-cover"
        />
        <button
          type="button"
          class="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
          @click="handleRemove"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-2">
        Path: {{ modelValue }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { uploadHeroBannerImage, deleteHeroBannerImage } from '~/utils/api/heroBanners'

const props = defineProps<{
  modelValue: string
  label?: string
  storeId: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref<string | null>(null)

// Compute preview URL
const previewUrl = computed(() => {
  if (!props.modelValue) return null
  
  // If it's already a full URL, use it
  if (props.modelValue.startsWith('http')) {
    return props.modelValue
  }
  
  // Otherwise construct the URL from APP_URL + storage path
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:8000/api/v1'
  const appUrl = apiBase.replace('/api/v1', '')
  return `${appUrl}/storage/${props.modelValue}`
})

// Trigger file input click
function triggerFileInput() {
  if (!uploading.value) {
    fileInput.value?.click()
  }
}

// Handle file selection
async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    await uploadFile(file)
  }
}

// Handle drag and drop
async function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    await uploadFile(file)
  } else {
    error.value = 'Please drop an image file'
  }
}

// Upload file
async function uploadFile(file: File) {
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'File size must be less than 5MB'
    return
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    error.value = 'Only JPG, PNG, GIF, and WEBP images are allowed'
    return
  }

  error.value = null
  uploading.value = true
  uploadProgress.value = 0

  try {
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)

    const response = await uploadHeroBannerImage(props.storeId, file)

    clearInterval(progressInterval)
    uploadProgress.value = 100

    // Emit the path (not the full URL)
    emit('update:modelValue', response.data.path)

    // Reset progress after a short delay
    setTimeout(() => {
      uploading.value = false
      uploadProgress.value = 0
    }, 500)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Upload failed. Please try again.'
    uploading.value = false
    uploadProgress.value = 0
  }
}

// Handle remove
async function handleRemove() {
  if (!props.modelValue) return

  const confirmed = confirm('Are you sure you want to remove this image?')
  if (!confirmed) return

  try {
    // Delete from server if it's a stored path
    if (!props.modelValue.startsWith('http')) {
      await deleteHeroBannerImage(props.storeId, props.modelValue)
    }

    // Clear the value
    emit('update:modelValue', '')
    error.value = null
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to delete image'
  }
}

// Watch for external changes to model value
watch(() => props.modelValue, () => {
  error.value = null
})
</script>
