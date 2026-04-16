<template>
  <div class="flex flex-col gap-2">
    <label
      class="px-4 py-2 text-sm font-medium text-[#003D29] border border-[#003D29] rounded-md cursor-pointer hover:bg-[#003D29]/5 transition-colors text-center"
    >
      {{ buttonText }}
      <input
        type="file"
        :accept="accept"
        class="hidden"
        @change="onChange"
      >
    </label>
    <p v-if="hint" class="text-xs text-gray-400">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
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
