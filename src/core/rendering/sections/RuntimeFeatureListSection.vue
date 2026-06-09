<template>
  <section class="rounded-3xl border border-(--color-border-default) bg-(--color-bg-page) px-6 py-10 shadow-sm">
    <div class="mx-auto max-w-5xl">
      <h2 v-if="title" class="text-2xl font-semibold text-(--color-text-primary)">
        {{ title }}
      </h2>
      <p v-if="subtitle" class="mt-3 text-base text-(--color-text-secondary)">
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
          class="rounded-2xl bg-(--color-bg-card) p-5 border border-(--color-border-default)"
        >
          <p class="text-sm font-bold text-(--color-text-primary)">{{ item.title }}</p>
          <p class="mt-1 text-sm text-(--color-text-secondary) leading-relaxed">{{ item.body }}</p>
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
          class="rounded-2xl bg-(--color-bg-card) p-4 text-(--color-text-primary)"
        >
          {{ item }}
        </li>
      </ul>

      <pre v-else-if="content" class="mt-6 overflow-x-auto rounded-2xl bg-(--color-bg-card) p-4 text-sm text-(--color-text-primary)">{{ content }}</pre>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'

const props = defineProps<RuntimeSectionComponentProps>()

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
