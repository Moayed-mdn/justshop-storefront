<template>
  <div class="space-y-4">
    <!-- Visual Type Selector -->
    <div>
      <label class="block text-sm font-medium text-(--color-text-primary) mb-2">
        Visual Type *
      </label>
      <div class="flex gap-4">
        <label
          v-for="type in visualTypes"
          :key="type.value"
          class="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            :value="type.value"
            :checked="localVisualType === type.value"
            class="h-4 w-4 text-(--color-primary) focus:ring-(--color-primary)"
            @change="handleVisualTypeChange(type.value)"
          />
          <span class="text-sm text-(--color-text-primary)">{{ type.label }}</span>
        </label>
      </div>
    </div>

    <!-- Image Upload (shown when visual_type is 'image') -->
    <div v-if="localVisualType === 'image'" class="space-y-2">
      <GenericImageUploader
        v-model="localImagePath"
        label="Hero Banner Image"
        :store-id="storeId"
        context="hero"
        @update:model-value="emitValues"
      />
    </div>

    <!-- Gradient Colors (shown when visual_type is 'gradient') -->
    <div v-if="localVisualType === 'gradient'" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="gradient-from" class="block text-sm font-medium text-(--color-text-primary) mb-2">
            Gradient Start Color
          </label>
          <div class="flex items-center gap-2">
            <input
              id="gradient-from"
              v-model="localGradientFrom"
              type="color"
              class="h-10 w-20 rounded cursor-pointer"
              @input="emitValues"
            />
            <input
              v-model="localGradientFrom"
              type="text"
              placeholder="#000000"
              class="flex-1 rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
              @input="emitValues"
            />
          </div>
        </div>
        
        <div>
          <label for="gradient-to" class="block text-sm font-medium text-(--color-text-primary) mb-2">
            Gradient End Color
          </label>
          <div class="flex items-center gap-2">
            <input
              id="gradient-to"
              v-model="localGradientTo"
              type="color"
              class="h-10 w-20 rounded cursor-pointer"
              @input="emitValues"
            />
            <input
              v-model="localGradientTo"
              type="text"
              placeholder="#ffffff"
              class="flex-1 rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
              @input="emitValues"
            />
          </div>
        </div>
      </div>
      
      <!-- Gradient Preview -->
      <div class="mt-4">
        <p class="text-sm font-medium text-(--color-text-primary) mb-2">Preview:</p>
        <div
          class="h-32 rounded-lg"
          :style="{
            background: `linear-gradient(135deg, ${localGradientFrom || '#000000'}, ${localGradientTo || '#ffffff'})`
          }"
        />
      </div>
    </div>

    <!-- Video URL Input (shown when visual_type is 'video') -->
    <div v-if="localVisualType === 'video'" class="space-y-2">
      <label for="video-url" class="block text-sm font-medium text-(--color-text-primary)">
        Video URL
      </label>
      <input
        id="video-url"
        v-model="localVideoUrl"
        type="url"
        placeholder="https://example.com/video.mp4"
        class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
        @input="emitValues"
      />
      <p class="text-xs text-(--color-text-secondary)">
        Enter a full URL to the video file
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { VisualType } from '~/types/heroBanner'
import GenericImageUploader from '~/components/merchant/shared/GenericImageUploader.vue'

const props = defineProps<{
  visualType: VisualType
  imagePath?: string
  gradientFrom?: string
  gradientTo?: string
  videoUrl?: string
  storeId: number
}>()

const emit = defineEmits<{
  'update:visualType': [value: VisualType]
  'update:imagePath': [value: string]
  'update:gradientFrom': [value: string]
  'update:gradientTo': [value: string]
  'update:videoUrl': [value: string]
}>()

const visualTypes = [
  { value: 'image' as VisualType, label: 'Image' },
  { value: 'gradient' as VisualType, label: 'Gradient' },
  { value: 'video' as VisualType, label: 'Video' },
]

// Local state
const localVisualType = ref<VisualType>(props.visualType || 'image')
const localImagePath = ref(props.imagePath || '')
const localGradientFrom = ref(props.gradientFrom || '#ec8d8d')
const localGradientTo = ref(props.gradientTo || '#6669cc')
const localVideoUrl = ref(props.videoUrl || '')

// Handle visual type change
function handleVisualTypeChange(type: VisualType) {
  localVisualType.value = type
  emitValues()
}

// Emit all values
function emitValues() {
  emit('update:visualType', localVisualType.value)
  emit('update:imagePath', localImagePath.value)
  emit('update:gradientFrom', localGradientFrom.value)
  emit('update:gradientTo', localGradientTo.value)
  emit('update:videoUrl', localVideoUrl.value)
}

// Watch for external changes
watch(() => props.visualType, (newType) => {
  localVisualType.value = newType
})

watch(() => props.imagePath, (newPath) => {
  localImagePath.value = newPath || ''
})

watch(() => props.gradientFrom, (newColor) => {
  localGradientFrom.value = newColor || '#ec8d8d'
})

watch(() => props.gradientTo, (newColor) => {
  localGradientTo.value = newColor || '#6669cc'
})

watch(() => props.videoUrl, (newUrl) => {
  localVideoUrl.value = newUrl || ''
})
</script>
