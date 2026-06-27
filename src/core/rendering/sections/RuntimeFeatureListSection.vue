<template>
  <section 
    class="rounded-3xl border px-6 py-10 shadow-sm"
    :style="sectionStyle"
  >
    <div class="mx-auto max-w-5xl">
      <h2 v-if="title" class="text-2xl font-semibold" :style="{ color: colorScheme.color }">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-3 text-base" :style="{ color: colorScheme.color, opacity: 0.8 }">
        {{ subtitle }}
      </p>

      <!-- Rich card items: { icon, title, body } -->
      <ul
        v-if="cardItems.length"
        class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <li
          v-for="(item, index) in cardItems"
          :key="index"
          class="rounded-2xl p-5 border"
          :style="cardStyle"
        >
          <p class="text-sm font-bold" :style="{ color: colorScheme.color }">{{ item.title }}</p>
          <p class="mt-1 text-sm leading-relaxed" :style="{ color: colorScheme.color, opacity: 0.8 }">{{ item.body }}</p>
        </li>
      </ul>

      <!-- Simple string list items -->
      <ul
        v-else-if="featureItems.length"
        class="mt-6 grid gap-4 sm:grid-cols-2"
      >
        <li
          v-for="(item, index) in featureItems"
          :key="`${index}-${item}`"
          class="rounded-2xl p-4"
          :style="cardStyle"
        >
          {{ item }}
        </li>
      </ul>

      <pre v-else-if="content" class="mt-6 overflow-x-auto rounded-2xl p-4 text-sm" :style="cardStyle">{{ content }}</pre>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'
import { applyColorScheme } from '../utils/colorScheme'

const props = defineProps<RuntimeSectionComponentProps>()

// Color scheme support
const colorScheme = computed(() => {
  const schemeKey = (props.data.settings as any)?.color_scheme
  return applyColorScheme(props.theme, schemeKey)
})

const sectionStyle = computed(() => ({
  backgroundColor: colorScheme.value.backgroundColor,
  color: colorScheme.value.color,
  borderColor: colorScheme.value.borderColor,
}))

const cardStyle = computed(() => ({
  backgroundColor: colorScheme.value.secondaryBackground,
  color: colorScheme.value.color,
  borderColor: colorScheme.value.borderColor,
}))

type CardItem = { title: string; body: string; icon?: string }

const rawItems = computed(() => {
  return Array.isArray(props.data.items)
    ? props.data.items
    : Array.isArray(props.data.content)
      ? props.data.content
      : []
})

// Rich card items: objects with at least a title and body
const cardItems = computed<CardItem[]>(() => {
  return rawItems.value
    .filter((item): item is Record<string, unknown> =>
      item !== null && typeof item === 'object' && !Array.isArray(item) &&
      'title' in item && 'body' in item)
    .map((item) => ({
      icon:  typeof item.icon  === 'string' ? item.icon  : undefined,
      title: typeof item.title === 'string' ? item.title : String(item.title ?? ''),
      body:  typeof item.body  === 'string' ? item.body  : String(item.body  ?? ''),
    }))
})

// Plain string items (original behaviour)
const featureItems = computed<string[]>(() => {
  if (cardItems.value.length) return []
  return rawItems.value
    .map((item) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object') {
        if ('label' in item && typeof (item as Record<string, unknown>).label === 'string') return (item as Record<string, unknown>).label as string
        if ('title' in item && typeof (item as Record<string, unknown>).title === 'string') return (item as Record<string, unknown>).title as string
      }
      return null
    })
    .filter((item): item is string => Boolean(item))
})

const title    = computed(() => typeof props.data.title    === 'string' ? props.data.title    : '')
const subtitle = computed(() => typeof props.data.subtitle === 'string' ? props.data.subtitle : '')
const content  = computed(() => props.data.content ?? null)
</script>
