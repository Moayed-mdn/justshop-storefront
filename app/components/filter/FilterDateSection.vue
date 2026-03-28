<template>
  <section>
    <h3 class="font-semibold mb-(--filter-section-gap)">{{ title }}</h3>
    <div class="flex flex-wrap gap-(--filter-button-gap)">
      <button
        v-for="opt in options"
        :key="opt.label"
        :class="buttonClass(opt.value === modelValue)"
        @click="onSelect(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  options: { label: string; value: string }[]
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const onSelect = (value: string) => {
  emit('update:modelValue', value)
}

const buttonClass = (isActive: boolean) => {
  return isActive
    ? 'bg-(--filter-button-active-bg) text-(--filter-button-active-text) rounded px-(--filter-button-padding-x) py-(--filter-button-padding-y)'
    : 'bg-(--filter-button-hover-bg) rounded px-(--filter-button-padding-x) py-(--filter-button-padding-y)'
}
</script>
