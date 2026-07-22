<template>
  <section>
    <h3 class="font-semibold mb-(--filter-section-gap)">{{ t('filter.categories') }}</h3>
    <ul class="space-y-1">
      <p v-if="!categories?.length">
        {{ t('filter.no_categories') }}
      </p>

      <li
        v-for="cat in categories"
        :key="cat.id"
      >
        <button
          type="button"
          class="block text-start w-full transition-colors"
          :class="cat.slug === selectedSlug
            ? 'text-(--filter-text-active) font-(--filter-text-weight)'
            : 'hover:underline'"
          :style="{
            fontSize: 'var(--filter-text-size)'
          }"
          @click="onSelect(cat.slug)"
        >
          {{ cat.name }}
        </button>
      </li>
    </ul>

    <button
      v-if="selectedSlug"
      class="mt-(--filter-section-gap) text-sm text-(--color-error) cursor-pointer"
      @click="onClear"
    >
      {{ t('filter.clear_category') }}
    </button>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { FilterDescendant } from '../../../types/product'

const { t } = useI18n()

const props = defineProps<{
  categories?: FilterDescendant[]
  selectedSlug: string | null | undefined
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