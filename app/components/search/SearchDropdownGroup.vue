<!-- app/components/search/SearchDropdownGroup.vue -->

<template>
  <div>
    <!-- Group Header -->
    <div class="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-(--search-item-secondary)">
      {{ label }}
    </div>

    <!-- ── PRODUCT Items ─────────────────── -->
    <template v-if="type === 'PRODUCT'">
      <button
        v-for="(item, i) in items"
        :key="item.id"
        type="button"
        :ref="(el) => setItemRef(el as HTMLElement, i)"
        class="
          w-full flex items-center gap-3 px-4 py-2.5
          transition-colors duration-100 cursor-pointer text-start
        "
        :class="isHighlighted(i) ? 'bg-(--search-item-active)' : 'hover:bg-(--search-item-hover)'"
        @mousedown.prevent="$emit('select', item)"
      >
        <!-- Product Image -->
        <div class="w-10 h-10 rounded-lg bg-(--color-bg-hover) flex items-center justify-center overflow-hidden shrink-0">
          <img
            v-if="item.image_url"
            :src="item.image_url"
            :alt="item.text"
            class="w-full h-full object-contain"
          />
          <svg
            v-else
            class="w-5 h-5 text-(--color-text-muted)"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
          </svg>
        </div>

        <!-- Name + Rating -->
        <div class="flex-1 min-w-0">
          <span class="text-sm text-(--search-item-text) truncate block font-medium">
            {{ item.text }}
          </span>
          
          <!-- Stars Row -->
          <div v-if="item.avg_rating" class="flex items-center gap-1 mt-0.5">
            <div class="flex items-center gap-px">
              <span
                v-for="star in 5"
                :key="star"
                class="text-[11px] leading-none"
                :class="star <= Math.round(item.avg_rating || 0)
                  ? 'text-(--search-star-filled)'
                  : 'text-(--search-star-empty)'"
              >★</span>
            </div>
            <span class="text-[11px] text-(--search-item-secondary)">
              {{ item.avg_rating }}
              <span v-if="item.reviews_count" class="opacity-70">
                ({{ item.reviews_count }})
              </span>
            </span>
          </div>
        </div>

        <!-- Price -->
        <div v-if="item.price" class="shrink-0">
          <UiPrice
            :price="item.price"
            currency="USD"
            integerClass="text-sm font-bold"
          />
        </div>
      </button>
    </template>

    <!-- ── CATEGORY Items ────────────────── -->
    <template v-else-if="type === 'CATEGORY'">
      <button
        v-for="(item, i) in items"
        :key="item.id"
        type="button"
        :ref="(el) => setItemRef(el as HTMLElement, i)"
        class="
          w-full flex items-center gap-3 px-4 py-2.5
          transition-colors duration-100 cursor-pointer text-start
        "
        :class="isHighlighted(i) ? 'bg-(--search-item-active)' : 'hover:bg-(--search-item-hover)'"
        @mousedown.prevent="$emit('select', item)"
      >
        <!-- Category Icon -->
        <div class="
          w-8 h-8 rounded-lg flex items-center justify-center shrink-0
          bg-(--search-badge-category-bg)
        ">
          <span class="text-sm">📁</span>
        </div>

        <!-- Name -->
        <span class="flex-1 text-sm text-(--search-item-text) truncate">
          {{ item.text }}
        </span>

        <!-- Badge -->
        <span class="
          shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide
          bg-(--search-badge-category-bg) text-(--search-badge-category-text)
        ">
          {{ $t('search.category') }}
        </span>
      </button>
    </template>

    <!-- ── BRAND Items ───────────────────── -->
    <template v-else>
      <button
        v-for="(item, i) in items"
        :key="item.id"
        type="button"
        :ref="(el) => setItemRef(el as HTMLElement, i)"
        class="
          w-full flex items-center gap-3 px-4 py-2.5
          transition-colors duration-100 cursor-pointer text-start
        "
        :class="isHighlighted(i) ? 'bg-(--search-item-active)' : 'hover:bg-(--search-item-hover)'"
        @mousedown.prevent="$emit('select', item)"
      >
        <!-- Brand Logo/Icon -->
        <div class="
          w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden
          bg-(--search-badge-brand-bg)
        ">
          <img
            v-if="item.image_url"
            :src="item.image_url"
            :alt="item.text"
            class="w-full h-full object-contain"
          />
          <span v-else class="text-sm">🏷��</span>
        </div>

        <!-- Name -->
        <span class="flex-1 text-sm text-(--search-item-text) truncate">
          {{ item.text }}
        </span>

        <!-- Badge -->
        <span class="
          shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide
          bg-(--search-badge-brand-bg) text-(--search-badge-brand-text)
        ">
          {{ $t('search.brand') }}
        </span>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Suggestion } from '~~/types/search'

const props = defineProps<{
  label: string
  items: Suggestion[]
  type: 'PRODUCT' | 'CATEGORY' | 'BRAND'
  highlightedIndex: number
  indexOffset: number
}>()

defineEmits<{
  select: [item: Suggestion]
}>()

function isHighlighted(localIndex: number): boolean {
  return props.highlightedIndex === props.indexOffset + localIndex
}

// Scroll highlighted item into view
const itemRefs: (HTMLElement | null)[] = []

function setItemRef(el: HTMLElement | null, i: number) {
  itemRefs[i] = el
}

watch(() => props.highlightedIndex, (globalIdx) => {
  const localIdx = globalIdx - props.indexOffset
  if (localIdx >= 0 && localIdx < props.items.length) {
    itemRefs[localIdx]?.scrollIntoView({ block: 'nearest' })
  }
})
</script>