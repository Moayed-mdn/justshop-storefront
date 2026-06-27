<template>
  <div class="flex flex-col gap-2">
    <label
      :style="{ borderColor: primary, color: primary }"
      class="px-4 py-2 text-sm font-medium border rounded-md cursor-pointer transition-colors text-center
             hover-outline-btn"
    >
      {{ buttonText }}
      <input
        type="file"
        :accept="accept"
        class="hidden"
        @change="onChange"
      >
    </label>
    <p v-if="hint" class="text-xs" :style="{ color: 'var(--color-text-muted)' }">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
// Inline theme colors for SSR compatibility
const getCSSVar = (varName: string, fallback: string): string => {
  if (!process.client) return fallback
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    return value || fallback
  } catch {
    return fallback
  }
}

const primary = computed(() => getCSSVar('--color-primary', '#3b82f6'))

interface Props {
  buttonText: string
  hint?: string
  accept?: string
}

withDefaults(defineProps<Props>(), {
  hint: undefined,
  accept: 'image/jpeg,image/png,image/webp',
})

const emit = defineEmits<{
  (e: 'change', file: File): void
}>()

const onChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  emit('change', file)
}
</script>

<style scoped>
.hover-outline-btn:hover {
  background-color: rgba(59, 130, 246, 0.05);
}
</style>
