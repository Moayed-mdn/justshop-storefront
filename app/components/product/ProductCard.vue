<template>
  <div class="w-full">
    <div
      class="bg-(--card-bg-light) rounded-(--radius-md) flex items-center justify-center
             h-(--card-img-height-mobile) lg:h-(--card-img-height-desktop) overflow-hidden group"
    >
      <NuxtLinkLocale :to="routes.product(product.slug)" class="cursor-pointer">
        <img
          class="max-h-full object-contain transition-transform duration-(--card-transition-speed) group-hover:scale-110"
          :src="product.image"
          :alt="product.name"
          loading="lazy"
          decoding="async"
        />
      </NuxtLinkLocale>
    </div>

    <div class="flex flex-col px-2 mt-3">
      <div class="flex justify-between w-full mb-1 font-bold">
        <h3 class="line-clamp-1">{{ product.name }}</h3>
        <ClientOnly>
          <UiPrice
            :price="product.price"
            :currency="product.currency || 'USD'"
            integerClass="text-lg"
          />
        </ClientOnly>
      </div>

      <p class="text-sm text-(--color-text-secondary) line-clamp-2 first-letter:uppercase lowercase">
        {{ product.description }}
      </p>

      <div>
        <ClientOnly>
          <UiCartButton
            class="cart-fade-in"
            :product-id="Number(product.id)"
            :product-variant-id="Number(product.variantId)"
            :name="product.name"
            :price="String(product.price)"
            :image="product.image"
          />
          <template #fallback>
            <div class="py-2 px-4 mt-2 rounded-full border
                        border-(--card-btn-border) opacity-20">
              <span class="invisible">{{ $t('cart.add_to_cart') }}</span>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductDto } from '~/../src/core/api/dto/storefront'
import UiPrice from '../ui/Price.vue'
import UiCartButton from '../ui/CartButton.vue'

const routes = useStorefrontRoutes()

defineProps<{ product: ProductDto }>()
</script>

<style scoped>
/* ===== Skeleton → Button (ClientOnly mount) ===== */
.cart-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1);    }
}
</style>