<template>
    <div
      class="rounded-lg border p-4 mb-6"
      :style="{
        background: 'var(--color-bg-page)',
        borderColor: 'var(--color-border-default)'
      }"
    >
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Status Tabs -->
        <div class="flex flex-wrap gap-2 flex-1">
          <button
            v-for="statusFilter in statusFilters"
            :key="statusFilter.label"
            @click="$emit('update:status', statusFilter.value)"
            class="px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors cursor-pointer"
            :class="selectedStatus === statusFilter.value
              ? 'bg-(--color-primary) text-white border-(--color-primary)'
              : 'orders-filter-pill'"
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
            <label class="text-xs" :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.date_from') }}</label>
            <input
              :value="fromDate"
              @input="$emit('update:fromDate', ($event.target as HTMLInputElement).value)"
              type="date"
              class="orders-date-input px-2 py-1 text-xs border rounded-md focus:ring-(--color-primary) focus:border-(--color-primary)"
            >
          </div>
          <div class="flex items-center gap-1">
            <label class="text-xs" :style="{ color: 'var(--color-text-muted)' }">{{ $t('orders.date_to') }}</label>
            <input
              :value="toDate"
              @input="$emit('update:toDate', ($event.target as HTMLInputElement).value)"
              type="date"
              class="orders-date-input px-2 py-1 text-xs border rounded-md focus:ring-(--color-primary) focus:border-(--color-primary)"
            >
          </div>
          <button
            v-if="hasActiveFilters"
            @click="$emit('clear')"
            class="text-xs hover:underline cursor-pointer whitespace-nowrap"
            :style="{ color: 'var(--color-error)' }"
          >
            {{ $t('orders.clear_filters') }}
          </button>
        </div>
      </div>
    </div>
  </template>

  <style scoped>
  .orders-filter-pill {
    background: var(--color-bg-page);
    color: var(--color-text-secondary);
    border-color: var(--color-border-default);
  }

  .orders-filter-pill:hover {
    border-color: var(--color-border-strong);
  }

  .orders-date-input {
    border-color: var(--color-border-default);
    background: var(--color-bg-page);
    color: var(--color-text-primary);
  }
  </style>
  
  <script setup lang="ts">
  import type { OrderStatusFilter } from '~~/types/order'
  
  defineProps<{
    statusFilters: OrderStatusFilter[]
    selectedStatus: string | null
    fromDate: string | null
    toDate: string | null
    hasActiveFilters: boolean
  }>()
  
  defineEmits<{
    'update:status': [value: string | null]
    'update:fromDate': [value: string | null]
    'update:toDate': [value: string | null]
    'clear': []
  }>()
  </script>