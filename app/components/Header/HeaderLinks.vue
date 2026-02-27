<template>
  <!-- flex flex-row items-center py-2 gap-6 -->
   <nav>
       <ul :class="[
              mobile?
              'flex flex-col p-3 gap-4':
              'flex flex-row items-center py-2 gap-6'
          ]">
          <li v-for="link in navLinks" :key="link.path" >
              <NuxtLink 
                  :to="link.path"
                  :class="{'block text-center':mobile}"
                  class="text-[var(--color-text-primary)] hover:opacity-60 transition-colors duration-200"
                  >
                  {{ link.name }}
              </NuxtLink>
          </li>
      </ul>
  </nav>
</template>


<script setup>
  defineProps({
      mobile:{
          type:Boolean,
          default:false
      }
  })
  const navLinks = computed(() => [
    { name: $t('header.links.home'), path: '#' },
    { name: $t('header.links.shop'), path: '#' },
    { name: $t('header.links.contact'), path: '#' }
  ])
</script>