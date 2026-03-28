<!-- pages/orders/track.vue -->
<template>
    <div class="min-h-[60vh] bg-gray-50">
      <!-- Breadcrumb -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav class="flex items-center gap-2 text-sm text-gray-500">
            <NuxtLinkLocale to="/" class="hover:text-[#003D29]">{{ $t('cart.breadcrumb_home') }}</NuxtLinkLocale>
            <span>/</span>
            <span class="text-gray-900 font-medium">{{ $t('orders.guest_title') }}</span>
          </nav>
        </div>
      </div>
  
      <div class="max-w-lg mx-auto px-4 py-8 sm:py-12">
  
        <!-- ═══ Search Form ═══ -->
        <div v-if="!foundOrder" class="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
          <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#003D29]/10 flex items-center justify-center">
              <svg class="w-8 h-8 text-[#003D29]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-900">{{ $t('orders.guest_title') }}</h1>
            <p class="text-sm text-gray-500 mt-1">{{ $t('orders.guest_description') }}</p>
          </div>
  
          <!-- Error -->
          <div v-if="lookupError" class="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-md">
            {{ lookupError }}
          </div>
  
          <form @submit.prevent="handleLookup" class="space-y-4">
            <div>
              <label for="order_number" class="block text-sm font-medium text-gray-700">
                {{ $t('orders.guest_order_number') }}
              </label>
              <input
                id="order_number"
                v-model="form.order_number"
                type="text"
                required
                :placeholder="$t('orders.guest_order_placeholder')"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:ring-[#003D29] focus:border-[#003D29] sm:text-sm"
              >
            </div>
  
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                {{ $t('orders.guest_email') }}
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                :placeholder="$t('orders.guest_email_placeholder')"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:ring-[#003D29] focus:border-[#003D29] sm:text-sm"
              >
            </div>
  
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 px-4 bg-[#003D29] text-white font-semibold rounded-md
                     hover:bg-[#00251C] transition-colors disabled:opacity-60
                     disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
        <div v-else class="space-y-6">
          <!-- Back button -->
          <button
            @click="foundOrder = null"
            class="text-sm text-[#003D29] hover:underline cursor-pointer"
          >
            ← {{ $t('orders.guest_new_search') }}
          </button>
  
          <!-- Order Header -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 class="font-bold text-gray-900 font-mono">#{{ foundOrder.order_number }}</h2>
                <p class="text-xs text-gray-500 mt-1">
                  {{ $t('orders.placed_on') }} {{ formatDate(foundOrder.created_at) }}
                </p>
              </div>
              <div class="flex gap-2">
                <OrderStatusBadge :status="foundOrder.status" type="order" />
                <OrderStatusBadge :status="foundOrder.payment_status" type="payment" />
              </div>
            </div>
  
            <!-- Items -->
            <div class="divide-y divide-gray-100 border-t border-gray-100">
              <div
                v-for="item in foundOrder.items"
                :key="item.id"
                class="flex gap-3 py-4"
              >
                <div class="w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.product_name"
                    class="w-full h-full object-contain"
                  >
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ item.product_name }}</p>
                  <div v-if="item.attributes?.length" class="flex flex-wrap gap-x-2 mt-0.5">
                    <span v-for="attr in item.attributes" :key="attr.name" class="text-xs text-gray-500">
                      {{ attr.name }}: {{ attr.value }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatPrice(item.unit_price) }} × {{ item.quantity }}
                  </p>
                </div>
                <div class="text-sm font-bold text-gray-900 flex-shrink-0">
                  {{ formatPrice(item.subtotal) }}
                </div>
              </div>
            </div>
  
            <!-- Totals -->
            <div class="border-t border-gray-200 pt-4 mt-2 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">{{ $t('orders.subtotal') }}</span>
                <span>{{ formatPrice(foundOrder.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">{{ $t('orders.shipping') }}</span>
                <span :class="foundOrder.shipping_amount === 0 ? 'text-green-600' : ''">
                  {{ foundOrder.shipping_amount === 0 ? $t('orders.free') : formatPrice(foundOrder.shipping_amount) }}
                </span>
              </div>
              <div class="flex justify-between border-t pt-2 border-gray-200">
                <span class="font-bold text-gray-900">{{ $t('orders.total') }}</span>
                <span class="font-bold text-gray-900">{{ formatPrice(foundOrder.total) }}</span>
              </div>
            </div>
          </div>
  
          <!-- Shipping Address -->
          <div
            v-if="foundOrder.shipping_address_data"
            class="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h2 class="font-semibold text-gray-900 mb-3">{{ $t('orders.shipping_address') }}</h2>
            <div class="text-sm text-gray-600 space-y-1">
              <p v-if="foundOrder.shipping_address_data.name" class="font-medium text-gray-900">
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
            class="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h2 class="font-semibold text-gray-900 mb-3">{{ $t('orders.track_order') }}</h2>
            <div class="text-sm space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-500">{{ $t('orders.tracking_number') }}</span>
                <span class="font-mono font-semibold">{{ foundOrder.tracking_number }}</span>
              </div>
              <div v-if="foundOrder.shipped_at" class="flex justify-between">
                <span class="text-gray-500">{{ $t('orders.shipped_at') }}</span>
                <span>{{ formatDate(foundOrder.shipped_at) }}</span>
              </div>
              <div v-if="foundOrder.delivered_at" class="flex justify-between">
                <span class="text-gray-500">{{ $t('orders.delivered_at') }}</span>
                <span>{{ formatDate(foundOrder.delivered_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    layout: 'default',
  })
  
  const { guestLookup, loading } = useOrders()
  const { t } = useI18n()
  
  const form = reactive({
    order_number: '',
    email: '',
  })
  
  const foundOrder = ref<any>(null)
  const lookupError = ref<string | null>(null)
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
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