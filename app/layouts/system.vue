<template>
  <StorefrontShell variant="full">
    <slot />
  </StorefrontShell>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { defaultStorefrontShellConfig, provideStorefrontShell } from '~/composables/useStorefrontShell'
import SystemSectionRenderer from '~/components/system/SystemSectionRenderer.vue'

const {
  sectionOrder,
  sectionMap,
  isEmpty,
} = useSystemPageTemplate()

const SHELL_SECTION_TYPES = new Set(['header', 'announcement_bar', 'footer', 'copyright_bar'])
const CHROME_SECTION_TYPES = new Set(['header', 'announcement_bar', 'footer', 'copyright_bar'])

const contentSectionOrder = computed(() =>
  sectionOrder.value.filter(id => !SHELL_SECTION_TYPES.has(sectionMap.value[id]?.type ?? ''))
)

// Provide layout_order and chrome_sections for StorefrontShell
const layoutOrder = computed(() => {
  const order: string[] = []
  for (const id of sectionOrder.value) {
    const section = sectionMap.value[id]
    if (section && CHROME_SECTION_TYPES.has(section.type)) {
      order.push(section.type)
    }
  }
  if (!order.includes('content')) {
    const footerIdx = order.findIndex(t => t === 'footer' || t === 'copyright_bar')
    if (footerIdx === -1) {
      order.push('content')
    } else {
      order.splice(footerIdx, 0, 'content')
    }
  }
  if (!order.includes('header')) {
    order.unshift('header')
  }
  if (!order.includes('footer')) {
    order.push('footer')
  }
  return order
})
provide('layoutOrder', layoutOrder)

const chromeSections = computed(() => {
  const result: Record<string, Record<string, unknown>> = {}
  for (const id of sectionOrder.value) {
    const section = sectionMap.value[id]
    if (section && CHROME_SECTION_TYPES.has(section.type)) {
      result[section.type] = section.settings ?? {}
    }
  }
  return result
})
provide('chromeSections', chromeSections)

const shellConfig = computed(() => defaultStorefrontShellConfig('full'))
provideStorefrontShell(shellConfig)
</script>
