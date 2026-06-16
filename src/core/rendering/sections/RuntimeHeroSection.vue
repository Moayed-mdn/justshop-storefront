<template>
  <section 
    v-if="hasContent" 
    ref="heroSection"
    class="rounded-3xl px-6 py-16 text-[--color-text-inverse] sm:px-10"
    :style="sectionStyle"
  >
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
          class="inline-flex items-center rounded-full bg-[--color-accent] px-5 py-2.5 text-sm font-semibold text-[--color-text-inverse] transition hover:bg-[--color-accent-hover]"
        >
          {{ resolvedCtaText }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'

const localePath = useLocalePath()

type HeroBannerItem = {
  headline?: string
  subheadline?: string
  ctaText?: string
  ctaUrl?: string
  visualType?: string
  imageUrl?: string | null
  gradientFrom?: string | null
  gradientTo?: string | null
}

const props = defineProps<RuntimeSectionComponentProps>()

// Template ref for direct DOM manipulation if needed
const heroSection = ref<HTMLElement | null>(null)

// Track client-side hydration state
const isHydrated = ref(false)

// Ensure client-side hydration is complete
onMounted(() => {
  isHydrated.value = true
  
  // Force re-apply styles after hydration to fix any SSR mismatch
  if (heroSection.value && sectionStyle.value) {
    nextTick(() => {
      if (heroSection.value) {
        Object.assign(heroSection.value.style, sectionStyle.value)
      }
    })
  }
})

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
      visualType: typeof item.visualType === 'string' ? item.visualType : 'image',
      imageUrl: typeof item.imageUrl === 'string' ? item.imageUrl : null,
      gradientFrom: typeof item.gradientFrom === 'string' ? item.gradientFrom : null,
      gradientTo: typeof item.gradientTo === 'string' ? item.gradientTo : null,
    }))
})

const primaryHeroItem = computed(() => heroItems.value[0] ?? null)

const content = computed(() => {
  const value = props.data.content
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
})

// Memoized and stable style computation
const sectionStyle = computed(() => {
  const item = primaryHeroItem.value
  
  if (!item) {
    return { background: 'var(--color-bg-page)' }
  }

  // Gradient type - ensure values are sanitized and stable
  if (item.visualType === 'gradient' && item.gradientFrom && item.gradientTo) {
    const from = String(item.gradientFrom).trim()
    const to = String(item.gradientTo).trim()
    
    // Return stable object structure
    return {
      background: `linear-gradient(135deg, ${from}, ${to})`,
      backgroundImage: `linear-gradient(135deg, ${from}, ${to})` // Fallback for some browsers
    }
  }

  // Image type
  if (item.visualType === 'image' && item.imageUrl) {
    const url = String(item.imageUrl).trim()
    return {
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  }

  // Fallback
  return { background: 'var(--color-bg-inverse)' }
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
  const raw = primaryHeroItem.value?.ctaUrl
    || (typeof props.data.ctaUrl === 'string' ? props.data.ctaUrl : '')

  if (!raw) return ''

  // Only localize internal paths that aren't already locale-prefixed
  if (raw.startsWith('/') && !raw.startsWith('/en/') && !raw.startsWith('/ar/')) {
    return localePath(raw)
  }

  return raw
})

const hasContent = computed(() =>
  Boolean(resolvedEyebrow.value || resolvedHeadline.value || resolvedSubheadline.value)
)
</script>
