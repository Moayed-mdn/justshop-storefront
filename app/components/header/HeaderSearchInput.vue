<!-- app/components/header/HeaderSearchInput.vue -->

<template>
  <div ref="containerRef" class="relative w-full">
    <!-- ── Search Input Bar ───────────────── -->
    <div class="
      w-full flex items-center overflow-hidden transition-all duration-(--header-duration)
      bg-(--header-search-bg)
      border border-(--header-search-border) rounded-(--header-search-radius) px-3
      focus-within:border-(--header-search-focus) focus-within:ring-1 focus-within:ring-(--header-search-focus)
      h-(--header-mobile-search-height) lg:h-10
    ">
      <!-- Search Icon -->
      <label
        for="header-search"
        class="cursor-pointer text-(--header-search-placeholder) hover:text-(--header-search-text) shrink-0"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.33317 3.33317C5.57175 3.33317 3.33317 5.57175 3.33317 8.33317C3.33317 11.0946 5.57175 13.3332 8.33317 13.3332C11.0946 13.3332 13.3332 11.0946 13.3332 8.33317C13.3332 5.57175 11.0946 3.33317 8.33317 3.33317ZM1.6665 8.33317C1.6665 4.65127 4.65127 1.6665 8.33317 1.6665C12.0151 1.6665 14.9998 4.65127 14.9998 8.33317C14.9998 9.87376 14.4773 11.2923 13.5997 12.4212L18.0891 16.9106C18.4145 17.236 18.4145 17.7637 18.0891 18.0891C17.7637 18.4145 17.236 18.4145 16.9106 18.0891L12.4212 13.5997C11.2923 14.4773 9.87376 14.9998 8.33317 14.9998C4.65127 14.9998 1.6665 12.0151 1.6665 8.33317Z"
            fill="currentColor"
          />
        </svg>
        <span class="sr-only">{{ $t('header.search_placeholder') }}</span>
      </label>

      <!-- Input -->
      <input
        id="header-search"
        ref="inputRef"
        v-model="searchQuery"
        type="search"
        :placeholder="$t('header.search_placeholder')"
        autocomplete="off"
        class="
          bg-transparent outline-none border-none flex-1 px-2
          text-base lg:text-sm
          text-(--header-search-text) placeholder:text-(--header-search-placeholder)
        "
        @input="onUserInput"
        @focus="onFocus"
        @keydown.enter.prevent="onEnter"
        @keydown.down.prevent="onArrowDown"
        @keydown.up.prevent="onArrowUp"
        @keydown.escape="onEscape"
      />

      <!-- Loading Spinner -->
      <svg
        v-if="loading"
        class="search-spinner w-4 h-4 text-(--header-search-placeholder) shrink-0"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>

      <!-- Clear Button -->
      <button
        v-if="searchQuery && !loading"
        type="button"
        class="text-xs text-(--header-search-placeholder) hover:text-(--header-search-text) px-1 cursor-pointer shrink-0"
        @click="clearSearch"
      >
        ✕
      </button>
    </div>

    <!-- ── Autocomplete Dropdown ──────────── -->
    <SearchDropdown
      :suggestions="suggestions"
      :loading="loading"
      :query="searchQuery"
      :highlighted-index="highlightedIndex"
      :visible="isDropdownOpen"
      @select="onSelectSuggestion"
      @see-all="onSeeAll"
    />
  </div>
</template>

<script setup lang="ts">
import { AUTOCOMPLETE_QUERY } from '~/graphql/queries/search'
import type { Suggestion, AutocompleteResult } from '~~/types/search'

const { locale } = useI18n()
const router = useRouter()
const routes = useStorefrontRoutes()

// ── Refs ─────────────────────────────────────────
const containerRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const searchQuery = ref('')
const debouncedQuery = refDebounced(searchQuery, 300)
const suggestions = ref<Suggestion[]>([])
const loading = ref(false)
const isDropdownOpen = ref(false)
const highlightedIndex = ref(-1)
const isUserTyping = ref(false)

// ── Close on click outside ───────────────────────
onClickOutside(containerRef, () => {
  isDropdownOpen.value = false
  highlightedIndex.value = -1
})

// ── Fetch autocomplete when debounced query changes
watch(debouncedQuery, async (query) => {
  if (!isUserTyping.value) return
  isUserTyping.value = false

  if (query.trim().length < 2) {
    suggestions.value = []
    isDropdownOpen.value = false
    return
  }

  await fetchSuggestions(query.trim())
})

async function fetchSuggestions(query: string) {
  // Guard: only runs on client (plugin is client-only)
  const apollo = useNuxtApp().$apollo
  if (!apollo) return

  loading.value = true

  try {
    const { data } = await apollo.query<AutocompleteResult>({
      query: AUTOCOMPLETE_QUERY,
      variables: { query, locale: locale.value, limit: 10 },
      fetchPolicy: 'no-cache',
    })

    suggestions.value = data?.autocomplete ?? []
    isDropdownOpen.value = true
    highlightedIndex.value = -1
  }
  catch (err) {
    const errorInfo = {
      name: err?.name,
      message: err?.message,
      code: err?.code,
      constructor: err?.constructor?.name,
      ownKeys: Object.keys(err || {}),
      stack: err?.stack?.split('\n')?.slice(0, 3)?.join('\n'),
    }
    console.error('[Search] Autocomplete error:', err, errorInfo)
    suggestions.value = []
  }
  finally {
    loading.value = false
  }
}

// ── Event Handlers ───────────────────────────────
function onUserInput() {
  isUserTyping.value = true
}

function onFocus() {
  if (suggestions.value.length > 0 && searchQuery.value.trim().length >= 2) {
    isDropdownOpen.value = true
  }
}

function onEscape() {
  isDropdownOpen.value = false
  highlightedIndex.value = -1
  inputRef.value?.blur()
}

function onArrowDown() {
  if (!isDropdownOpen.value) return
  const max = suggestions.value.length - 1
  highlightedIndex.value = highlightedIndex.value >= max ? 0 : highlightedIndex.value + 1
}

function onArrowUp() {
  if (!isDropdownOpen.value) return
  const max = suggestions.value.length - 1
  highlightedIndex.value = highlightedIndex.value <= 0 ? max : highlightedIndex.value - 1
}

function onEnter() {
  const selectedSuggestion = suggestions.value[highlightedIndex.value]
  if (highlightedIndex.value >= 0 && selectedSuggestion) {
    onSelectSuggestion(selectedSuggestion)
    return
  }

  if (searchQuery.value.trim()) {
    navigateToSearch(searchQuery.value.trim())
  }
}

function onSelectSuggestion(item: Suggestion) {
  isDropdownOpen.value = false
  highlightedIndex.value = -1

  switch (item.type) {
    case 'PRODUCT':
      router.push(routes.product(item.slug))
      break
    case 'CATEGORY':
      router.push(routes.category(item.slug))
      break
    case 'BRAND':
      router.push(routes.search(item.text))
      break
  }
}

function onSeeAll() {
  if (searchQuery.value.trim()) {
    navigateToSearch(searchQuery.value.trim())
  }
}

function navigateToSearch(query: string) {
  isDropdownOpen.value = false
  highlightedIndex.value = -1
  router.push(routes.search(query))
}

function clearSearch() {
  searchQuery.value = ''
  suggestions.value = []
  isDropdownOpen.value = false
  highlightedIndex.value = -1
  inputRef.value?.focus()
}
</script>