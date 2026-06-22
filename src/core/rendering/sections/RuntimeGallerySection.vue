<template>
  <section class="rounded-3xl bg-[--color-bg-page] px-6 py-16">
    <div class="mx-auto max-w-7xl">
      <div v-if="title || subtitle" class="mb-12 text-center">
        <h2 v-if="title" class="text-3xl font-bold tracking-tight text-[--color-text-primary] sm:text-4xl">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="mt-3 text-base text-[--color-text-secondary] sm:text-lg">
          {{ subtitle }}
        </p>
      </div>

      <!-- Gallery Grid -->
      <div v-if="members.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(member, index) in members"
          :key="index"
          class="flex flex-col items-center rounded-2xl border border-[--color-border-default] bg-[--color-bg-card] p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <!-- Image -->
          <div class="mb-5 h-32 w-32 flex-shrink-0 overflow-hidden rounded-full">
            <img
              v-if="member.image"
              :src="member.image"
              :alt="member.name"
              loading="lazy"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-[--color-primary] to-[--color-primary] text-white">
              <span class="text-3xl font-bold">{{ getInitials(member.name) }}</span>
            </div>
          </div>

          <!-- Info -->
          <div class="flex flex-col gap-2">
            <h3 class="text-lg font-semibold text-[--color-text-primary]">{{ member.name }}</h3>
            <p v-if="member.role" class="text-sm font-medium text-[--color-primary]">{{ member.role }}</p>
            <p v-if="showBio && member.bio" class="text-sm leading-relaxed text-[--color-text-secondary]">{{ member.bio }}</p>
          </div>
        </article>
      </div>

      <p v-else class="py-12 text-center text-sm text-[--color-text-secondary]">
        No gallery items available.
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

const settings = computed(() => {
  const s = props.data.settings
  return s && typeof s === 'object' && !Array.isArray(s) ? s as Record<string, unknown> : {}
})

const showBio = computed(() => settings.value.show_bio !== false)

type GalleryMember = {
  name: string
  role?: string
  bio?: string
  image?: string | null
}

const members = computed<GalleryMember[]>(() => {
  const arr = content.value.members
  if (!Array.isArray(arr)) return []
  return arr.filter((item): item is GalleryMember =>
    item !== null &&
    typeof item === 'object' &&
    'name' in item &&
    typeof item.name === 'string'
  )
})

const getInitials = (name: string): string => {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
</script>
