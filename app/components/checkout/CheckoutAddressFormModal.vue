<template>
  <div v-if="isOpen" class="modal-overlay fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-(--z-modal) p-4">
    <div class="modal-content bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="modal-header border-b px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
        <h3 class="text-xl font-semibold">
          {{ mode === 'edit' ? $t('checkout.edit_address') : $t('checkout.add_new_address') }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Hidden type field -->
        <input type="hidden" v-model="form.type" />
        
        <!-- Name Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('checkout.first_name') }}
              <span v-if="isFieldRequired('first_name')" class="text-red-500">*</span>
            </label>
            <input
              v-model="form.first_name"
              type="text"
              :required="isFieldRequired('first_name')"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('checkout.last_name') }}
              <span v-if="isFieldRequired('last_name')" class="text-red-500">*</span>
            </label>
            <input
              v-model="form.last_name"
              type="text"
              :required="isFieldRequired('last_name')"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('checkout.company') }}
            <span v-if="isFieldRequired('company')" class="text-red-500">*</span>
            <span v-else class="text-gray-400 text-xs">({{ $t('common.optional') }})</span>
          </label>
          <input
            v-model="form.company"
            type="text"
            :required="isFieldRequired('company')"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <!-- Address Lines -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('checkout.address_line_1') }}
            <span v-if="isFieldRequired('address_line_1')" class="text-red-500">*</span>
          </label>
          <input
            v-model="form.address_line_1"
            type="text"
            :required="isFieldRequired('address_line_1')"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('checkout.address_line_2') }} <span class="text-gray-400 text-xs">({{ $t('common.optional') }})</span>
          </label>
          <input
            v-model="form.address_line_2"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <!-- City, State, Postal Code -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('checkout.city') }}
              <span v-if="isFieldRequired('city')" class="text-red-500">*</span>
            </label>
            <input
              v-model="form.city"
              type="text"
              :required="isFieldRequired('city')"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('checkout.state') }}
              <span v-if="isFieldRequired('state')" class="text-red-500">*</span>
            </label>
            <input
              v-model="form.state"
              type="text"
              :required="isFieldRequired('state')"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('checkout.postal_code') }}
              <span v-if="isFieldRequired('postal_code')" class="text-red-500">*</span>
            </label>
            <input
              v-model="form.postal_code"
              type="text"
              :required="isFieldRequired('postal_code')"
              :pattern="postalCodePattern"
              :title="postalCodePatternTitle"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <!-- Country -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('checkout.country') }}
            <span v-if="isFieldRequired('country')" class="text-red-500">*</span>
          </label>
          <select
            v-model="form.country"
            :required="isFieldRequired('country')"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">{{ $t('checkout.select_country') }}</option>
            <option v-for="country in availableCountries" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('checkout.phone') }}
            <span v-if="isFieldRequired('phone')" class="text-red-500">*</span>
            <span v-else class="text-gray-400 text-xs">({{ $t('common.optional') }})</span>
          </label>
          <input
            v-model="form.phone"
            type="tel"
            :required="isFieldRequired('phone')"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-red-800 text-sm">{{ error }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            :disabled="saving"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            :disabled="saving"
          >
            <span v-if="saving">{{ $t('common.saving') }}...</span>
            <span v-else>{{ mode === 'edit' ? $t('common.update') : $t('common.add') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import { useAddresses } from '@/composables/useAddresses'
import { DEFAULT_STORE_ADDRESS_SETTINGS, type StoreAddressSettings } from '~~/types/address'

const props = defineProps<{
  isOpen: boolean
  mode: 'add' | 'edit'
  address?: any
  addressSettings?: StoreAddressSettings | null
}>()

const emit = defineEmits<{
  close: []
  save: [address: any]
}>()

const { createAddress, updateAddress, validateAddress } = useAddresses()

const form = reactive({
  first_name: '',
  last_name: '',
  company: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  phone: '',
  type: 'shipping',
})

const saving = ref(false)
const error = ref<string | null>(null)

const effectiveAddressSettings = computed<StoreAddressSettings>(() => ({
  ...DEFAULT_STORE_ADDRESS_SETTINGS,
  ...(props.addressSettings || {}),
}))

const availableCountries = computed(() => effectiveAddressSettings.value.allowed_countries || [])

const requiredFields = computed(() => new Set(effectiveAddressSettings.value.required_fields || []))

function isFieldRequired(field: string): boolean {
  if (field === 'phone') {
    return requiredFields.value.has(field) || effectiveAddressSettings.value.require_phone
  }

  if (field === 'company') {
    return requiredFields.value.has(field) || effectiveAddressSettings.value.require_company
  }

  return requiredFields.value.has(field)
}

const postalCodeRule = computed(() => {
  if (!form.country) return null

  return effectiveAddressSettings.value.validation_rules?.postal_code?.[form.country.toUpperCase()] || null
})

const postalCodePattern = computed(() => {
  return postalCodeRule.value?.pattern || ''
})

const postalCodePatternTitle = computed(() => {
  if (postalCodeRule.value?.example) {
    return `Example: ${postalCodeRule.value.example}`
  }

  return 'Please enter a valid postal code'
})

// Initialize form when address prop changes
watch(() => props.address, (address) => {
  if (address && props.mode === 'edit') {
    Object.assign(form, {
      first_name: address.first_name || '',
      last_name: address.last_name || '',
      company: address.company || '',
      address_line_1: address.address_line_1 || '',
      address_line_2: address.address_line_2 || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country || '',
      phone: address.phone || '',
      type: address.type || 'shipping',
    })
  } else {
    // Reset form for add mode
    Object.keys(form).forEach(key => {
      form[key as keyof typeof form] = ''
    })
    // Set default type for new addresses
    form.type = 'shipping'
  }
}, { immediate: true })

async function handleSubmit() {
  try {
    saving.value = true
    error.value = null

    const addressData = { ...form }
    const validationResult = await validateAddress(addressData)

    if (validationResult?.errors?.length) {
      error.value = validationResult.errors.map(issue => issue.message).join(' ')
      saving.value = false
      return
    }

    let result
    if (props.mode === 'edit' && props.address?.id) {
      result = await updateAddress(props.address.id, addressData)
    } else {
      result = await createAddress(addressData)
    }

    if (result && result.data) {
      emit('save', result.data)
      emit('close')
    } else {
      error.value = 'Failed to save address'
    }
  } catch (err: any) {
    const apiErrors = err?.data?.errors
    const firstApiError = apiErrors ? Object.values(apiErrors).flat()[0] : null
    error.value = firstApiError || err?.data?.message || err.message || 'An error occurred'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
