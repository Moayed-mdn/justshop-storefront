<template>
  <section class="rounded-3xl bg-[--color-bg-page] px-6 py-16">
    <div class="mx-auto max-w-4xl">
      <div v-if="title || subtitle" class="mb-10 text-center">
        <h2 v-if="title" class="text-3xl font-bold tracking-tight text-[--color-text-primary] sm:text-4xl">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="mt-3 text-base text-[--color-text-secondary] sm:text-lg">
          {{ subtitle }}
        </p>
      </div>

      <!-- Video Container -->
      <div v-if="videoUrl" class="mb-8 overflow-hidden rounded-2xl bg-black shadow-lg">
        <div class="relative w-full" style="padding-bottom: 56.25%">
          <iframe
            v-if="embedUrl"
            :src="embedUrl"
            :title="title || 'Video'"
            class="absolute left-0 top-0 h-full w-full border-none"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
          <video
            v-else
            :src="videoUrl"
            class="absolute left-0 top-0 h-full w-full bg-black"
            controls
            :poster="posterUrl"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <!-- Video description -->
      <div v-if="description" class="text-center">
        <p class="text-sm leading-relaxed text-[--color-text-secondary]">{{ description }}</p>
      </div>

      <p v-if="!videoUrl" class="py-12 text-center text-sm text-[--color-text-secondary]">
        No video available.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'

const props = defineProps<RuntimeSectionComponentProps>()

const title = computed(() => typeof props.data.title === 'string' ? props.data.title : '')
const subtitle = computed(() => typeof props.data.subtitle === 'string' ? props.data.subtitle : '')

const content = computed(() => {
  const c = props.data.content
  return c && typeof c === 'object' && !Array.isArray(c) ? c as Record<string, unknown> : {}
})

const videoUrl = computed(() => 
  typeof content.value.video_url === 'string' ? content.value.video_url : ''
)

const posterUrl = computed(() => 
  typeof content.value.poster_url === 'string' ? content.value.poster_url : undefined
)

const description = computed(() => 
  typeof content.value.description === 'string' ? content.value.description : ''
)

// Convert YouTube/Vimeo URLs to embed URLs
const embedUrl = computed(() => {
  const url = videoUrl.value
  if (!url) return null

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  // If it's already an embed URL or not a recognized format, return null (use native video player)
  if (url.includes('embed') || url.includes('player')) {
    return url
  }

  return null
})
</script>
