<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-(--color-text-primary)">
      {{ label }}
    </label>

    <!-- Upload Area -->
    <div
      v-if="!previewUrl"
      class="relative border-2 border-dashed border-(--color-border-default) rounded-lg p-6 text-center hover:border-(--color-border-hover) transition-colors cursor-pointer"
      :class="{ 'border-(--color-primary) bg-(--color-primary-bg)': isDragging }"
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
          class="w-12 h-12 text-(--color-text-secondary) mb-3"
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
        <p class="text-sm text-(--color-text-secondary) mb-1">
          <span class="font-semibold text-(--color-primary)">Click to upload</span>
          or drag and drop
        </p>
        <p class="text-xs text-(--color-text-secondary)">
          PNG, JPG, GIF, WEBP up to 5MB
        </p>
      </div>

      <!-- Upload Progress -->
      <div v-if="uploading" class="mt-4">
        <div class="w-full bg-(--color-bg-secondary) rounded-full h-2">
          <div
            class="bg-(--color-primary) h-2 rounded-full transition-all duration-300"
            :style="{ width: `${uploadProgress}%` }"
          />
        </div>
        <p class="text-xs text-(--color-text-secondary) mt-1">Uploading... {{ uploadProgress }}%</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mt-4 text-sm text-(--color-error)">
        {{ error }}
      </div>
    </div>

    <!-- Preview Area -->
    <div v-else class="relative">
      <div class="relative border-2 border-(--color-border-default) rounded-lg overflow-hidden">
        <img
          :src="previewUrl"
          alt="Preview"
          class="w-full h-48 object-cover"
        />
        <button
          type="button"
          class="absolute top-2 right-2 p-2 bg-(--color-error) text-white rounded-full hover:bg-(--color-error-hover) transition-colors shadow-lg"
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
      <p class="text-xs text-(--color-text-secondary) mt-2">
        Path: {{ modelValue }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { uploadImage, deleteImage, type MediaContext } from '~/utils/api/media'

const props = defineProps<{
  modelValue: string
  label?: string
  storeId: number
  context: MediaContext
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
  return `${config.public.appUrl}/storage/${props.modelValue}`
})

// Watch for external changes to modelValue
watch(() => props.modelValue, () => {
  error.value = null
})

// Trigger file input
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Handle file selection
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadFile(file)
  }
}

// Handle file drop
const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    uploadFile(file)
  }
}

// Validate file
const validateFile = (file: File): string | null => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    return 'Please upload a valid image file (JPEG, PNG, GIF, or WEBP)'
  }

  if (file.size > maxSize) {
    return 'Image size must not exceed 5MB'
  }

  return null
}

// Upload file
const uploadFile = async (file: File) => {
  error.value = null

  // Validate file
  const validationError = validateFile(file)
  if (validationError) {
    error.value = validationError
    return
  }

  try {
    uploading.value = true
    uploadProgress.value = 0

    // Simulate progress (since we don't have real progress from fetch)
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)

    const response = await uploadImage(props.storeId, props.context, file)

    clearInterval(progressInterval)
    uploadProgress.value = 100

    // Emit the path to parent
    emit('update:modelValue', response.data.path)

    // Reset progress after a short delay
    setTimeout(() => {
      uploading.value = false
      uploadProgress.value = 0
    }, 500)
  } catch (err: any) {
    // Error message is now extracted in the API function
    error.value = err.message || 'Upload failed. Please try again.'
    uploading.value = false
    uploadProgress.value = 0
  }
}

// Handle remove
const handleRemove = async () => {
  if (!confirm('Are you sure you want to delete this image?')) {
    return
  }

  try {
    await deleteImage(props.storeId, props.context, props.modelValue)
    emit('update:modelValue', '')
  } catch (err: any) {
    // Error message is now extracted in the API function
    error.value = err.message || 'Delete failed. Please try again.'
  }
}
</script>
