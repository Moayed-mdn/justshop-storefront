<template>
  <div>
    <label
      :for="id"
      class="block text-sm font-medium"
      :style="{ color: 'var(--color-text-secondary)' }"
    >{{ label }}</label>
    <div class="mt-1">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :required="required"
        :autocomplete="autocomplete"
        :minlength="minlength"
        class="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-(--color-primary) focus:border-(--color-primary) sm:text-sm"
        :style="{ borderColor: error ? 'var(--color-error)' : 'var(--color-border-default)', background: 'var(--color-bg-page)', color: 'var(--color-text-primary)' }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <span v-if="error" class="text-xs mt-1 block" :style="{ color: 'var(--color-error)' }">{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  type?: string
  label: string
  modelValue: string
  error?: string
  required?: boolean
  autocomplete?: string
  minlength?: string | number
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
