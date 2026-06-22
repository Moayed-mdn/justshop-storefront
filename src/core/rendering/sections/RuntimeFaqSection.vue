<template>
  <section class="rounded-3xl border border-[--color-border-default] bg-[--color-bg-page] px-6 py-10">
    <div class="mx-auto max-w-3xl">
      <div v-if="title || subtitle" class="mb-8 text-center">
        <h2 v-if="title" class="text-3xl font-bold tracking-tight text-[--color-text-primary] sm:text-4xl">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="mt-3 text-base text-[--color-text-secondary] sm:text-lg">
          {{ subtitle }}
        </p>
      </div>

      <!-- Accordion FAQ items -->
      <div v-if="items.length" class="flex flex-col gap-3">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="rounded-xl border border-[--color-border-default] bg-[--color-bg-card] transition-shadow hover:shadow-sm"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[--color-bg-page]"
            :aria-expanded="openIndex === index"
            @click="toggle(index)"
          >
            <span class="flex-1 text-base font-semibold text-[--color-text-primary]">{{ item.question }}</span>
            <span 
              class="flex h-6 w-6 flex-shrink-0 items-center justify-center text-[--color-primary] transition-transform"
              :class="{ 'rotate-180': openIndex === index }"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </button>
          
          <div
            v-show="openIndex === index"
            class="px-6 pb-6"
          >
            <p class="text-sm leading-relaxed text-[--color-text-secondary]">{{ item.answer }}</p>
          </div>
        </div>
      </div>

      <p v-else class="py-12 text-center text-sm text-[--color-text-secondary]">
        No FAQ items available.
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

type FaqItem = { question: string; answer: string }

const items = computed<FaqItem[]>(() => {
  const arr = content.value.items
  if (!Array.isArray(arr)) return []
  return arr.filter((item): item is FaqItem =>
    item !== null &&
    typeof item === 'object' &&
    'question' in item &&
    'answer' in item &&
    typeof item.question === 'string' &&
    typeof item.answer === 'string'
  )
})

// Accordion state
const openIndex = ref<number | null>(null)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>
