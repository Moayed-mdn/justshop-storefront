<template>
  <div>
    <label :for="id" class="block text-sm font-medium" :style="{ color: 'var(--profile-label)' }">{{ label }}</label>
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-(--color-primary) focus:border-(--color-primary) sm:text-sm"
      :style="{ backgroundColor: 'var(--profile-input-bg)', borderColor: 'var(--profile-input-border)', color: 'var(--profile-input-text)' }"
      @input="onInput"
    >
    <span v-if="error" class="text-xs" :style="{ color: 'var(--color-error)' }">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  label: string
  modelValue: string
  type?: string
  required?: boolean
  placeholder?: string
  error?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  placeholder: undefined,
  error: undefined,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>
