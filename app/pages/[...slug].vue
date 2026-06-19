<template>
  <div
    class="storefront-runtime min-h-screen bg-(--color-bg-page) text-(--color-text-primary)"
    :style="runtimeShellStyle"
  >
    <!-- Show subtle loading overlay when fetching new locale data -->
    <div v-if="pending" class="fixed inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <UiLoadingSpinner class="w-8 h-8" />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Loading {{ locale === 'ar' ? 'Arabic' : 'English' }} content...
        </span>
      </div>
    </div>

    <template v-if="resolvedRoute && runtimePage">
      <RuntimeLayoutManager :layout="runtimePage.layout || resolvedRoute.layout || undefined">
        <RuntimeSectionRenderer :sections="runtimePage.sections" />
      </RuntimeLayoutManager>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { RuntimeResolvedRoute, StorefrontRuntimeBundle } from '../../src/core/runtime/router/types'
import { normalizeError } from '../../src/core/api/errors'
import { createTenantCacheKey } from '../../src/core/cache/createTenantCacheKey'
import { useRouteResolver } from '../../src/core/runtime/router/useRouteResolver'
import { useStorefrontPayload } from '../../src/core/runtime/router/useStorefrontPayload'
import { mapRuntimeSeoPayload, useRuntimeSeo } from '../../src/core/seo/useRuntimeSeo'
import { useStorefrontContext } from '../../src/core/tenant/composables'
import UiLoadingSpinner from '../components/ui/LoadingSpinner.vue'

definePageMeta({
  layout: false,
})

const storefrontContext = useStorefrontContext()
const { locale } = useI18n()
const route = useRoute()

// ✅ Extract locale from path - this is reactive and updates cache key
const currentLocale = computed(() => {
  const pathParts = route.path.split('/').filter(Boolean)
  if (pathParts.length > 0 && ['en', 'ar'].includes(pathParts[0])) {
    return pathParts[0] as 'en' | 'ar'
  }
  return locale.value
})

// Sync locale to context only on client side (after mount)
if (process.client) {
  watch(currentLocale, (newLocale) => {
    if (storefrontContext.value.locale !== newLocale) {
      console.log('[Locale] Updating storefrontContext.locale to:', newLocale)
      storefrontContext.value.locale = newLocale
    }
  }, { immediate: true })
}

if (storefrontContext.value.featureFlags.storefront_runtime === false) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}

const nuxtApp = useNuxtApp()
const { resolveRoute } = useRouteResolver()
const { fetchPayload } = useStorefrontPayload()
const { injectSeo } = useRuntimeSeo()

const previewToken = computed(() => {
  if (typeof route.query.previewToken === 'string') {
    return route.query.previewToken
  }
  return typeof route.query.token === 'string' ? route.query.token : null
})

const isPreview = computed(() =>
  route.query.preview === 'true' || route.query.preview === '1'
)

const runtimeDataKey = computed(() =>
  createTenantCacheKey('catch-all-runtime-page', {
    tenantKey: String(
      storefrontContext.value.tenant?.slug ||
      storefrontContext.value.tenant?.id ||
      'default'
    ),
    locale: currentLocale.value,  // ✅ Use currentLocale directly
    artifact: 'page',
    route: route.path,
    previewState: isPreview.value ? 'preview' : 'live',
  })
)

const syncRuntimeContext = () => {
  storefrontContext.value.route = route.path
  storefrontContext.value.preview = isPreview.value
  storefrontContext.value.previewToken = previewToken.value
}

// Plain error class — zero Nuxt composables, safe anywhere including async
class StorefrontPageError extends Error {
  statusCode: number
  isNotFound: boolean
  originalError: unknown

  constructor(message: string, statusCode: number, isNotFound = false, originalError?: unknown) {
    super(message)
    this.name = 'StorefrontPageError'
    this.statusCode = statusCode
    this.isNotFound = isNotFound
    this.originalError = originalError
  }
}

const isNuxtError = (error: unknown): error is Error & { __nuxt_error: true } =>
  Boolean(error && typeof error === 'object' && '__nuxt_error' in error)

