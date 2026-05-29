<template>
  <section class="rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm">
    <div class="mx-auto max-w-4xl">
      <h2 v-if="title" class="text-2xl font-semibold text-slate-900">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-3 text-base text-slate-600">
        {{ subtitle }}
      </p>

      <ul v-if="featureItems.length" class="mt-6 grid gap-4 sm:grid-cols-2">
        <li
          v-for="(item, index) in featureItems"
          :key="`${index}-${item}`"
          class="rounded-2xl bg-slate-50 p-4 text-slate-700"
        >
          {{ item }}
        </li>
      </ul>
      <pre v-else-if="content" class="mt-6 overflow-x-auto rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{{ content }}</pre>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'

const props = defineProps<RuntimeSectionComponentProps>()

const featureItems = computed(() => {
  const candidateItems = Array.isArray(props.data.items)
    ? props.data.items
    : Array.isArray(props.data.content)
      ? props.data.content
      : []

  if (!candidateItems.length) {
    return []
  }

  return candidateItems
    .map((item) => {
      if (typeof item === 'string') {
        return item
      }

      if (item && typeof item === 'object' && 'label' in item && typeof item.label === 'string') {
        return item.label
      }

      if (item && typeof item === 'object' && 'title' in item && typeof item.title === 'string') {
        return item.title
      }

      return null
    })
    .filter((item): item is string => Boolean(item))
})

const title = computed(() => typeof props.data.title === 'string' ? props.data.title : '')
const subtitle = computed(() => typeof props.data.subtitle === 'string' ? props.data.subtitle : '')
const content = computed(() => props.data.content ?? null)
</script>
