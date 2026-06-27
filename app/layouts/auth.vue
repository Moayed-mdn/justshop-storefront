<template>
  <StorefrontShell :variant="shellVariant">
    <slot />
  </StorefrontShell>
</template>

<script setup lang="ts">
const shellVariant = ref<'minimal' | 'auth-template'>('minimal')

const { navigation } = useAuthPageTemplate()

watchEffect(() => {
  if (navigation.value) {
    shellVariant.value = 'auth-template'
  }
})
</script>
