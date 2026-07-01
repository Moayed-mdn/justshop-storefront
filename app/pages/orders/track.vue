<!-- pages/orders/track.vue -->
<template>
    <div class="min-h-[60vh]" :style="{ backgroundColor: 'var(--orders-page-bg)' }">
      <!-- Breadcrumb -->
      <div class="border-b" :style="{ backgroundColor: 'var(--color-bg-elevated)', borderBottomColor: 'var(--color-border-default)' }">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav class="flex items-center gap-2 text-sm" :style="{ color: 'var(--color-text-muted)' }">
            <NuxtLinkLocale :to="routes.home()" class="hover:text-(--color-primary)">{{ $t('cart.breadcrumb_home') }}</NuxtLinkLocale>
            <span>/</span>
            <span class="font-medium" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.guest_title') }}</span>
          </nav>
        </div>
      </div>
  
      <div class="max-w-lg mx-auto px-4 py-8 sm:py-12">
  
        <!-- ═══ Search Form ═══ -->
        <div v-if="!foundOrder" class="rounded-lg border p-6 sm:p-8" :style="{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-default)' }">
          <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-(--color-primary)/10 flex items-center justify-center">
              <svg class="w-8 h-8 text-(--color-primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.guest_title') }}</h1>
            <p class="text-sm mt-1" :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.guest_description') }}</p>
          </div>
  
          <!-- Error -->
          <div v-if="lookupError" data-testid="track-lookup-error" class="p-3 mb-4 text-sm rounded-md" :style="{ color: 'var(--color-error)', backgroundColor: 'color-mix(in srgb, var(--color-error) 12%, transparent)' }">
            {{ lookupError }}
          </div>
  
          <form @submit.prevent="handleLookup" data-testid="track-lookup-form" class="space-y-4">
            <div>
              <label for="order_number" class="block text-sm font-medium" :style="{ color: 'var(--color-text-secondary)' }">
                {{ $t('orders.guest_order_number') }}
              </label>
              <input
                id="order_number"
                v-model="form.order_number"
                type="text"
                required
                data-testid="track-order-number-input"
                :placeholder="$t('orders.guest_order_placeholder')"
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
                       focus:ring-(--color-primary) focus:border-(--color-primary) sm:text-sm"
                :style="{ borderColor: 'var(--color-border)' }"
              >
            </div>
  
            <div>
              <label for="email" class="block text-sm font-medium" :style="{ color: 'var(--color-text-secondary)' }">
                {{ $t('orders.guest_email') }}
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                data-testid="track-email-input"
                :placeholder="$t('orders.guest_email_placeholder')"
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
                       focus:ring-(--color-primary) focus:border-(--color-primary) sm:text-sm"
                :style="{ borderColor: 'var(--color-border)' }"
              >
            </div>
  
            <button
              type="submit"
              :disabled="loading"
              data-testid="track-lookup-submit"
              class="orders-track__submit w-full py-3 px-4 bg-(--color-primary) font-semibold rounded-md
                     transition-colors disabled:opacity-60
                     disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              :style="{ color: 'var(--color-text-inverse)' }"
            >
              <svg
                v-if="loading"
                class="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ $t('orders.guest_lookup') }}
            </button>
          </form>
        </div>
  
        <!-- ═══ Found Order ═══ -->
        <div v-else data-testid="track-found-order" class="space-y-6">
          <!-- Back button -->
          <button
            @click="foundOrder = null"
            data-testid="track-new-search-button"
            class="text-sm text-(--color-primary) hover:underline cursor-pointer"
          >
            ← {{ $t('orders.guest_new_search') }}
          </button>
  
          <!-- Order Header -->
          <div class="rounded-lg border p-6" :style="{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-default)' }">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 class="font-bold font-mono" :style="{ color: 'var(--color-text-primary)' }">#{{ foundOrder.order_number }}</h2>
                <p class="text-xs mt-1" :style="{ color: 'var(--color-text-muted)' }">
                  {{ $t('orders.placed_on') }} {{ formatDate(foundOrder.created_at) }}
                </p>
              </div>
              <div class="flex gap-2">
                <OrderStatusBadge :status="foundOrder.status" type="order" />
                <OrderStatusBadge :status="foundOrder.payment_status" type="payment" />
              </div>
            </div>
  
            <!-- Items -->
            <div class="orders-track__divide divide-y border-t" :style="{ borderTopColor: 'var(--color-border-default)' }">
              <div
                v-for="item in foundOrder.items"
                :key="item.id"
                class="flex gap-3 py-4"
              >
                <div class="w-14 h-14 rounded-md overflow-hidden flex-shrink-0" :style="{ backgroundColor: 'var(--color-bg-card)' }">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.product_name"
                    class="w-full h-full object-contain"
                  >
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate" :style="{ color: 'var(--color-text-primary)' }">{{ item.product_name }}</p>
                  <div v-if="item.attributes?.length" class="flex flex-wrap gap-x-2 mt-0.5">
                    <span v-for="attr in item.attributes" :key="attr.name" class="text-xs" :style="{ color: 'var(--color-text-muted)' }">
                      {{ attr.name }}: {{ attr.value }}
                    </span>
                  </div>
                  <p class="text-xs mt-1" :style="{ color: 'var(--color-text-muted)' }">
                    {{ formatPrice(item.unit_price) }} × {{ item.quantity }}
                  </p>
                </div>
                <div class="text-sm font-bold flex-shrink-0" :style="{ color: 'var(--color-text-primary)' }">
                  {{ formatPrice(item.subtotal) }}
                </div>
              </div>
            </div>
  
            <!-- Totals -->
            <div class="border-t pt-4 mt-2 space-y-2 text-sm" :style="{ borderTopColor: 'var(--color-border)' }">
              <div class="flex justify-between">
                <span :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.subtotal') }}</span>
                <span>{{ formatPrice(foundOrder.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.shipping') }}</span>
                <span :style="foundOrder.shipping_amount === 0 ? { color: 'var(--color-success)' } : undefined">
                  {{ foundOrder.shipping_amount === 0 ? $t('orders.free') : formatPrice(foundOrder.shipping_amount) }}
                </span>
              </div>
              <div class="flex justify-between border-t pt-2" :style="{ borderTopColor: 'var(--color-border)' }">
                <span class="font-bold" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.total') }}</span>
                <span class="font-bold" :style="{ color: 'var(--color-text-primary)' }">{{ formatPrice(foundOrder.total) }}</span>
              </div>
            </div>
          </div>
  
          <!-- Shipping Address -->
          <div
            v-if="foundOrder.shipping_address_data"
            class="rounded-lg border p-6"
            :style="{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-default)' }"
          >
            <h2 class="font-semibold mb-3" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.shipping_address') }}</h2>
            <div class="text-sm space-y-1" :style="{ color: 'var(--color-text-secondary)' }">
              <p v-if="foundOrder.shipping_address_data.name" class="font-medium" :style="{ color: 'var(--color-text-primary)' }">
                {{ foundOrder.shipping_address_data.name }}
              </p>
              <p v-if="foundOrder.shipping_address_data.address?.line1">
                {{ foundOrder.shipping_address_data.address.line1 }}
              </p>
              <p v-if="foundOrder.shipping_address_data.address?.line2">
                {{ foundOrder.shipping_address_data.address.line2 }}
              </p>
              <p>
                {{ [
                  foundOrder.shipping_address_data.address?.city,
                  foundOrder.shipping_address_data.address?.state,
                  foundOrder.shipping_address_data.address?.postal_code
                ].filter(Boolean).join(', ') }}
              </p>
              <p v-if="foundOrder.shipping_address_data.address?.country">
                {{ foundOrder.shipping_address_data.address.country }}
              </p>
            </div>
          </div>
  
          <!-- Tracking -->
          <div
            v-if="foundOrder.tracking_number"
            class="rounded-lg border p-6"
            :style="{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-default)' }"
          >
            <h2 class="font-semibold mb-3" :style="{ color: 'var(--color-text-primary)' }">{{ $t('orders.track_order') }}</h2>
            <div class="text-sm space-y-2">
              <div class="flex justify-between">
                <span :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.tracking_number') }}</span>
                <span class="font-mono font-semibold">{{ foundOrder.tracking_number }}</span>
              </div>
              <div v-if="foundOrder.shipped_at" class="flex justify-between">
                <span :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.shipped_at') }}</span>
                <span>{{ formatDate(foundOrder.shipped_at) }}</span>
              </div>
              <div v-if="foundOrder.delivered_at" class="flex justify-between">
                <span :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.delivered_at') }}</span>
                <span>{{ formatDate(foundOrder.delivered_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <style scoped>
  .orders-track__submit:hover:not(:disabled) {
    background-color: var(--color-primary-hover, var(--color-primary));
  }

  .orders-track__divide > :not([hidden]) ~ :not([hidden]) {
    border-top-color: var(--color-border-subtle);
  }
  </style>
  
  <script setup lang="ts">
 import { formatPrice } from '../../utils/price'
 import { formatDate } from '../../utils/date'
  definePageMeta({
    layout: 'system',
  })

  const { t } = useI18n()
  useHead({
    title: t('orders.track_title'),
    meta: [
      { name: 'description', content: t('orders.track_description') },
    ],
  })
  
  const routes = useStorefrontRoutes()
  const { guestLookup, loading } = useOrders()
  
  const form = reactive({
    order_number: '',
    email: '',
  })
  
  const foundOrder = ref<any>(null)
  const lookupError = ref<string | null>(null)
  
  const handleLookup = async () => {
    lookupError.value = null
  
    try {
      const order = await guestLookup(form.order_number, form.email)
      foundOrder.value = order
    } catch (err: any) {
      lookupError.value = err?.data?.message || t('orders.guest_not_found')
    }
  }
  </script>