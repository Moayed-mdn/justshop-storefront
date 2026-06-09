<template>
    <span
      class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full"
      :style="{
        backgroundColor: `var(--status-${normalizedStatus}-bg)`,
        color: `var(--status-${normalizedStatus}-text)`
      }"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {{ label }}
    </span>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    status: string
    type?: 'order' | 'payment'
  }>()
  
  const { t } = useI18n()
  
  const label = computed(() => {
    const prefix = props.type === 'payment' ? 'orders.payment_' : 'orders.status_'
    return t(`${prefix}${props.status}`)
  })
  
  // Map backend status values to token names
  const statusTokenMap: Record<string, string> = {
    'pending': 'pending',
    'processing': 'processing',
    'in_transit': 'shipped',
    'shipped': 'shipped',
    'delivered': 'delivered',
    'completed': 'delivered',
    'cancelled': 'cancelled',
    'canceled': 'cancelled',
    'refunded': 'refunded',
    'paid': 'delivered',  // Use delivered (green) for paid status
    'failed': 'cancelled',  // Use cancelled (red) for failed
    'unpaid': 'pending',  // Use pending for unpaid
  }
  
  const normalizedStatus = computed(() => 
    statusTokenMap[props.status] ?? 'pending'
  )
  </script>