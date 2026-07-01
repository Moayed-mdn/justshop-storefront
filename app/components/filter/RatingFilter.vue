<template>
  <section>
    <h3 class="font-semibold mb-(--filter-section-gap)">{{ t('filter.rating') }}</h3>
    <div class="flex flex-wrap gap-(--filter-button-gap)">
      <button
        v-for="opt in options"
        :key="opt.value"
        :class="buttonClass(modelValue === opt.value)"
        @click="onSelect(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  modelValue: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

const options = [
  { label: t('filter.all'), value: null },
  { label: '4+ ★', value: 4 },
  { label: '3+ ★', value: 3 },
  { label: '2+ ★', value: 2 },
  { label: '1+ ★', value: 1 },
]

const onSelect = (value: number | null) => {
  emit('update:modelValue', value)
}

const buttonClass = (isActive: boolean) => {
  return isActive
    ? 'bg-(--filter-button-active-bg) text-(--filter-button-active-text) rounded px-(--filter-button-padding-x) py-(--filter-button-padding-y)'
    : 'bg-(--filter-button-hover-bg) rounded px-(--filter-button-padding-x) py-(--filter-button-padding-y)'
}
</script>