<template>
  <div class="checkout-step">
    <h2 class="text-2xl font-semibold mb-6">{{ $t('checkout.shipping_address') }}</h2>

    <!-- Saved Addresses -->
    <div v-if="addresses.length > 0" class="space-y-4 mb-6">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="address-card"
        :class="{ 'selected': selectedAddress?.id === address.id }"
        @click="$emit('select', address)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-semibold">{{ address.name || `${address.first_name} ${address.last_name}` }}</h3>
              <span v-if="address.is_default_shipping" class="badge badge-primary">
                {{ $t('address.default_shipping') }}
              </span>
            </div>
            <p class="text-sm text-gray-600">
              {{ address.address_line_1 }}
              <span v-if="address.address_line_2">, {{ address.address_line_2 }}</span>
            </p>
            <p class="text-sm text-gray-600">
              {{ address.city }}<span v-if="address.state">, {{ address.state }}</span> {{ address.postal_code }}
            </p>
            <p class="text-sm text-gray-600">{{ getCountryName(address.country) }}</p>
            <p v-if="address.phone" class="text-sm text-gray-600 mt-1">{{ address.phone }}</p>
          </div>

          <!-- Selection Indicator -->
          <div v-if="selectedAddress?.id === address.id" class="flex-shrink-0 ml-4">
            <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Address Button -->
    <button
      @click="showAddressForm = true"
      class="btn btn-outline w-full mb-6"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      {{ $t('address.add_new') }}
    </button>

    <!-- Continue Button -->
    <button
      @click="$emit('continue')"
      :disabled="!selectedAddress"
      class="btn btn-primary w-full"
      :class="{ 'opacity-50 cursor-not-allowed': !selectedAddress }"
    >
      {{ $t('checkout.continue_to_shipping') }}
      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>

    <!-- Address Form Modal -->
    <CheckoutAddressFormModal
      :is-open="showAddressForm"
      mode="add"
      :address-settings="addressSettings"
      @close="showAddressForm = false"
      @save="handleAddressSaved"
    />
  </div>
</template>

<script setup lang="ts">
import type { StoreAddressSettings } from '~~/types/address'

const { t } = useI18n()
const checkoutStore = useCheckoutStore()

const props = defineProps<{
  addresses: any[]
  selectedAddress: any | null
  addressSettings: StoreAddressSettings
}>()

const showAddressForm = ref(false)

/**
 * Get country name from code
 */
function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    US: 'United States',
    CA: 'Canada',
    GB: 'United Kingdom',
    AU: 'Australia',
    DE: 'Germany',
    FR: 'France',
    IT: 'Italy',
    ES: 'Spain',
    MX: 'Mexico',
    BR: 'Brazil',
    JP: 'Japan',
    CN: 'China',
    IN: 'India',
    SA: 'Saudi Arabia',
    AE: 'United Arab Emirates',
    EG: 'Egypt',
    JO: 'Jordan',
  }
  return countries[code] || code
}

const emit = defineEmits<{
  select: [address: any]
  continue: []
}>()

/**
 * Handle address saved
 */
function handleAddressSaved(address: any) {
  showAddressForm.value = false
  // Check if we're adding or updating an address
  const isExistingAddress = props.addresses.some(a => a.id === address.id)
  if (isExistingAddress) {
    checkoutStore.updateAddress(address)
  } else {
    checkoutStore.addAddress(address)
  }
  // Auto-select the new address
  emit('select', address)
}
</script>

<style scoped>
.checkout-step {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  padding: 1.5rem;
}

.address-card {
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.address-card:hover {
  border-color: var(--color-primary-300, #93c5fd);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.address-card.selected {
  border-color: var(--color-primary-600, #2563eb);
  background-color: var(--color-primary-50, #eff6ff);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;
}

.badge-primary {
  background-color: var(--color-primary-100, #dbeafe);
  color: var(--color-primary-700, #1d4ed8);
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: var(--color-primary-600, #2563eb);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-700, #1d4ed8);
}

.btn-outline {
  border: 2px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  border-color: var(--color-primary-600, #2563eb);
  color: var(--color-primary-600, #2563eb);
}
</style>