const toRuntimePageError = (error: unknown) => {
  if (error instanceof StorefrontPageError) {
    return {
      statusCode: error.statusCode,
      statusMessage: error.message,
      data: {
        runtimeCode: error.isNotFound ? 'runtime.page_not_found' : undefined,
        originalStack: error.stack,
      },
    }
  }

  const normalized = normalizeError(error)
  const isRolloutDisabled =
    normalized.code === 'runtime.rollout_disabled' ||
    (normalized.statusCode === 403 &&
      /storefront runtime is not enabled/i.test(normalized.message))

  return {
    statusCode: isRolloutDisabled ? 404 : (normalized.statusCode || 500),
    statusMessage: isRolloutDisabled ? 'Page not found' : normalized.message,
    data: {
      ...normalized,
      // Preserve the runtime code so error.vue can render the right variant
      runtimeCode: normalized.code,
      originalStack: (error as Error)?.stack,
    },
  }
}

const { data: runtimeData, pending, error } = await useAsyncData(
  () => runtimeDataKey.value,
  async () => {
    // Performance tracking
    const startTime = Date.now()
    console.log('[Runtime] Starting data fetch for:', route.path, 'locale:', locale.value)
    
    syncRuntimeContext()

    const resolveStart = Date.now()
    const resolved = await resolveRoute(route.path)
    console.log('[Runtime] Route resolved in:', Date.now() - resolveStart, 'ms')

    if (resolved.status === 'not_found' || resolved.legacyPassthrough) {
      throw new StorefrontPageError('Page not found', 404, true)
    }

    const bundleStart = Date.now()
    const bundle = await fetchPayload(resolved)
    console.log('[Runtime] Bundle fetched in:', Date.now() - bundleStart, 'ms')
    console.log('[Runtime] Total time:', Date.now() - startTime, 'ms')

    if (!bundle) {
      throw new StorefrontPageError(
        'The storefront runtime payload is unavailable.',
        500
      )
    }

    return { resolved, bundle }
  },
  {
    watch: [
      runtimeDataKey,
      () => route.path,
      () => route.query.preview,
      () => route.query.previewToken,
      () => route.query.token,
    ],
  }
)

// We are synchronously in setup() here — createError is safe
if (error.value) {
  if (isNuxtError(error.value)) {
    throw error.value
  }

  const runtimeError = nuxtApp.runWithContext(() => createError(toRuntimePageError(error.value)))
  throw runtimeError
}

type RuntimePageState = {
  resolved?: RuntimeResolvedRoute | null
  bundle?: StorefrontRuntimeBundle | null
  page?: StorefrontRuntimeBundle['page'] | null
  navigation?: StorefrontRuntimeBundle['navigation'] | null
  theme?: StorefrontRuntimeBundle['theme'] | null
} | null

const runtimeState = computed(() => runtimeData.value as RuntimePageState)
const resolvedRoute = computed(() => runtimeState.value?.resolved ?? null)

const runtimeBundle = computed<StorefrontRuntimeBundle | null>(() => {
  const state = runtimeState.value
  if (!state) return null
  if (state.bundle) return state.bundle
  return state.page && state.navigation && state.theme
    ? { page: state.page, navigation: state.navigation, theme: state.theme }
    : null
})

const runtimePage = computed(() =>
  runtimeBundle.value?.page ?? runtimeState.value?.page ?? null
)

const runtimeShellStyle = computed<Record<string, string>>(() => {
  const theme = runtimeBundle.value?.theme
  if (!theme) return {} as Record<string, string>

  return {
    '--runtime-radius': `var(--radius-${theme.settings.radius})`,
  }
})

useHead(() => {
  const theme = runtimeBundle.value?.theme

  return {
    // ✅ FIX BUG 2: Don't set htmlAttrs here - let app.vue handle it
    // This prevents overriding app.vue's correct dir from useLocaleHead
    meta: theme?.tokens?.colorPrimary
      ? [{ name: 'theme-color', content: theme.tokens.colorPrimary }]
      : [],
    link: theme?.assets?.faviconUrl
      ? [{ rel: 'icon', href: theme.assets.faviconUrl }]
      : [],
  }
})

watchEffect(() => {
  if (runtimePage.value?.seo) {
    injectSeo(mapRuntimeSeoPayload(runtimePage.value.seo))
  }
})
</script>
