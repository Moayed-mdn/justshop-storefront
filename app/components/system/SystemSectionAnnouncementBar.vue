<template>
  <AnnouncementBar
    :settings="merged"
    :show-language-switcher="showLanguageSwitcher"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RuntimeTemplateSectionDetail } from '~~/src/core/runtime/contracts/types'

const props = defineProps<{
  section: RuntimeTemplateSectionDetail
}>()

const merged = computed(() => ({
  ...props.section.settings,
  ...props.section.data,
}))

const showLanguageSwitcher = computed(() => {
  const v = merged.value.show_language_switcher
  return v !== false && v !== 'false'
})
</script>
