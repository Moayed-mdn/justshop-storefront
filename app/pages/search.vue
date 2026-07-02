<template>
  <div class="w-full max-w-7xl mx-auto px-(--site-gutter) py-8">

    <!-- ── Breadcrumbs ────────────────────── -->
    <nav class="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-(--color-text-secondary)">
      <NuxtLinkLocale
        :to="routes.home()"
        class="hover:text-(--color-primary) transition-colors"
      >
        {{ $t('header.links.home') }}
      </NuxtLinkLocale>
      <span class="mx-0.5">/</span>
      <NuxtLinkLocale
        :to="routes.search()"
        class="hover:text-(--color-primary) transition-colors"
      >
        {{ $t('search.page_title') }}
      </NuxtLinkLocale>
      <template v-if="searchTerm">
        <span class="mx-0.5">/</span>
        <span class="font-medium text-(--color-text-primary) truncate max-w-[200px] sm:max-w-[400px]">
          "{{ searchTerm }}"
        </span>
      </template>
    </nav>

    <!-- ── Empty Query State ──────────────── -->
    <div v-if="!searchTerm" class="flex flex-col items-center justify-center py-20 text-center">
      <svg class="w-16 h-16 text-(--color-text-muted) mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
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

      <!-- Error State -->
      <div v-if="fetchError" class="flex flex-col items-center justify-center py-16 text-center">
        <svg class="w-20 h-20 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <h2 class="text-xl font-semibold text-(--color-text-primary) mb-2">
          Search Error
        </h2>
        <p class="text-(--color-text-secondary) mb-4">
          {{ fetchError.message || 'Unable to perform search. Please try again.' }}
        </p>
        <details class="text-left max-w-2xl">
          <summary class="cursor-pointer text-sm text-(--color-text-muted) hover:text-(--color-primary)">
            Technical Details
          </summary>
          <pre class="mt-2 p-4 bg-(--color-bg-elevated) rounded text-xs overflow-auto">{{ fetchError }}</pre>
        </details>
      </div>

      <!-- Loading State -->
      <div v-else-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-(--product-grid-gap)">
        <ProductCardSkeleton v-for="i in 6" :key="i" />
      </div>

      <!-- No Results -->
      <div
        v-else-if="results && results.total_count === 0"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <svg class="w-20 h-20 text-(--color-text-muted) mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
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
                bg-(--color-bg-elevated) text-(--color-text-secondary)
                border border-(--color-border-default)
                text-sm font-medium hover:opacity-80 transition-opacity
              "
            >
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
                bg-(--color-bg-elevated) text-(--color-text-secondary)
                border border-(--color-border-default)
                text-sm font-medium hover:opacity-80 transition-opacity
              "
            >
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

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-(--product-grid-gap)">
            <ProductCard
              v-for="product in mappedProducts"
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

definePageMeta({
  layout: 'system',
})
import { useStorefrontContext } from '~~/src/core/tenant/composables'
import type { SearchResult, ProductSearchResult } from '~~/types/search'
import type { ProductDto } from '~~/src/core/api/dto/storefront'

const route = useRoute()
const { locale, t } = useI18n()
const routes = useStorefrontRoutes()
const { resolveMediaUrl } = useMediaUrl()

// ── Reactive search term from URL ────────────────
const searchTerm = computed(() => ((route.query.q as string) ?? '').trim())

const storefrontContext = useStorefrontContext()
const tenantId = computed(() => storefrontContext.value.tenant?.id)

// ─── Fetch logic (SSR-safe) ────────────────────
const { data, pending, error: fetchError } = await useAsyncData(
  () => `search-${tenantId.value}-${searchTerm.value}-${locale.value}`,
  async () => {
    if (!searchTerm.value) return null

    const apollo = useNuxtApp().$apollo

    if (!apollo) {
      console.error('[Search] Apollo GraphQL client is not initialized')
      throw new Error('Apollo GraphQL client not available. Check if apollo plugin is loaded.')
    }

    try {
      const { data: searchData } = await apollo.query({
        query: SEARCH_QUERY,
        variables: {
          query: searchTerm.value,
          locale: locale.value,
          limit: 30,
        },
      })

      if (import.meta.dev) {
        console.log('[Search] GraphQL response:', searchData)
      }

      return searchData?.search ?? null
    } catch (err) {
      console.error('[Search] GraphQL query failed:', err)
      throw err
    }
  },
  {
    watch: [searchTerm, locale],
    server: true,
  }
)

// Log fetch errors
if (fetchError.value) {
  console.error('[Search] Fetch error:', fetchError.value)
}

const results = computed(() => data.value)

// ── Map search results to ProductDto for consistent rendering ──
function toProductDto(p: ProductSearchResult): ProductDto {
  return {
    id: p.id,
    variantId: p.product_variant_id ?? p.id,
    name: p.name,
    slug: p.slug,
    price: p.price ?? 0,
    currency: 'USD',
    image: resolveMediaUrl(p.image_url),
    description: p.description ?? '',
  }
}

const mappedProducts = computed(() =>
  (results.value?.products ?? []).map(toProductDto)
)

// ── SEO ──────────────────────────────────────────
useHead({
  title: computed(() =>
    searchTerm.value
      ? `${t('search.results_for')} "${searchTerm.value}"`
      : t('search.enter_search'),
  ),
})
</script>
