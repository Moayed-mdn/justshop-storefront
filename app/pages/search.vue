<!-- app/pages/search.vue -->

<template>
  <div class="w-full max-w-7xl mx-auto px-(--search-page-gutter) py-8">

    <!-- ── Empty Query State ──────────────── -->
    <div v-if="!searchTerm" class="flex flex-col items-center justify-center py-20 text-center">
      <svg class="w-16 h-16 text-(--gray-400) mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <p class="text-lg text-(--color-text-secondary)">{{ $t('search.enter_search') }}</p>
    </div>

    <!-- ── Results ────────────────────────── -->
    <template v-else>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl lg:text-3xl font-bold text-(--color-text-primary)">
          {{ $t('search.results_for') }}
          "<span class="text-(--color-primary)">{{ searchTerm }}</span>"
        </h1>
        <p v-if="!pending && results" class="mt-1 text-sm text-(--color-text-secondary)">
          {{ results.total_count }} {{ results.total_count === 1 ? 'result' : 'results' }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-8">
        <div class="flex gap-3">
          <div v-for="i in 3" :key="i" class="h-9 w-28 bg-(--gray-200) rounded-full animate-pulse" />
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="space-y-3">
            <div class="h-48 bg-(--gray-200) rounded-lg animate-pulse" />
            <div class="h-4 bg-(--gray-200) rounded animate-pulse w-3/4" />
            <div class="h-4 bg-(--gray-200) rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-else-if="results && results.total_count === 0"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <svg class="w-20 h-20 text-(--gray-400) mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
        </svg>
        <h2 class="text-xl font-semibold text-(--color-text-primary) mb-2">
          {{ $t('search.no_results') }} "{{ searchTerm }}"
        </h2>
        <p class="text-(--color-text-secondary)">{{ $t('search.try_different') }}</p>
      </div>

      <!-- Actual Results -->
      <template v-else-if="results && results.total_count > 0">

        <!-- ── Matching Categories ─────────── -->
        <section v-if="results.categories.length" class="mb-8">
          <h2 class="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wider mb-3">
            {{ $t('search.categories') }}
          </h2>
          <div class="flex flex-wrap gap-2">
            <NuxtLinkLocale
              v-for="cat in results.categories"
              :key="cat.id"
              :to="routes.category(cat.slug)"
              class="
                inline-flex items-center gap-2 px-4 py-2 rounded-full
                bg-(--search-badge-category-bg) text-(--search-badge-category-text)
                text-sm font-medium hover:opacity-80 transition-opacity
              "
            >
              <span>📁</span>
              <span>{{ cat.name }}</span>
              <span class="text-xs opacity-70">({{ cat.products_count }})</span>
            </NuxtLinkLocale>
          </div>
        </section>

        <!-- ── Matching Brands ─────────────── -->
        <section v-if="results.brands.length" class="mb-8">
          <h2 class="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wider mb-3">
            {{ $t('search.brands') }}
          </h2>
          <div class="flex flex-wrap gap-2">
            <NuxtLinkLocale
              v-for="brand in results.brands"
              :key="brand.id"
              :to="routes.search(brand.name)"
              class="
                inline-flex items-center gap-2 px-4 py-2 rounded-full
                bg-(--search-badge-brand-bg) text-(--search-badge-brand-text)
                text-sm font-medium hover:opacity-80 transition-opacity
              "
            >
              <span>🏷️</span>
              <span>{{ brand.name }}</span>
              <span class="text-xs opacity-70">({{ brand.products_count }})</span>
            </NuxtLinkLocale>
          </div>
        </section>

        <!-- ── Products Grid ───────────────── -->
        <section v-if="results.products.length">
          <h2 class="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wider mb-4">
            {{ $t('search.products') }}
          </h2>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            <SearchProductCard
              v-for="product in results.products"
              :key="product.id"
              :product="product"
            />
          </div>
        </section>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { SEARCH_QUERY } from '~/graphql/queries/search'
import type { SearchResult } from '~~/types/search'

const route = useRoute()
const { locale, t } = useI18n()
const routes = useStorefrontRoutes()

// ── Reactive search term from URL ────────────────
const searchTerm = computed(() => ((route.query.q as string) ?? '').trim())

// ─── Fetch logic (SSR-safe) ────────────────────
const { data, pending, error: fetchError } = await useAsyncData(
  `search-${searchTerm.value}-${locale.value}`,
  async () => {
    if (!searchTerm.value) return null

    const apollo = useNuxtApp().$apollo
    if (!apollo) return null

    const { data: searchData } = await apollo.query<SearchResult>({
      query: SEARCH_QUERY,
      variables: {
        query: searchTerm.value,
        locale: locale.value,
        limit: 30,
      },
    })

    return searchData?.search ?? null
  },
  {
    watch: [searchTerm, locale],
    server: true,
  }
)

const results = computed(() => data.value)

// ── SEO ──────────────────────────────────────────
useHead({
  title: computed(() =>
    searchTerm.value
      ? `${t('search.results_for')} "${searchTerm.value}"`
      : t('search.enter_search'),
  ),
})
</script>