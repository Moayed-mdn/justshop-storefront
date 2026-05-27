<template>
  <div class="min-h-[60vh]" :style="{ backgroundColor: 'var(--orders-page-bg)' }">
    <!-- Show skeleton on initial load -->
    <OrdersSkeleton v-if="!isHydrated" />

    <!-- Main content -->
    <div v-else>
      <OrdersBreadcrumb />

      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <OrdersHeader />

        <!-- Filters -->
        <OrdersFilters
          :status-filters="statusFilters"
          :selected-status="selectedStatus"
          :from-date="fromDate"
          :to-date="toDate"
          :has-active-filters="hasActiveFilters"
          @update:status="selectedStatus = $event"
          @update:from-date="fromDate = $event"
          @update:to-date="toDate = $event"
          @clear="clearFilters"
        />

        <!-- Loading State -->
        <OrdersLoading v-if="loading" />

        <!-- Empty State -->
        <OrdersEmpty v-else-if="orders.length === 0" />

        <!-- Orders List -->
        <OrdersList
          v-else
          :orders="orders"
          :pagination="pagination"
          :current-page="currentPage"
          :reordering-id="reorderingId"
          @reorder="handleReorder"
          @cancel="handleCancelPrompt"
          @update:page="currentPage = $event"
        />
      </div>

      <!-- Cancel Confirmation Modal -->
      <OrdersCancelModal
        :show="!!cancelTarget"
        :cancelling="cancelling"
        @cancel="cancelTarget = null"
        @confirm="confirmCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaginationMeta } from '~~/types/api'
import type { Order, OrderStatusFilter } from '~~/types/order'

// Composables
const { fetchOrders, fetchFilters, cancelOrder, reorder, loading } = useOrders()
const cartStore = useCartStore()
const { showSuccessToast, showErrorToast } = useAppToast()
const { t } = useI18n()
const toast = useToast()
const localePath = useLocalePath()

// State
const orders = ref<Order[]>([])
const pagination = ref<PaginationMeta | null>(null)
const statusFilters = ref<OrderStatusFilter[]>([])
const selectedStatus = ref<string | null>(null)
const fromDate = ref<string | null>(null)
const toDate = ref<string | null>(null)
const currentPage = ref(1)
const cancelTarget = ref<string | null>(null)
const cancelling = ref(false)
const reorderingId = ref<string | null>(null)
const isHydrated = ref(false)

// Computed
const hasActiveFilters = computed(() => {
  return !!(selectedStatus.value || fromDate.value || toDate.value)
})

// Methods
const loadOrders = async () => {
  const result = await fetchOrders({
    status: selectedStatus.value,
    from_date: fromDate.value,
    to_date: toDate.value,
    page: currentPage.value,
    per_page: 10,
  })
  if (result) {
    orders.value = result.data
    pagination.value = result.meta.pagination
  }
}

const loadFilters = async () => {
  statusFilters.value = await fetchFilters()
}

const clearFilters = () => {
  selectedStatus.value = null
  fromDate.value = null
  toDate.value = null
}

const handleCancelPrompt = (orderNumber: string) => {
  cancelTarget.value = orderNumber
}

const confirmCancel = async () => {
  if (!cancelTarget.value) return
  cancelling.value = true

  try {
    await cancelOrder(cancelTarget.value)
    showSuccessToast(t('orders.cancel_success'))
    cancelTarget.value = null
    await loadOrders()
    await loadFilters()
  } catch (err: any) {
    showErrorToast(err?.data?.message || 'Failed to cancel order')
  } finally {
    cancelling.value = false
  }
}

const handleReorder = async (orderNumber: string) => {
  reorderingId.value = orderNumber

  try {
    const result = await reorder(orderNumber)

    if (result?.data) {
      const addedCount = result.data.added?.length ?? 0
      const failedCount = result.data.failed?.length ?? 0
      const hasPriceChanges = result.data.added?.some((i) => i.price_changed)

      // Refresh cart
      await cartStore.fetchCart()

      if (failedCount === 0) {
        showSuccessToast(t('orders.reorder_success', { count: addedCount }))
      } else {
        toast.add({
          title: '',
          description: t('orders.reorder_partial', {
            added: addedCount,
            failed: failedCount,
          }),
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

      navigateTo(localePath('/cart'))
    }
  } catch (err: any) {
    showErrorToast(err?.data?.message || t('orders.reorder_failed'))
  } finally {
    reorderingId.value = null
  }
}

// Watchers
watch([selectedStatus, fromDate, toDate], () => {
  currentPage.value = 1
  loadOrders()
})

watch(currentPage, () => {
  loadOrders()
})

// Lifecycle
onMounted(async () => {
  isHydrated.value = true
  await Promise.all([loadOrders(), loadFilters()])
})

// Meta
definePageMeta({
  middleware: 'auth',
})

useHead({
  title: 'My Orders',
  meta: [
    {
      name: 'description',
      content: 'View and manage your order history',
    },
  ],
})
</script>