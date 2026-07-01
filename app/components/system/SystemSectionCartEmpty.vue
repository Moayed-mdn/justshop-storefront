<template>
  <ClientOnly>
    <div class="max-w-lg mx-auto px-4 py-16 text-center">
      <SystemSectionContent v-if="section" :section="section" />
    </div>
    <template #fallback>
      <div class="max-w-lg mx-auto px-4 py-16 text-center">
        <div class="space-y-4">
          <div class="h-8 w-48 bg-(--color-bg-surface) rounded animate-pulse mx-auto" />
          <div class="h-4 w-64 bg-(--color-bg-surface) rounded animate-pulse mx-auto" />
          <div class="h-10 w-40 bg-(--color-bg-surface) rounded animate-pulse mx-auto" />
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { RuntimeTemplateSectionDetail } from '~~/src/core/runtime/contracts/types'

defineProps<{
  section: RuntimeTemplateSectionDetail
}>()
</script>
