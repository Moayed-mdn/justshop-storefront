
<template>
  <div>
    <LayoutShop :data="data" />
  </div>
</template>

<script setup lang="ts">

const { data, pending } = await useUseProduct()


provide('pending', pending)

</script>