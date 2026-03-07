<template>
  <section>
    <h3 class="font-semibold mb-2">{{ t('filter.categories') }}</h3>

    <ul class="space-y-1">
      <p v-if="!categories?.length">
        {{ t('filter.no_categories') }}
      </p>

      <li
        v-for="cat in categories"
        :key="cat.id"
      >
        <button
          class="text-start w-full"
          :class="cat.slug === selectedSlug
            ? 'font-bold text-blue-600'
            : 'hover:underline'"
          @click="onSelect(cat.slug)"
        >
          {{ cat.name }}
        </button>
      </li>
    </ul>

    <button
      v-if="selectedSlug"
      class="text-sm text-red-500 mt-2"
      @click="onClear"
    >
      {{ t('filter.clear_category') }}
    </button>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Category } from '../../../types/filters'

const { t } = useI18n()

const props = defineProps<{
  categories?: Category[]
  selectedSlug: string | null
}>()

const emit = defineEmits<{
  (e: 'select', slug: string): void
  (e: 'clear'): void
}>()

const onSelect = (slug: string) => {
  emit('select', slug)
}

const onClear = () => {
  emit('clear')
}
</script>