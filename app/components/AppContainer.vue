<template>
    <div :class="['mx-auto px-4 sm:px-6 lg:px-8 w-full', widths[size]]">
        <slot />
    </div>
</template>
<script setup  lang="ts">

interface Props {
  size?: keyof typeof widths
}

withDefaults(defineProps<Props>(),{
    size:'default'
})

const widths = {
    narrow: 'max-w-5xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1440px]'
}
</script>
        
    