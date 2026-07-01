<template>
  <div
    v-if="visible"
    class="w-full border-t px-6 py-4 text-center text-xs"
    :style="barStyle"
  >
    <span :style="{ color: textColor }">{{ text }}</span>
  </div>
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

const visible = computed(() => merged.value.enabled !== false && merged.value.enabled !== 'false')
const text = computed(() => {
  const year = new Date().getFullYear()
  const raw = String(merged.value.text ?? merged.value.copyright_text ?? '')
  return raw.replace(/\{year\}/g, String(year))
})
const bgColor = computed(() => String(merged.value.background_color ?? merged.value.bg_color ?? 'transparent'))
const textColor = computed(() => String(merged.value.text_color ?? '#6b7280'))

const barStyle = computed(() => ({
  backgroundColor: bgColor.value,
}))
</script>
