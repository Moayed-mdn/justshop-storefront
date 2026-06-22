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

      <!-- Pricing Grid -->
      <div v-if="plans.length" class="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(plan, index) in plans"
          :key="index"
          class="relative flex flex-col rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-lg"
          :class="plan.featured 
            ? 'border-2 border-[--color-primary] bg-[--color-bg-card] shadow-md' 
            : 'border border-[--color-border-default] bg-[--color-bg-card]'"
        >
          <!-- Badge for featured plan -->
          <div 
            v-if="plan.featured" 
            class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[--color-primary] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
          >
            {{ plan.badge || 'Most Popular' }}
          </div>

          <!-- Plan name -->
          <h3 class="mb-2 text-2xl font-bold text-[--color-text-primary]">{{ plan.name }}</h3>

          <!-- Plan description -->
          <p v-if="plan.description" class="mb-6 text-sm leading-relaxed text-[--color-text-secondary]">
            {{ plan.description }}
          </p>

          <!-- Price -->
          <div class="mb-8 flex items-baseline gap-1 border-b border-[--color-border-default] pb-8">
            <span class="text-2xl font-semibold text-[--color-text-primary]">{{ plan.currency || '$' }}</span>
            <span class="text-5xl font-extrabold leading-none text-[--color-text-primary]">{{ plan.price }}</span>
            <span v-if="plan.period" class="text-base text-[--color-text-secondary]">/{{ plan.period }}</span>
          </div>

          <!-- Features list -->
          <ul v-if="plan.features && plan.features.length" class="mb-8 flex-1 space-y-2.5">
            <li
              v-for="(feature, fIndex) in plan.features"
              :key="fIndex"
              class="flex items-start gap-3 text-sm text-[--color-text-primary]"
            >
              <span class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[--color-primary] bg-opacity-10 text-xs font-bold text-[--color-primary]">✓</span>
              <span>{{ feature }}</span>
            </li>
          </ul>

          <!-- CTA button -->
          <NuxtLink
            v-if="plan.cta_url"
            :to="plan.cta_url"
            class="block w-full rounded-xl px-6 py-3.5 text-center text-base font-semibold transition-colors"
            :class="plan.featured 
              ? 'bg-[--color-primary] text-white hover:opacity-90' 
              : 'border-2 border-[--color-border-default] bg-[--color-bg-page] text-[--color-text-primary] hover:bg-[--color-border-default]'"
          >
            {{ plan.cta_label || 'Get Started' }}
          </NuxtLink>
        </article>
      </div>

      <p v-else class="py-12 text-center text-sm text-[--color-text-secondary]">
        No pricing plans available.
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

type PricingPlan = {
  name: string
  description?: string
  price: string | number
  currency?: string
  period?: string
  features?: string[]
  cta_label?: string
  cta_url?: string
  featured?: boolean
  badge?: string
}

const plans = computed<PricingPlan[]>(() => {
  const arr = content.value.plans
  if (!Array.isArray(arr)) return []
  return arr.filter((item): item is PricingPlan =>
    item !== null &&
    typeof item === 'object' &&
    'name' in item &&
    'price' in item &&
    typeof item.name === 'string'
  )
})
</script>
