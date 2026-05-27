
<template>
  <div>
    <LayoutShop :data="data" />
  </div>
</template>

<script setup lang="ts">

const { data, pending } =  useProduct()


provide('pending', pending)

</script>