<template>
  <div class="storefront-runtime">
    <template v-if="pending">
      <!-- Global Loading State -->
      <div class="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    </template>

    <template v-else-if="resolvedRoute && payload">
      <RuntimeLayoutManager :layout="resolvedRoute.layout">
        <RuntimeSectionRenderer :sections="payload.sections" />
      </RuntimeLayoutManager>
    </template>

    <template v-else-if="error">
      <div class="error-page p-10 text-center">
        <h1 class="text-2xl font-bold">Something went wrong</h1>
        <p class="text-gray-600">{{ error.message }}</p>
        <NuxtLink to="/" class="mt-4 inline-block text-(--color-primary)">Go Home</NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouteResolver } from '../../src/core/runtime/router/useRouteResolver'
import { useStorefrontPayload } from '../../src/core/runtime/router/useStorefrontPayload'
import { useRuntimeSeo } from '../../src/core/seo/useRuntimeSeo'

const route = useRoute()
const { resolveRoute } = useRouteResolver()
const { fetchPayload } = useStorefrontPayload()
const { injectSeo } = useRuntimeSeo()

const { data: runtimeData, pending, error } = await useAsyncData(
  `runtime:${route.path}`,
  async () => {
    const resolved = await resolveRoute(route.path)
    
    if (resolved.status === 'not_found') {
      throw createError({ statusCode: 404, statusMessage: 'Page not found' })
    }

    if (resolved.status === 'redirect' && resolved.redirectUrl) {
      return navigateTo(resolved.redirectUrl)
    }

    const payload = await fetchPayload(resolved)
    
    return {
      resolved,
      payload
    }
  },
  {
    watch: [() => route.path]
  }
)

const resolvedRoute = computed(() => {
  const data = runtimeData.value
  return (data && typeof data === 'object' && 'resolved' in data) ? data.resolved : null
})

const payload = computed(() => {
  const data = runtimeData.value
  return (data && typeof data === 'object' && 'payload' in data) ? data.payload : null
})

// Handle SEO
watch(payload, (newPayload) => {
  if (newPayload?.seo) {
    injectSeo({
      title: newPayload.seo.title,
      description: newPayload.seo.description,
      ogType: 'website',
    })
  }
}, { immediate: true })
</script>
