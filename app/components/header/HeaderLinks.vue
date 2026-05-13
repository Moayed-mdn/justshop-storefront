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
const { t } = useI18n();
import { productRoutes } from '~~/shared/routes/products'
defineProps({
    mobile:{
        type:Boolean,
        default:false
    }
})

const closeMenu = inject('closeMenu') 

const navLinks = computed(() => [
{ name: t('header.links.home'), path: '/' },
{ name: t('header.links.shop'), path: productRoutes.index() },
{ name: t('header.links.contact'), path: '#' }
])
</script>

<style scoped>

.router-link-exact-active {
  border-bottom: 2px solid var(--color-border-active);
}
</style>