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

      <!-- Testimonials Grid -->
      <div v-if="testimonials.length" class="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(testimonial, index) in testimonials"
          :key="index"
          class="rounded-2xl border border-[--color-border-default] bg-[--color-bg-card] p-7 transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <!-- Rating stars -->
          <div v-if="showRating && testimonial.rating" class="mb-4 flex gap-1">
            <span
              v-for="star in 5"
              :key="star"
              class="text-lg"
              :class="star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'"
            >
              ★
            </span>
          </div>

          <!-- Quote -->
          <blockquote class="mb-6 text-sm leading-relaxed text-[--color-text-primary]">
            "{{ testimonial.quote }}"
          </blockquote>

          <!-- Author info -->
          <div class="flex items-center gap-3.5">
            <div v-if="testimonial.avatar" class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-[--color-bg-page]">
              <img :src="testimonial.avatar" :alt="testimonial.author" class="h-full w-full object-cover" />
            </div>
            <div class="flex flex-col gap-0.5">
              <cite class="text-sm font-semibold not-italic text-[--color-text-primary]">{{ testimonial.author }}</cite>
              <span v-if="testimonial.role" class="text-xs text-[--color-text-secondary]">
                {{ testimonial.role }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Aggregate stats -->
      <div v-if="aggregate" class="flex flex-col items-center gap-2 rounded-2xl border border-[--color-border-default] bg-[--color-bg-card] px-6 py-8">
        <div class="flex items-center gap-3">
          <span class="text-5xl font-bold text-[--color-text-primary]">{{ aggregate.average_rating }}</span>
          <span class="text-2xl text-yellow-400">★★★★★</span>
        </div>
        <p class="text-sm text-[--color-text-secondary]">
          Based on {{ aggregate.total_reviews?.toLocaleString() }} reviews
        </p>
      </div>

      <p v-if="!testimonials.length" class="py-12 text-center text-sm text-[--color-text-secondary]">
        No testimonials available.
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

const showRating = computed(() => settings.value.show_rating !== false)

type Testimonial = {
  quote: string
  author: string
  role?: string
  rating?: number
  avatar?: string | null
}

type Aggregate = {
  average_rating: number
  total_reviews: number
}

const testimonials = computed<Testimonial[]>(() => {
  const arr = content.value.testimonials
  if (!Array.isArray(arr)) return []
  return arr.filter((item): item is Testimonial =>
    item !== null &&
    typeof item === 'object' &&
    'quote' in item &&
    'author' in item &&
    typeof item.quote === 'string' &&
    typeof item.author === 'string'
  )
})

const aggregate = computed<Aggregate | null>(() => {
  const agg = content.value.aggregate
  if (!agg || typeof agg !== 'object' || Array.isArray(agg)) return null
  
  const data = agg as Record<string, unknown>
  if (typeof data.average_rating === 'number' && typeof data.total_reviews === 'number') {
    return {
      average_rating: data.average_rating,
      total_reviews: data.total_reviews
    }
  }
  return null
})
</script>
