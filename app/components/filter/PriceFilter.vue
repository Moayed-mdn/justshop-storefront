<template>
  <section>
    <h3 class="font-semibold mb-2">{{ t('filter.price') }}</h3>
    <div class="double-range-slider">
      <div class="flex justify-between mb-2 text-sm text-gray-700">
        <span>{{ formatPrice(localMin) }}</span>
        <span>{{ formatPrice(localMax) }}</span>
      </div>
      <div class="slider-container">
        <div class="slider-track"></div>
        <div
          class="slider-range "
          :style="{
            insetInlineStart: minPercent + '%',
            width: rangeWidth + '%'
          }"
        ></div>
        <input
          type="range"
          class="slider slider-min"
          :class="{ 'is-active': activeThumb === 'min' }"
          :min="min"
          :max="max"
          v-model.number="localMin"
          @input="onInput('min')"
          @change="onChange"
          :aria-label="t('filter.from')"
        />

        <input
          type="range"
          class="slider slider-max"
          :class="{ 'is-active': activeThumb === 'max' }"
          :min="min"
          :max="max"
          v-model.number="localMax"
          @input="onInput('max')"
          @change="onChange"
          :aria-label="t('filter.to')"
        />
      </div>
      <p class="mt-2 text-xs text-gray-600">
        {{ t('filter.products_between') }} {{ formatPrice(localMin) }} -
        {{ formatPrice(localMax) }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  min: number
  max: number
  initialMin: number
  initialMax: number
  /**
   * أقل مسافة مسموح بها بين القيمتين (اختياري).
   * مثال: 10 يعني يجب أن يكون max - min ≥ 10
   */
  gap?: number
}>()

const emit = defineEmits<{
  (e: 'change', payload: { min: number; max: number }): void
}>()

const localMin = ref(props.initialMin)
const localMax = ref(props.initialMax)
const activeThumb = ref<'min' | 'max' | null>(null)

// const rangeSpan = computed(() => {
//   const diff = props.max - props.min
//   return diff <= 0 ? 1 : diff
// })

// const minPercent = computed(
//   () => ((localMin.value - props.min) / rangeSpan.value) * 100
// )

// const maxPercent = computed(
//   () => ((localMax.value - props.min) / rangeSpan.value) * 100
// )


const rangeSpan = computed(() => {
  const diff = props.max - props.min
  return diff <= 0 ? 1 : diff
})

// إذا لم يمرَّر prop gap نستخدم فرقًا أدنى = 5 (مثال: 245 - 250)
const minGap = computed(() => Math.max(props.gap ?? 5, 0))

const minPercent = computed(() => 
  ((localMin.value - props.min) / rangeSpan.value) * 100
)

const maxPercent = computed(() => 
  ((localMax.value - props.min) / rangeSpan.value) * 100
)

// ←←← هذا هو الحل الرياضي
const rangeWidth = computed(() => maxPercent.value - minPercent.value)
watch(
  () => props.initialMin,
  (min) => {
    localMin.value = min
  }
)

watch(
  () => props.initialMax,
  (max) => {
    localMax.value = max
  }
)

const clampValues = () => {
  if (localMin.value < props.min) {
    localMin.value = props.min
  }
  if (localMax.value > props.max) {
    localMax.value = props.max
  }
  const gap = minGap.value

  if (gap > 0 && localMax.value - localMin.value < gap) {
    if (activeThumb.value === 'min') {
      localMin.value = localMax.value - gap
    } else if (activeThumb.value === 'max') {
      localMax.value = localMin.value + gap
    } else {
      // في حالة عدم معرفة آخر Thumb، نعدل max افتراضيًا
      localMax.value = localMin.value + gap
    }
  }

  if (localMin.value > localMax.value) {
    const mid = (localMin.value + localMax.value) / 2
    localMin.value = mid
    localMax.value = mid
  }
}

const onInput = (type: 'min' | 'max') => {
  activeThumb.value = type
  clampValues()
}

const onChange = () => {
  clampValues()
  activeThumb.value = null
  emit('change', { min: localMin.value, max: localMax.value })
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)
</script>

<style scoped>
/* Double Range Slider Styles */
.double-range-slider {
  padding: 1rem 0;
}

.slider-container {
  position: relative;
  height: var(--double-range-slider-height);
  display: flex;
  align-items: center;
}

.slider-track {
  position: absolute;
  width: 100%;
  height: var(--double-range-slider-track-height);
  background-color: var(--range-slider-track-bg);
  border-radius: 9999px;
  top: 50%;
  transform: translateY(-50%);
}

.slider-range {
  position: absolute;
  height: var(--double-range-slider-track-height);
  background-color: var(--range-slider-active-bg);
  border-radius: 9999px;
  top: 50%;
  transform: translateY(-50%);
}

.slider {
  position: absolute;
  width: 100%;
  height: var(--double-range-slider-height);
  background: transparent;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  outline: none;
}

.slider::-webkit-slider-thumb {
  pointer-events: all;
  width: var(--double-range-slider-thumb-width);
  height: var(--double-range-slider-thumb-height);
  border-radius: 50%;
  border: var(--double-range-slider-thumb-border-width) solid var(--range-slider-thumb-border);
  background-color: var(--range-slider-thumb-bg);
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(var(--range-slider-thumb-hover-scale));
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.slider::-moz-range-thumb {
  pointer-events: all;
  width: var(--double-range-slider-thumb-width);
  height: var(--double-range-slider-thumb-height);
  border-radius: 50%;
  border: var(--double-range-slider-thumb-border-width) solid var(--range-slider-thumb-border);
  background-color: var(--range-slider-thumb-bg);
  cursor: pointer;
  border: none;
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(var(--range-slider-thumb-hover-scale));
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.slider-min {
  z-index: 2;
}

.slider-max {
  z-index: 1;
}

.slider-min.is-active,
.slider-max.is-active {
  z-index: 3;
}

</style>