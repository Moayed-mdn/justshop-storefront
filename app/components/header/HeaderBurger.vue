<template>
  <div
    ref="wrapper" 
    class="absolute w-full bg-(--header-burger-bg) transition duration-(--header-burger-duration)
     inset-s-0 mt-2 z-(--header-burger-z)
     top-(--header-burger-top-mobile) sm:top-(--header-burger-top)
     "
    :class="showLinks? 'translate-y-0': '-translate-y-250'" 
    
    id="header-mobile-nav"
    role="navigation"
    :aria-hidden="showLinks ? 'false' : 'true'"
      >
    <template v-if="runtimeHeaderItems.length">
      <nav class="flex flex-col p-3 gap-(--header-gap-base)">
        <template v-for="item in runtimeHeaderItems" :key="item.id">
          <a
            v-if="item.external"
            :href="item.path"
            target="_blank"
            rel="noreferrer noopener"
            class="text-(--color-text-secondary) w-fit mx-auto whitespace-nowrap hover:opacity-(--header-opacity) transition-colors duration-(--header-duration) cursor-pointer block text-center"
          >
            {{ item.label }}
          </a>
          <NuxtLinkLocale
            v-else
            :to="item.path"
            @click="closeMenu"
            class="text-(--color-text-secondary) w-fit mx-auto whitespace-nowrap hover:opacity-(--header-opacity) transition-colors duration-(--header-duration) cursor-pointer block text-center"
          >
            {{ item.label }}
          </NuxtLinkLocale>
        </template>
      </nav>
    </template>
    <HeaderLinks v-else mobile/>
  </div>
</template>

<script setup lang="ts">
import { useStorefrontContext } from '~~/src/core/tenant/composables'

const props = defineProps({
  showLinks: Boolean,
  burgerButtonRef: {
    type: Object,
    default: null
  }
})
 
const closeMenu = inject('closeMenu') as () => void

const wrapper = ref(null)

onClickOutside(
    wrapper,
    closeMenu,
    {
      ignore: ['#burger-menu-trigger']
    }
)

const context = useStorefrontContext()
const runtimeHeaderItems = computed(() => context.value.navigation?.header ?? [])
</script>
