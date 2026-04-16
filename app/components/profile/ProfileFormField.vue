<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#003D29] focus:border-[#003D29] sm:text-sm"
      @input="onInput"
    >
    <span v-if="error" class="text-xs text-red-500">{{ error }}</span>
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
