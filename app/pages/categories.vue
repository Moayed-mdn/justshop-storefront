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
      <span class="font-medium text-(--color-text-primary)">
        {{ $t('categories.page_title') }}
      </span>
    </nav>

    <!-- ── Page Header ────────────────────── -->
    <div class="mb-8">
      <h1 class="text-2xl lg:text-3xl font-bold text-(--color-text-primary)">
        {{ $t('categories.page_title') }}
      </h1>
      <p class="mt-2 text-(--color-text-secondary)">
        {{ $t('categories.page_description') }}
      </p>
    </div>

    <!-- ── Loading State ───────────────────── -->
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="bg-(--color-bg-elevated) rounded-lg h-48"></div>
      </div>
    </div>

    <!-- ── Categories Grid ─────────────────── -->
    <div v-else-if="categories && categories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLinkLocale
        v-for="category in categories"
        :key="category.id"
        :to="routes.category(category.slug)"
        class="group block bg-(--color-bg-elevated) rounded-lg overflow-hidden border border-(--color-border-default) hover:shadow-lg transition-all duration-200"
      >
        <!-- Category Image (if available) -->
        <div
          v-if="category.image_url"
          class="h-48 bg-cover bg-center"
          :style="{ backgroundImage: `url(${category.image_url})` }"
        />
        <div
          v-else
          class="h-48 flex items-center justify-center bg-gradient-to-br from-(--color-primary)/10 to-(--color-primary)/5"
        >
          <svg class="w-16 h-16 text-(--color-primary)/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </div>

        <!-- Category Info -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-(--color-text-primary) group-hover:text-(--color-primary) transition-colors">
            {{ category.name }}
          </h3>
          <p v-if="category.description" class="mt-1 text-sm text-(--color-text-secondary) line-clamp-2">
            {{ category.description }}
          </p>
          <div class="mt-3 flex items-center justify-between">
            <span class="text-sm text-(--color-text-muted)">
              {{ category.products_count || 0 }} {{ category.products_count === 1 ? 'product' : 'products' }}
            </span>
            <span class="text-sm font-medium text-(--color-primary) group-hover:translate-x-1 transition-transform">
              {{ $t('categories.browse') }} →
            </span>
          </div>
        </div>
      </NuxtLinkLocale>
    </div>

    <!-- ── Empty State ─────────────────────── -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <svg class="w-20 h-20 text-(--color-text-muted) mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
      <h2 class="text-xl font-semibold text-(--color-text-primary) mb-2">
        {{ $t('categories.no_categories') }}
      </h2>
      <p class="text-(--color-text-secondary) mb-6">
        {{ $t('categories.no_categories_description') }}
      </p>
      <NuxtLinkLocale
        :to="routes.home()"
        :style="{ backgroundColor: primary, color: onPrimary }"
        class="px-6 py-2 rounded-md transition-colors hover-primary-link"
      >
        {{ $t('categories.back_home') }}
      </NuxtLinkLocale>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'

definePageMeta({
  layout: 'system',
})
import { useStorefrontContext } from '~~/src/core/tenant/composables'

// Inline theme colors for SSR compatibility
const getCSSVar = (varName: string, fallback: string): string => {
  if (!process.client) return fallback
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    return value || fallback
  } catch {
    return fallback
  }
}

const primary = computed(() => getCSSVar('--color-primary', '#3b82f6'))
const onPrimary = computed(() => getCSSVar('--color-on-primary', '#ffffff'))


const routes = useStorefrontRoutes()
const { t, locale } = useI18n()
const api = useApi()
const storefrontContext = useStorefrontContext()

// Fetch categories from API
// ✅ FIXED: Now uses locale-aware cache key with direct createCacheKey
const { data: categories, pending } = await useAsyncData(
  () => createCacheKey({
    locale: locale.value,
    tenantId: storefrontContext.value.tenant?.id,
    resource: CacheResources.CATEGORIES_LIST,
    variant: 'page'
  }),
  () => api('/storefront/categories', { method: 'GET' }),
  {
    transform: (response: any) => response?.data || [],
  }
)

// SEO
useHead({
  title: t('categories.page_title'),
  meta: [
    { name: 'description', content: t('categories.page_description') },
  ],
})
</script>

<style scoped>
.hover-primary-link:hover {
  filter: brightness(0.9);
}
</style>
