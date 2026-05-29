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

const isPreview = computed(() => route.query.preview === 'true' || route.query.preview === '1')
const runtimeDataKey = computed(() => createTenantCacheKey('catch-all-runtime-page', {
  artifact: 'page',
  route: route.path,
  previewState: isPreview.value ? 'preview' : 'live',
}))

const syncRuntimeContext = () => {
  storefrontContext.value.route = route.path
  storefrontContext.value.preview = isPreview.value
  storefrontContext.value.previewToken = previewToken.value
}

const toRuntimePageError = (error: unknown) => {
  const normalized = normalizeError(error)

  if (
    normalized.code === 'runtime.rollout_disabled'
    || (
      normalized.statusCode === 403
      && /storefront runtime is not enabled/i.test(normalized.message)
    )
  ) {
    return createError({
      statusCode: 404,
      statusMessage: 'Page not found',
      data: normalized,
    })
  }

  return createError({
    statusCode: normalized.statusCode || 500,
    statusMessage: normalized.message,
    data: normalized,
  })
}

const isExternalRuntimeRedirect = (target: string) => /^https?:\/\//i.test(target)

const { data: runtimeData, pending, error } = await useAsyncData(
  runtimeDataKey.value,
  async () => {
    syncRuntimeContext()

    try {
      const resolved = await nuxtApp.runWithContext(() => resolveRoute(route.path))

      if (resolved.status === 'redirect' && resolved.redirectTo) {
        return await navigateTo(resolved.redirectTo, {
          redirectCode: resolved.redirectStatus || 302,
          external: isExternalRuntimeRedirect(resolved.redirectTo),
          replace: resolved.redirectStatus === 301,
        })
      }

      if (resolved.status === 'not_found' || resolved.legacyPassthrough) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Page not found',
        })
      }

      const bundle = await nuxtApp.runWithContext(() => fetchPayload(resolved))

      if (!bundle) {
        throw createError({
          statusCode: 500,
          statusMessage: 'The storefront runtime payload is unavailable.',
        })
      }

      return {
        resolved,
        bundle,
      }
    } catch (runtimeError) {
      throw toRuntimePageError(runtimeError)
    }
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

if (error.value) {
  throw toRuntimePageError(error.value)
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

  if (!state) {
    return null
  }

  if (state.bundle) {
    return state.bundle
  }

  return state.page && state.navigation && state.theme
    ? {
        page: state.page,
        navigation: state.navigation,
        theme: state.theme,
      }
    : null
})

const runtimePage = computed(() => runtimeBundle.value?.page ?? runtimeState.value?.page ?? null)
const runtimeShellStyle = computed<Record<string, string>>(() => {
  const theme = runtimeBundle.value?.theme

  if (!theme) {
    return {} as Record<string, string>
  }

  return {
    '--color-primary': theme.tokens.colorPrimary,
    '--color-bg-page': theme.tokens.colorSurface,
    '--color-bg-surface': theme.tokens.colorSurface,
    '--color-text-primary': theme.tokens.colorText,
    '--runtime-font-body': theme.tokens.fontBody,
    '--runtime-font-heading': theme.tokens.fontHeading,
    '--runtime-radius': `var(--radius-${theme.settings.radius})`,
    fontFamily: 'var(--runtime-font-body)',
  }
})

useHead(() => ({
  htmlAttrs: {
    lang: runtimePage.value?.locale || storefrontContext.value.locale,
    dir: runtimeBundle.value?.theme.settings.direction || 'ltr',
  },
  bodyAttrs: {
    style: runtimeBundle.value?.theme?.tokens.fontBody
      ? `font-family:${runtimeBundle.value.theme.tokens.fontBody};`
      : undefined,
  },
  meta: runtimeBundle.value?.theme?.tokens.colorPrimary
    ? [
        {
          name: 'theme-color',
          content: runtimeBundle.value.theme.tokens.colorPrimary,
        },
      ]
    : [],
  link: runtimeBundle.value?.theme?.assets.faviconUrl
    ? [
        {
          rel: 'icon',
          href: runtimeBundle.value.theme.assets.faviconUrl,
        },
      ]
    : [],
}))

watchEffect(() => {
  if (runtimePage.value?.seo) {
    injectSeo(mapRuntimeSeoPayload(runtimePage.value.seo))
  }
})
</script>
