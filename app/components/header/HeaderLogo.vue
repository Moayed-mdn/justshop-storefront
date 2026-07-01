<template>
    <div class="w-(--header-logo-width)" :style="logoStyle">
        <NuxtLinkLocale :to="logoRoute" class="cursor-pointer text-2xl">
            <img v-if="logoSrc" :src="logoSrc" :alt="logoAlt" class="w-full h-full object-contain">
            <div v-else>
                <img src="~/assets/icons/logo.png" alt="">
            </div>
        </NuxtLinkLocale>
    </div>
</template>

<script setup lang="ts">
import { useTheme } from '~~/src/core/theme/composables/useTheme'

const props = defineProps<{
    logoSettings?: Record<string, unknown>
}>()

const { theme: themeData } = useTheme()
const routes = useStorefrontRoutes()

const logoSrc = computed(() => {
    if (props.logoSettings?.logo_url && typeof props.logoSettings.logo_url === 'string' && props.logoSettings.logo_url) {
        return props.logoSettings.logo_url
    }
    if (themeData.value?.assets?.logoUrl) {
        return themeData.value.assets.logoUrl
    }
    return null
})

const logoAlt = computed(() => {
    if (props.logoSettings?.logo_alt_text && typeof props.logoSettings.logo_alt_text === 'string' && props.logoSettings.logo_alt_text) {
        return props.logoSettings.logo_alt_text
    }
    return themeData.value?.branding?.storeName ?? ''
})

const logoRoute = computed(() => {
    if (props.logoSettings?.logo_link && typeof props.logoSettings.logo_link === 'string' && props.logoSettings.logo_link && props.logoSettings.logo_link !== 'home') {
        return props.logoSettings.logo_link
    }
    return routes.home()
})

const logoStyle = computed(() => {
    const maxWidth = props.logoSettings?.logo_max_width
    if (maxWidth && typeof maxWidth === 'number' && maxWidth > 0) {
        return { maxWidth: `${maxWidth}px` }
    }
    return {}
})
</script>
