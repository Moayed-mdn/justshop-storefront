<template>
  <ClientOnly>
    <CartSummary
      :total="total"
      :items-count="itemsCount"
    />
    <template #fallback>
      <div class="w-full lg:w-[380px]">
        <div class="bg-(--color-bg-elevated) rounded-lg border border-(--color-border-default) p-6 space-y-4">
          <div class="h-5 w-32 bg-(--color-bg-surface) rounded animate-pulse" />
          <div class="h-4 w-full bg-(--color-bg-surface) rounded animate-pulse" />
          <div class="h-4 w-full bg-(--color-bg-surface) rounded animate-pulse" />
          <div class="h-10 w-full bg-(--color-bg-surface) rounded animate-pulse" />
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const { total, itemsCount } = useCart()
</script>
