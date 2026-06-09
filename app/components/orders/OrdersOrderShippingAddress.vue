<template>
  <div
    v-if="addressData"
    class="bg-(--color-bg-card) rounded-lg border border-(--color-border-default) p-6"
  >
    <h2 class="font-semibold text-(--color-text-primary) mb-3">{{ $t('orders.shipping_address') }}</h2>
    <div class="text-sm text-(--color-text-secondary) space-y-1">
      <p v-if="addressData.name" class="font-medium text-(--color-text-primary)">
        {{ addressData.name }}
      </p>
      <p v-if="addressData.address?.line1">
        {{ addressData.address.line1 }}
      </p>
      <p v-if="addressData.address?.line2">
        {{ addressData.address.line2 }}
      </p>
      <p>
        {{ [
          addressData.address?.city,
          addressData.address?.state,
          addressData.address?.postal_code
        ].filter(Boolean).join(', ') }}
      </p>
      <p v-if="addressData.address?.country">
        {{ addressData.address.country }}
      </p>
      <p v-if="addressData.phone" class="pt-1">
        📞 {{ addressData.phone }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  addressData: {
    name?: string
    address?: {
      line1?: string
      line2?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
    phone?: string
  } | null
}>()
</script>
