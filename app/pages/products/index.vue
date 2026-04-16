
<template>
  <div>
    <LayoutShop :data="data" />
  </div>
</template>

<script setup lang="ts">

const { data, pending } =  useUseProduct()


provide('pending', pending)

</script>