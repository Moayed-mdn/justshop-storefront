<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** Overall minimum value (left bound) */
  min?: number
  /** Overall maximum value (right bound) */
  max?: number
  /** Step size for the sliders */
  step?: number
  /** Two-way bound value: [minSelected, maxSelected] */
  modelValue: [number, number]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: [number, number]]
}>()

// Reactive min/max values via v-model
const minVal = computed({
  get: () => props.modelValue[0],
  set: (val) => emit('update:modelValue', [val, props.modelValue[1]])
})

const maxVal = computed({
  get: () => props.modelValue[1],
  set: (val) => emit('update:modelValue', [props.modelValue[0], val])
})

// Calculated percentages for the filled range
const minPercent = computed(() => {
  return ((minVal.value - (props.min ?? 0)) / ((props.max ?? 100) - (props.min ?? 0))) * 100
})

const maxPercent = computed(() => {
  return ((maxVal.value - (props.min ?? 0)) / ((props.max ?? 100) - (props.min ?? 0))) * 100
})

// Defaults
const minBound = props.min ?? 0
const maxBound = props.max ?? 100
const stepSize = props.step ?? 1
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Slider Container -->
    <div class="relative h-9">
      <!-- Background track -->
      <div class="absolute top-1/2 -translate-y-1/2 h-2 w-full bg-(--color-border-default) rounded-full" />

      <!-- Filled range (between thumbs) -->
      <div
        class="absolute top-1/2 -translate-y-1/2 h-2 bg-(--color-primary) rounded-full transition-all"
        :style="{
          left: `${minPercent}%`,
          width: `${maxPercent - minPercent}%`
        }"
      />

      <!-- MIN range input -->
      <input
        v-model.number="minVal"
        type="range"
        :min="minBound"
        :max="maxVal"
        :step="stepSize"
        class="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none
               [&::-webkit-slider-runnable-track]:h-0 [&::-webkit-slider-runnable-track]:bg-transparent
               [&::-webkit-slider-thumb]:appearance-none
               [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
               [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4
               [&::-webkit-slider-thumb]:border-[var(--color-primary)] [&::-webkit-slider-thumb]:rounded-full
               [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
               [&::-webkit-slider-thumb]:pointer-events-auto
               [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5
               [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4
               [&::-moz-range-thumb]:border-[var(--color-primary)] [&::-moz-range-thumb]:rounded-full
               [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
               [&::-moz-range-thumb]:pointer-events-auto"
      />

      <!-- MAX range input (higher z-index so its thumb sits on top when close) -->
      <input
        v-model.number="maxVal"
        type="range"
        :min="minVal"
        :max="maxBound"
        :step="stepSize"
        class="absolute top-1/2 -translate-y-1/2 w-full z-10 appearance-none bg-transparent pointer-events-none
               [&::-webkit-slider-runnable-track]:h-0 [&::-webkit-slider-runnable-track]:bg-transparent
               [&::-webkit-slider-thumb]:appearance-none
               [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
               [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4
               [&::-webkit-slider-thumb]:border-[var(--color-primary)] [&::-webkit-slider-thumb]:rounded-full
               [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
               [&::-webkit-slider-thumb]:pointer-events-auto
               [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5
               [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-4
               [&::-moz-range-thumb]:border-[var(--color-primary)] [&::-moz-range-thumb]:rounded-full
               [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
               [&::-moz-range-thumb]:pointer-events-auto"
      />
    </div>

    <!-- Value labels -->
    <div class="mt-6 flex justify-between text-sm font-medium text-(--color-text-secondary)">
      <span class="tabular-nums">{{ minVal }}</span>
      <span class="tabular-nums">{{ maxVal }}</span>
    </div>
  </div>
</template>