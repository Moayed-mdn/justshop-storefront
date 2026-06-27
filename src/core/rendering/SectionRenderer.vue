<template>
  <div class="section-renderer">
    <template v-for="entry in renderEntries" :key="entry.section.id">
      <RuntimeSectionBoundary
        :section-id="entry.section.id"
        :section-type="entry.section.type"
        :data-state="entry.section.dataState"
      >
        <component
          :is="entry.component"
          v-if="entry.component && entry.section.dataState === 'ready' && !entry.reason"
          :section="entry.section"
          :data="entry.data"
          :theme="runtimeTheme"
        />
        <RuntimeSectionFallback
          v-else
          :type="entry.section.type"
          :component="entry.section.component"
          :state="entry.section.dataState"
          :reason="entry.reason || undefined"
        />
      </RuntimeSectionBoundary>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import type { CmsSection, RuntimeThemeResponse } from '../runtime/router/types'
import { logRuntimeEvent } from '../runtime/observability/logRuntimeEvent'
import { useSectionRegistry } from './registry'
import type { RuntimeSectionData } from './types'
import { useStorefrontContext } from '../tenant/composables'

const props = defineProps<{
  sections: CmsSection[]
  theme?: RuntimeThemeResponse['data'] | null
}>()

const storefrontContext = useStorefrontContext()
const { getSection } = useSectionRegistry()

// Use theme from props directly
const runtimeTheme = computed(() => props.theme)

type RuntimeSectionFallbackReason = 'unknown_component' | 'invalid_props'

const warnedSections = new Set<string>()

const toSectionData = (section: CmsSection): RuntimeSectionData | null => {
  const { props } = section

  if (!props || typeof props !== 'object' || Array.isArray(props)) {
    return null
  }

  return props as RuntimeSectionData
}

const renderEntries = computed(() => {
  return props.sections.map((section) => {
    const registryEntry = getSection(section.component)
    const data = toSectionData(section)
    let reason: RuntimeSectionFallbackReason | null = null

    if (!registryEntry) {
      reason = 'unknown_component'
    } else if (!data || (registryEntry.validate && !registryEntry.validate(data))) {
      reason = 'invalid_props'
    }

    return {
      section,
      data: data || {},
      component: registryEntry?.component || null,
      reason,
    }
  })
})

watchEffect(() => {
  for (const entry of renderEntries.value) {
    if (!entry.reason || warnedSections.has(entry.section.id)) {
      continue
    }

    warnedSections.add(entry.section.id)

    logRuntimeEvent({
      artifact: 'section',
      event: 'runtime.section.fallback',
      status: 'failure',
      details: {
        sectionId: entry.section.id,
        sectionType: entry.section.type,
        component: entry.section.component,
        dataState: entry.section.dataState,
        reason: entry.reason,
      },
    }, 'warn', storefrontContext)
  }
})
</script>
