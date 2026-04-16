<template>
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Status Tabs -->
        <div class="flex flex-wrap gap-2 flex-1">
          <button
            v-for="statusFilter in statusFilters"
            :key="statusFilter.label"
            @click="$emit('update:status', statusFilter.value)"
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
              :value="fromDate"
              @input="$emit('update:fromDate', ($event.target as HTMLInputElement).value)"
              type="date"
              class="px-2 py-1 text-xs border border-gray-200 rounded-md focus:ring-[#003D29] focus:border-[#003D29]"
            >
          </div>
          <div class="flex items-center gap-1">
            <label class="text-xs text-gray-500">{{ $t('orders.date_to') }}</label>
            <input
              :value="toDate"
              @input="$emit('update:toDate', ($event.target as HTMLInputElement).value)"
              type="date"
              class="px-2 py-1 text-xs border border-gray-200 rounded-md focus:ring-[#003D29] focus:border-[#003D29]"
            >
          </div>
          <button
            v-if="hasActiveFilters"
            @click="$emit('clear')"
            class="text-xs text-red-500 hover:underline cursor-pointer whitespace-nowrap"
          >
            {{ $t('orders.clear_filters') }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
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