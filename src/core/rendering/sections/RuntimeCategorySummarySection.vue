<template>
  <section 
    class="rounded-3xl border px-6 py-10 shadow-sm"
    :style="sectionStyle"
  >
    <div class="mx-auto max-w-4xl">
      <p 
        class="text-sm font-semibold uppercase tracking-[0.2em]"
        :style="mutedTextStyle"
      >
        Category
      </p>
      <h1 
        class="mt-3 text-3xl font-bold"
        :style="primaryTextStyle"
      >
        {{ name }}
      </h1>

      <nav 
        v-if="crumbs.length" 
        class="mt-6 flex flex-wrap items-center gap-1.5 text-sm"
        :style="mutedTextStyle"
      >
        <NuxtLink :to="routes.shop()" class="hover:opacity-80 transition-opacity">
          Shop
        </NuxtLink>
        <template v-for="(crumb, index) in crumbs" :key="`${index}-${crumb.slug || crumb.name}`">
          <span class="mx-0.5">/</span>
          <NuxtLink
            v-if="index < crumbs.length - 1 && crumb.slug"
            :to="routes.category(crumb.slug)"
            class="hover:opacity-80 transition-opacity"
          >
            {{ crumb.name }}
          </NuxtLink>
          <span v-else class="font-medium" :style="primaryTextStyle">
            {{ crumb.name }}
          </span>
        </template>
      </nav>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'
import { useStorefrontRoutes } from '~/composables/useStorefrontRoutes'
import { applyColorScheme } from '../utils/colorScheme'

type Crumb = {
  name: string
  slug: string | null
}

const props = defineProps<RuntimeSectionComponentProps>()
const routes = useStorefrontRoutes()

const colorScheme = computed(() => {
  const scheme = props.settings?.color_scheme
  return typeof scheme === 'string' ? scheme : 'default'
})

const { backgroundColor, textColor, mutedTextColor, borderColor } = applyColorScheme(colorScheme)

const sectionStyle = computed(() => ({
  backgroundColor: backgroundColor.value,
  borderColor: borderColor.value,
}))

const primaryTextStyle = computed(() => ({
  color: textColor.value,
}))

const mutedTextStyle = computed(() => ({
  color: mutedTextColor.value,
}))

const crumbs = computed<Crumb[]>(() => {
  return (Array.isArray(props.data.breadcrumb) ? props.data.breadcrumb : [])
    .map((item) => {
      if (typeof item === 'string') {
        return { name: item, slug: null }
      }

      if (item && typeof item === 'object') {
        const name = (typeof (item as Record<string, unknown>).name === 'string' ? (item as Record<string, unknown>).name
          : typeof (item as Record<string, unknown>).label === 'string' ? (item as Record<string, unknown>).label
          : null)

        if (!name) return null

        return {
          name: name as string,
          slug: typeof (item as Record<string, unknown>).slug === 'string' ? (item as Record<string, unknown>).slug as string : null,
        }
      }

      return null
    })
    .filter((item): item is Crumb => Boolean(item))
})

const name = computed(() => typeof props.data.name === 'string' ? props.data.name : '')
</script>
