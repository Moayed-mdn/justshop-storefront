<template>
  <div
    ref="wrapper" 
    class="absolute w-full bg-[var(--bg-white)] transition duration-[var(--header-burger-duration)] start-0 mt-2 z-[var(--z-dropdown)]"
    :class="showLinks? 'translate-y-0': 'translate-y-[-1000px]'" 
    :style="{top: burgerTop}"
    id="header-mobile-nav"
    role="navigation"
    :aria-hidden="showLinks ? 'false' : 'true'"
      >
    <HeaderLinks mobile/>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  showLinks: Boolean,
  burgerButtonRef: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['update:showLinks'])
const wrapper = ref(null)
const burgerTop = 'var(--header-total-height)'

onClickOutside(
    wrapper,
    () => emit('update:showLinks', false),
    {
      ignore: ['#burger-menu-trigger']
    }
)
</script>