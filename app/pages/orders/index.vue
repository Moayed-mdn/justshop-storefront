<!-- pages/orders/index.vue -->
<template>
    <div class="min-h-[60vh] bg-gray-50">
      <!-- Breadcrumb -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav class="flex items-center gap-2 text-sm text-gray-500">
            <NuxtLinkLocale to="/" class="hover:text-[#003D29] transition-colors">
              {{ $t('cart.breadcrumb_home') }}
            </NuxtLinkLocale>
            <span>/</span>
            <span class="text-gray-900 font-medium">{{ $t('orders.title') }}</span>
          </nav>
        </div>
      </div>
  
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <!-- Page Header -->
        <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ $t('orders.title') }}</h1>
            <p class="text-sm text-gray-500 mt-1">{{ $t('orders.subtitle') }}</p>
          </div>
  
          <!-- Guest lookup link -->
          <NuxtLinkLocale
            to="/orders/track"
            class="text-sm text-[#003D29] hover:underline font-medium"
          >
            {{ $t('orders.guest_title') }}
          </NuxtLinkLocale>
        </div>
  
        <!-- ═══ Filters ═══ -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Status Tabs -->
            <div class="flex flex-wrap gap-2 flex-1">
              <button
                v-for="statusFilter in statusFilters"
                :key="statusFilter.label"
                @click="selectedStatus = statusFilter.value"
                class="px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors cursor-pointer"
                :class="selectedStatus === statusFilter.value
                  ? 'bg-[#003D29] text-white border-[#003D29]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
              >
                {{ $t(`orders.filter_${statusFilter.label}`) }}
                <span
                  v-if="statusFilter.count > 0"
                  class="ltr:ml-1 rtl:mr-1 opacity-70"
                >
                  ({{ statusFilter.count }})
                </span>
              </button>
            </div>
  
            <!-- Date Filters -->
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1">
                <label class="text-xs text-gray-500">{{ $t('orders.date_from') }}</label>
                <input
                  v-model="fromDate"
                  type="date"
                  class="px-2 py-1 text-xs border border-gray-200 rounded-md focus:ring-[#003D29] focus:border-[#003D29]"
                >
              </div>
              <div class="flex items-center gap-1">
                <label class="text-xs text-gray-500">{{ $t('orders.date_to') }}</label>
                <input
                  v-model="toDate"
                  type="date"
                  class="px-2 py-1 text-xs border border-gray-200 rounded-md focus:ring-[#003D29] focus:border-[#003D29]"
                >
              </div>
              <button
                v-if="hasActiveFilters"
                @click="clearFilters"
                class="text-xs text-red-500 hover:underline cursor-pointer whitespace-nowrap"
              >
                {{ $t('orders.clear_filters') }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- ═══ Loading ═══ -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <svg class="animate-spin h-8 w-8 text-[#003D29]" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
  
        <!-- ═══ Empty ═══ -->
        <div v-else-if="orders.length === 0" class="text-center py-16">
          <div class="w-20 h-20 mx-auto mb-4 text-gray-300">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002
                   2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9
                   5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2
                   0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-gray-900">{{ $t('orders.empty_title') }}</h2>
          <p class="text-sm text-gray-500 mt-1">{{ $t('orders.empty_description') }}</p>
          <NuxtLinkLocale
            to="/"
            class="inline-block mt-4 px-6 py-2 text-sm font-medium text-white bg-[#003D29]
                   rounded-md hover:bg-[#00251C] transition-colors"
          >
            {{ $t('orders.start_shopping') }}
          </NuxtLinkLocale>
        </div>
  
        <!-- ═══ Orders List ═══ -->
        <div v-else class="space-y-4">
          <OrderCard
            v-for="order in orders"
            :key="order.id"
            :order="order"
            :reordering="reorderingId === order.order_number"
            @reorder="handleReorder"
            @cancel="handleCancelPrompt"
          />
  
          <!-- Pagination -->
          <div
            v-if="pagination && pagination.last_page > 1"
            class="flex items-center justify-center gap-2 pt-6"
          >
            <button
              @click="currentPage--"
              :disabled="currentPage <= 1"
              class="px-3 py-1.5 text-sm border border-gray-200 rounded-md
                     hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ←
            </button>
  
            <span class="text-sm text-gray-600 px-3">
              {{ currentPage }} / {{ pagination.last_page }}
            </span>
  
            <button
              @click="currentPage++"
              :disabled="currentPage >= pagination.last_page"
              class="px-3 py-1.5 text-sm border border-gray-200 rounded-md
                     hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              →
            </button>
          </div>
        </div>
      </div>
  
      <!-- ═══ Cancel Confirmation Modal ═══ -->
      <div
        v-if="cancelTarget"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="cancelTarget = null"
      >
        <div class="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('orders.cancel_confirm_title') }}</h3>
          <p class="text-sm text-gray-500 mt-2">{{ $t('orders.cancel_confirm_message') }}</p>
          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="cancelTarget = null"
              class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300
                     rounded-md hover:bg-gray-50 cursor-pointer"
            >
              {{ $t('orders.cancel_keep') }}
            </button>
            <button
              @click="confirmCancel"
              :disabled="cancelling"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md
                     hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              {{ cancelling ? '...' : $t('orders.cancel_confirm_button') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
  })
  
  const {
    fetchOrders,
    fetchFilters,
    cancelOrder,
    reorder,
    loading,
  } = useOrders()
  const cartStore = useCartStore()
  const toast = useToast()
  const { t } = useI18n()
  
  // ── State ──
  const orders = ref<any[]>([])
  const pagination = ref<any>(null)
  const statusFilters = ref<any[]>([])
  const selectedStatus = ref<string | null>(null)
  const fromDate = ref<string | null>(null)
  const toDate = ref<string | null>(null)
  const currentPage = ref(1)
  const cancelTarget = ref<string | null>(null)
  const cancelling = ref(false)
  const reorderingId = ref<string | null>(null)
  
  const hasActiveFilters = computed(() => {
    return selectedStatus.value || fromDate.value || toDate.value
  })
  
  // ── Load data ──
  const loadOrders = async () => {
    try {
      const result = await fetchOrders({
        status: selectedStatus.value,
        from_date: fromDate.value,
        to_date: toDate.value,
        page: currentPage.value,
        per_page: 10,
      })
      orders.value = result.orders
      pagination.value = result.pagination
    } catch {
      // error handled in composable
    }
  }
  
  const loadFilters = async () => {
    statusFilters.value = await fetchFilters()
  }
  
  // ── Watch filters → reload ──
  watch([selectedStatus, fromDate, toDate], () => {
    currentPage.value = 1
    loadOrders()
  })
  
  watch(currentPage, () => {
    loadOrders()
  })
  
  // ── Clear filters ──
  const clearFilters = () => {
    selectedStatus.value = null
    fromDate.value = null
    toDate.value = null
  }
  
  // ── Cancel ──
  const handleCancelPrompt = (orderNumber: string) => {
    cancelTarget.value = orderNumber
  }
  
  const confirmCancel = async () => {
    if (!cancelTarget.value) return
    cancelling.value = true
  
    try {
      await cancelOrder(cancelTarget.value)
      toast.add({
        title: '',
        description: t('orders.cancel_success'),
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })
      cancelTarget.value = null
      await loadOrders()
      await loadFilters()
    } catch (err: any) {
      toast.add({
        title: '',
        description: err?.data?.message || 'Failed to cancel order',
        color: 'error',
        icon: 'i-heroicons-x-circle',
      })
    } finally {
      cancelling.value = false
    }
  }
  
  // ── Reorder ──
  const handleReorder = async (orderNumber: string) => {
    reorderingId.value = orderNumber
  
    try {
      const result = await reorder(orderNumber)
  
      const addedCount = result.data?.added?.length ?? 0
      const failedCount = result.data?.failed?.length ?? 0
      const hasPriceChanges = result.data?.added?.some((i: any) => i.price_changed)
  
      // Refresh cart
      await cartStore.fetchCart()
  
      if (failedCount === 0) {
        toast.add({
          title: '',
          description: t('orders.reorder_success', { count: addedCount }),
          color: 'success',
          icon: 'i-heroicons-check-circle',
        })
      } else {
        toast.add({
          title: '',
          description: t('orders.reorder_partial', { added: addedCount, failed: failedCount }),
          color: 'warning',
          icon: 'i-heroicons-exclamation-triangle',
        })
      }
  
      if (hasPriceChanges) {
        toast.add({
          title: '',
          description: t('orders.reorder_price_changed'),
          color: 'info',
          icon: 'i-heroicons-information-circle',
        })
      }
  
      navigateTo('/cart')
    } catch (err: any) {
      toast.add({
        title: '',
        description: err?.data?.message || t('orders.reorder_failed'),
        color: 'error',
        icon: 'i-heroicons-x-circle',
      })
    } finally {
      reorderingId.value = null
    }
  }
  
  // ── Init ──
  onMounted(async () => {
    await Promise.all([loadOrders(), loadFilters()])
  })
  </script>