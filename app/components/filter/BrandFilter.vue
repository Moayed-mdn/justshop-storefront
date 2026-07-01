<template>
  <section>
    <h3 class="font-semibold mb-(--filter-section-gap)">{{ t('filter.brands') }}</h3>
    <ul class="grid grid-cols-2 gap-x-4 gap-y-1">
      <p v-if="!brands?.length">
        {{ t('filter.no_categories') }}
      </p>

      <li
        v-for="brand in brands"
        :key="brand.id"
      >
        <label class="flex items-center gap-2 cursor-pointer hover:underline">
          <input
            type="checkbox"
            :checked="isSelected(brand.slug)"
            class="accent-(--color-accent) cursor-pointer"
            @change="onToggle(brand.slug)"
          />
          <span
            :style="{ fontSize: 'var(--filter-text-size)' }"
            :class="isSelected(brand.slug) ? 'text-(--filter-text-active) font-(--filter-text-weight)' : ''"
          >
            {{ brand.name }}
          </span>
        </label>
      </li>
    </ul>

    <button
      v-if="selectedSlugs?.length"
      class="mt-(--filter-section-gap) text-sm text-(--color-error) cursor-pointer"
      @click="onClear"
    >
      {{ t('filter.clear_brand') }}
    </button>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { FilterDescendant } from '../../../types/product'

const { t } = useI18n()

const props = defineProps<{
  brands?: FilterDescendant[]
  selectedSlugs?: string[]
}>()

const emit = defineEmits<{
  (e: 'update', slugs: string[]): void
}>()

const isSelected = (slug: string): boolean => {
  return props.selectedSlugs?.includes(slug) ?? false
}

const onToggle = (slug: string) => {
  const current = props.selectedSlugs ?? []
  const idx = current.indexOf(slug)
  if (idx >= 0) {
    emit('update', current.filter(s => s !== slug))
  } else {
    emit('update', [...current, slug])
  }
}

const onClear = () => {
  emit('update', [])
}
</script>
