<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="mt-1">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :required="required"
        :autocomplete="autocomplete"
        :minlength="minlength"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
               focus:ring-[#003D29] focus:border-[#003D29] sm:text-sm"
        :class="{ 'border-red-500': error }"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <span v-if="error" class="text-xs text-red-500 mt-1 block">{{ error }}</span>
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
