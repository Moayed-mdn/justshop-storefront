<template>
  <ProfileSectionCard>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900">{{ $t('address.saved_addresses') }}</h3>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
      >
        {{ $t('address.add_new') }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-8 text-gray-500">
      {{ $t('common.loading') }}...
    </div>

    <div v-else-if="!addresses.length" class="text-center py-8 text-gray-500">
      {{ $t('address.no_addresses') }}
    </div>

    <div v-else class="space-y-4">
      <div v-for="address in addresses" :key="address.id" class="border border-gray-200 rounded-md p-4">
        <div class="flex justify-between items-start">
          <div class="text-sm">
            <p class="font-medium text-gray-900">
              {{ address.first_name }} {{ address.last_name }}
              <span v-if="address.is_default" class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {{ $t('address.default') }}
              </span>
            </p>
            <p v-if="address.company" class="text-gray-600">{{ address.company }}</p>
            <p class="text-gray-600">{{ address.address_line_1 }}</p>
            <p v-if="address.address_line_2" class="text-gray-600">{{ address.address_line_2 }}</p>
            <p class="text-gray-600">
              {{ address.city }}<span v-if="address.state">, {{ address.state }}</span> {{ address.postal_code }}
            </p>
            <p class="text-gray-600">{{ address.country }}</p>
            <p v-if="address.phone" class="text-gray-600">{{ address.phone }}</p>
          </div>
          <div class="flex gap-2">
            <button
              @click="startEdit(address)"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              {{ $t('common.edit') }}
            </button>
            <button
              v-if="!address.is_default"
              @click="handleSetDefault(address.id)"
              class="text-gray-600 hover:text-gray-800 text-sm"
            >
              {{ $t('address.set_as_default') }}
            </button>
            <button
              @click="handleDelete(address.id)"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              {{ $t('common.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Address Form Modal -->
    <CheckoutAddressFormModal
      :is-open="showModal"
      :mode="modalMode"
      :address="editingAddress"
      :address-settings="addressSettings"
      @close="closeModal"
      @save="handleAddressSaved"
    />
  </ProfileSectionCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ProfileSectionCard from './ProfileSectionCard.vue'
import CheckoutAddressFormModal from '~/components/checkout/CheckoutAddressFormModal.vue'
import { useAddresses } from '~/composables/useAddresses'
import { DEFAULT_STORE_ADDRESS_SETTINGS, type Address, type StoreAddressSettings } from '~~/types/address'

const { t } = useI18n()

const {
  addresses,
  loading,
  fetchAddresses,
  deleteAddress,
  setDefaultAddress,
  getAddressSettings,
} = useAddresses()

const showModal = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const editingAddress = ref<Address | null>(null)

const addressSettings = ref<StoreAddressSettings>({ ...DEFAULT_STORE_ADDRESS_SETTINGS })

onMounted(async () => {
  await Promise.all([
    fetchAddresses(),
    fetchStoreAddressSettings()
  ])
})

const fetchStoreAddressSettings = async () => {
  try {
    const settings = await getAddressSettings()
    addressSettings.value = {
      ...DEFAULT_STORE_ADDRESS_SETTINGS,
      ...(settings || {}),
    }
  } catch (error) {
    console.error('Failed to fetch address settings:', error)
    addressSettings.value = { ...DEFAULT_STORE_ADDRESS_SETTINGS }
  }
}

const openAddModal = () => {
  modalMode.value = 'add'
  editingAddress.value = null
  showModal.value = true
}

const startEdit = (address: Address) => {
  modalMode.value = 'edit'
  editingAddress.value = address
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingAddress.value = null
}

const handleAddressSaved = () => {
  // The modal handles the save, we just need to refresh and close
  closeModal()
  // Refresh will happen automatically via the composable
}

const handleDelete = async (addressId: number) => {
  if (!confirm(t('address.confirm_delete'))) return
  try {
    await deleteAddress(addressId, {
      successMessage: t('address.deleted_successfully'),
    })
  } catch (e) {
    console.error(e)
  }
}

const handleSetDefault = async (addressId: number) => {
  try {
    await setDefaultAddress(addressId, {
      successMessage: t('address.default_set'),
    })
  } catch (e) {
    console.error(e)
  }
}
</script>
