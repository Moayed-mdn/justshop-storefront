<template>
  <section class="rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm">
    <div class="mx-auto max-w-4xl">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Category
      </p>
      <h1 class="mt-3 text-3xl font-bold text-slate-900">
        {{ name }}
      </h1>
      <p v-if="slug" class="mt-2 text-sm text-slate-500">
        {{ routes.category(slug) }}
      </p>

      <ul v-if="crumbs.length" class="mt-6 flex flex-wrap gap-2 text-sm text-slate-600">
        <li v-for="(crumb, index) in crumbs" :key="`${index}-${crumb}`" class="rounded-full bg-slate-100 px-3 py-1">
          {{ crumb }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'
import { useStorefrontRoutes } from '~/composables/useStorefrontRoutes'

const props = defineProps<RuntimeSectionComponentProps>()
const routes = useStorefrontRoutes()

const crumbs = computed(() => {
  return (Array.isArray(props.data.breadcrumb) ? props.data.breadcrumb : [])
    .map((item) => {
      if (typeof item === 'string') {
        return item
      }

      if (item && typeof item === 'object' && 'name' in item && typeof item.name === 'string') {
        return item.name
      }

      if (item && typeof item === 'object' && 'label' in item && typeof item.label === 'string') {
        return item.label
      }

      return null
    })
    .filter((item): item is string => Boolean(item))
})

const name = computed(() => typeof props.data.name === 'string' ? props.data.name : '')
const slug = computed(() => typeof props.data.slug === 'string' ? props.data.slug : '')
</script>
