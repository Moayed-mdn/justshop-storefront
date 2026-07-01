<template>
  <ClientOnly>
    <div class="flex-1 space-y-3">
      <div v-if="!initialized" class="text-center py-12">
        <CartSkeleton />
      </div>
      <CartEmpty v-else-if="items.length === 0" />
      <div v-else>
        <TransitionGroup
          name="cart-item"
          tag="div"
          class="space-y-3"
        >
          <CartPageItem
            v-for="item in items"
            :key="item.id"
            :item="item"
          />
        </TransitionGroup>

        <div class="pt-4">
          <NuxtLinkLocale
            :to="routes.home()"
            class="inline-flex items-center gap-2 text-sm font-medium text-(--color-primary) hover:underline transition-colors"
          >
            <svg class="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ $t('cart.continue_shopping') }}
          </NuxtLinkLocale>
        </div>
      </div>
    </div>
    <template #fallback>
      <div class="flex-1"><CartSkeleton /></div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const { items, initialized } = useCart()
const routes = useStorefrontRoutes()
</script>

<style scoped>
.cart-item-enter-active {
  transition: all 0.3s ease-out;
}
.cart-item-leave-active {
  transition: all 0.2s ease-in;
}
.cart-item-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.cart-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.cart-item-move {
  transition: transform 0.3s ease;
}
</style>
