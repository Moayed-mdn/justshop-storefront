<template>
    <div
      data-testid="orders-list"
      class="space-y-4">
      <OrderCard
        v-for="order in orders"
        :key="order.id"
        :order="order"
        :reordering="reorderingId === order.order_number"
        @reorder="$emit('reorder', order.order_number)"
        @cancel="$emit('cancel', order.order_number)"
      />
  
      <!-- Pagination -->
      <OrdersPagination
        v-if="pagination && pagination.total_pages > 1"
        :current-page="currentPage"
        :total-pages="pagination.total_pages"
        @update:page="$emit('update:page', $event)"
      />
    </div>
</template>

<script setup lang="ts">
    import type { PaginationMeta } from '~~/types/api';
    import type { Order } from '~~/types/order'

    defineProps<{
    orders: Order[]
    pagination: PaginationMeta | null
    currentPage: number
    reorderingId: string | null
    }>()

    defineEmits<{
    'reorder': [orderNumber: string]
    'cancel': [orderNumber: string]
    'update:page': [page: number]
    }>()
</script>