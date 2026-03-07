<template>
  <section>
    <h3 class="font-semibold mb-2">{{ t('filter.price') }}</h3>

    <div class="space-y-2">
      <div>
        <span>{{ localMin }}</span>
        <input
          type="range"
          :min="min"
          :max="max"
          v-model.number="localMin"
          @change="onChange"
        />
      </div>

      <div>
        <span>{{ localMax }}</span>
        <input
          type="range"
          :min="min"
          :max="max"
          v-model.number="localMax"
          @change="onChange"
        />
      </div>
    </div>

    <div class="flex justify-between text-sm text-gray-600">
      <p class="text-xs">
        {{ t('filter.products_between') }} {{ localMin }} - {{ localMax }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  min: number
  max: number
  initialMin: number
  initialMax: number
}>()

const emit = defineEmits<{
  (e: 'change', payload: { min: number; max: number }): void
}>()

const localMin = ref(props.initialMin)
const localMax = ref(props.initialMax)

watch(
  () => [props.initialMin, props.initialMax],
  ([min, max]) => {
    localMin.value = min
    localMax.value = max
  }
)

const onChange = () => {
  if (localMin.value > localMax.value) {
    localMax.value = localMin.value
  }

  emit('change', {
    min: localMin.value,
    max: localMax.value
  })
}
</script>