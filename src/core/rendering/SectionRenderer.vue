<template>
  <div class="section-renderer">
    <template v-for="section in sections" :key="section.id">
      <RuntimeSectionBoundary :section-id="section.id" :section-type="section.type">
        <component 
          :is="getSection(section.type)" 
          v-if="getSection(section.type)"
          :section="section"
          v-bind="section.data"
        />
        <RuntimeSectionFallback v-else :type="section.type" />
      </RuntimeSectionBoundary>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CmsSection } from '../runtime/router/types'
import { useSectionRegistry } from './registry'

defineProps<{
  sections: CmsSection[]
}>()

const { getSection } = useSectionRegistry()
</script>
