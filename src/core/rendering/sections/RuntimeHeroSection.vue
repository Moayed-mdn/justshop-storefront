<template>
  <section v-if="hasContent" class="rounded-3xl bg-[--color-bg-inverse] px-6 py-16 text-[--color-text-inverse] sm:px-10">
    <div class="mx-auto max-w-4xl">
      <p v-if="resolvedEyebrow" class="text-sm font-semibold uppercase tracking-[0.2em] text-[--color-text-inverse] opacity-90">
        {{ resolvedEyebrow }}
      </p>
      <h1 class="mt-3 text-4xl font-bold tracking-tight text-[--color-text-inverse] sm:text-5xl">
        {{ resolvedHeadline }}
      </h1>
      <p v-if="resolvedSubheadline" class="mt-4 max-w-2xl text-base text-[--color-text-inverse] opacity-90 sm:text-lg">
        {{ resolvedSubheadline }}
      </p>
      <div v-if="resolvedCtaText && resolvedCtaUrl" class="mt-8">
        <NuxtLink
          :to="resolvedCtaUrl"
          class="inline-flex items-center rounded-full bg-[--color-accent] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[--color-accent-hover]"
        >
          {{ resolvedCtaText }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'

type HeroBannerItem = {
  headline?: string
  subheadline?: string
  ctaText?: string
  ctaUrl?: string
}

const props = defineProps<RuntimeSectionComponentProps>()

const heroItems = computed<HeroBannerItem[]>(() => {
  if (!Array.isArray(props.data.items)) {
    return []
  }

  return props.data.items
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item))
    .map((item) => ({
      headline: typeof item.headline === 'string' ? item.headline : undefined,
      subheadline: typeof item.subheadline === 'string' ? item.subheadline : undefined,
      ctaText: typeof item.ctaText === 'string' ? item.ctaText : undefined,
      ctaUrl: typeof item.ctaUrl === 'string' ? item.ctaUrl : undefined,
    }))
})

const primaryHeroItem = computed(() => heroItems.value[0] ?? null)

const content = computed(() => {
  const value = props.data.content
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
})

const resolvedEyebrow = computed(() => {
  if (typeof props.data.eyebrow === 'string' && props.data.eyebrow.length > 0) {
    return props.data.eyebrow
  }

  const value = content.value.eyebrow
  return typeof value === 'string' ? value : ''
})

const resolvedHeadline = computed(() => {
  if (primaryHeroItem.value?.headline) {
    return primaryHeroItem.value.headline
  }

  if (typeof props.data.headline === 'string' && props.data.headline.length > 0) {
    return props.data.headline
  }

  if (typeof props.data.title === 'string' && props.data.title.length > 0) {
    return props.data.title
  }

  const value = content.value.headline
  return typeof value === 'string' ? value : ''
})

const resolvedSubheadline = computed(() => {
  if (primaryHeroItem.value?.subheadline) {
    return primaryHeroItem.value.subheadline
  }

  if (typeof props.data.subheadline === 'string' && props.data.subheadline.length > 0) {
    return props.data.subheadline
  }

  if (typeof props.data.subtitle === 'string' && props.data.subtitle.length > 0) {
    return props.data.subtitle
  }

  const value = content.value.subheadline
  return typeof value === 'string' ? value : ''
})

const resolvedCtaText = computed(() => {
  if (primaryHeroItem.value?.ctaText) {
    return primaryHeroItem.value.ctaText
  }

  return typeof props.data.ctaText === 'string' ? props.data.ctaText : ''
})

const resolvedCtaUrl = computed(() => {
  if (primaryHeroItem.value?.ctaUrl) {
    return primaryHeroItem.value.ctaUrl
  }

  return typeof props.data.ctaUrl === 'string' ? props.data.ctaUrl : ''
})

const hasContent = computed(() =>
  Boolean(resolvedEyebrow.value || resolvedHeadline.value || resolvedSubheadline.value)
)
</script>
