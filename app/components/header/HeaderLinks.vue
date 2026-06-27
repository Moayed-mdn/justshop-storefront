<template>
  <nav>
      <ul :class="[
             mobile?
             'flex flex-col p-3 gap-(--header-gap-base)':
             'flex flex-row items-center py-2 gap-(--header-gap-wide)'
         ]">
         <li v-for="link in navLinks" :key="link.path" >
<NuxtLinkLocale 
                 @click="closeMenu"
                 :to="link.path"
                 :class="{'block text-center':mobile}"
                 class="text-(--color-text-secondary) w-fit mx-auto whitespace-nowrap hover:opacity-(--header-opacity) transition-colors duration-(--header-duration) cursor-pointer"
                 >
                 {{ link.name }}
              </NuxtLinkLocale>
         </li>
     </ul>
 </nav>
</template>

<script setup lang="ts">
import { useStorefrontContext } from '~~/src/core/tenant/composables'

const { t } = useI18n();
defineProps({
    mobile:{
        type:Boolean,
        default:false
    }
})

const closeMenu = inject('closeMenu') 

const routes = useStorefrontRoutes()
const context = useStorefrontContext()

// Use navigation from API if available, otherwise fallback to hardcoded
const navLinks = computed(() => {
  // If we have navigation data from the API, use it
  if (context.value.navigation?.header && context.value.navigation.header.length > 0) {
    return context.value.navigation.header.map(item => ({
      name: item.label,
      path: item.path,
      external: item.external || false,
    }))
  }
  
  // Fallback to default navigation (only shown if API returns no data)
  return [
    { name: t('header.links.home'), path: routes.home(), external: false },
    { name: t('header.links.shop'), path: routes.shop(), external: false },
    { name: t('header.links.contact'), path: '#', external: false },
  ]
})
</script>

<style scoped>

.router-link-exact-active {
  border-bottom: 2px solid var(--color-border-active);
}
</style>