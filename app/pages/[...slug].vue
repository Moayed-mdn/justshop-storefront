<template>
  <div
    class="storefront-runtime min-h-screen bg-(--color-bg-page) text-(--color-text-primary)"
    :style="runtimeShellStyle"
  >
    <template v-if="resolvedRoute && runtimePage">
      <RuntimeLayoutManager :layout="runtimePage.layout || resolvedRoute.layout || undefined">
        <RuntimeSectionRenderer :sections="runtimePage.sections" />
      </RuntimeLayoutManager>
    </template>

    <template v-else-if="pending">
      <div class="flex items-center justify-center min-h-screen">
        <UiLoadingSpinner />
      </div>
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

if (storefrontContext.value.featureFlags.storefront_runtime === false) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}

const route = useRoute()
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
    locale: storefrontContext.value.locale || 'en',
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

const isExternalRuntimeRedirect = (target: string) => /^https?:\/\//i.test(target)

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
  runtimeDataKey.value,
  async () => {
    syncRuntimeContext()

    const resolved = await resolveRoute(route.path)

    if (resolved.status === 'redirect' && resolved.redirectTo) {
      // navigateTo needs context — run it via nuxtApp
      await nuxtApp.runWithContext(() =>
        navigateTo(resolved.redirectTo!, {
          redirectCode: resolved.redirectStatus || 302,
          external: isExternalRuntimeRedirect(resolved.redirectTo!),
          replace: resolved.redirectStatus === 301,
        })
      )
      return null
    }

    if (resolved.status === 'not_found' || resolved.legacyPassthrough) {
      throw new StorefrontPageError('Page not found', 404, true)
    }

    const bundle = await fetchPayload(resolved)

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
    '--color-primary': theme.tokens.colorPrimary,
    '--color-secondary': theme.tokens.colorSecondary,
    '--color-accent': theme.tokens.colorAccent,
    '--color-bg-page': theme.tokens.colorSurface,
    '--color-bg-surface': theme.tokens.colorSurface,
    '--color-bg-elevated': theme.tokens.colorSurface,
    '--color-bg-card': theme.tokens.colorSurface,
    '--color-bg-secondary': theme.tokens.colorSurface,
    '--color-bg-hover': `color-mix(in srgb, ${theme.tokens.colorSurface} 90%, #000)`,
    '--color-border-default': `color-mix(in srgb, ${theme.tokens.colorSurface} 80%, #000)`,
    '--color-background': theme.tokens.colorSurface,
    '--color-text-primary': theme.tokens.colorText,
    '--color-text': theme.tokens.colorText,
    '--color-text-secondary': theme.tokens.colorText,
    '--color-text-muted': theme.tokens.colorText,
    '--runtime-font-body': theme.tokens.fontBody,
    '--runtime-font-heading': theme.tokens.fontHeading,
    '--runtime-radius': `var(--radius-${theme.settings.radius})`,
    fontFamily: 'var(--runtime-font-body)',
  }
})

useHead(() => {
  const theme = runtimeBundle.value?.theme
  const styleVars = theme ? Object.entries({
    '--color-primary': theme.tokens.colorPrimary,
    '--color-secondary': theme.tokens.colorSecondary,
    '--color-accent': theme.tokens.colorAccent,
    '--color-bg-page': theme.tokens.colorSurface,
    '--color-bg-surface': theme.tokens.colorSurface,
    '--color-bg-elevated': theme.tokens.colorSurface,
    '--color-bg-card': theme.tokens.colorSurface,
    '--color-bg-secondary': theme.tokens.colorSurface,
    '--color-bg-hover': `color-mix(in srgb, ${theme.tokens.colorSurface} 90%, #000)`,
    '--color-border-default': `color-mix(in srgb, ${theme.tokens.colorSurface} 80%, #000)`,
    '--color-background': theme.tokens.colorSurface,
    '--color-text-primary': theme.tokens.colorText,
    '--color-text': theme.tokens.colorText,
    '--color-text-secondary': theme.tokens.colorText,
    '--color-text-muted': theme.tokens.colorText,
  }).map(([key, value]) => `${key}:${value}`).join(';') : undefined

  return {
    htmlAttrs: {
      lang: runtimePage.value?.locale || storefrontContext.value.locale,
      dir: theme?.settings?.direction || 'ltr',
    },
    bodyAttrs: {
      style: styleVars || (theme?.tokens?.fontBody ? `font-family:${theme.tokens.fontBody};` : undefined),
    },
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
