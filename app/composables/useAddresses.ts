import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes'
import type { Address, AddressValidationResponse, StoreAddressSettings } from '~~/types/address'
import { useStorefrontContext } from '~~/src/core/tenant/composables'

export const useAddresses = () => {
  const storefrontContext = useStorefrontContext()
  const { showSuccessToast } = useAppToast()
  const loading = useState('addresses_loading', () => false)
  const api = useApi()
  const addresses = ref<Address[]>([])

  const storeSlug = computed(() => storefrontContext.value?.tenant?.slug)

  const fetchAddresses = async () => {
    if (!storeSlug.value) return
    loading.value = true
    try {
      const { data, error } = await api<{ data: Address[] }>(API_ROUTES.addresses.index(storeSlug.value))
      if (error) throw error
      if (data) {
        addresses.value = data.data
      }
    } finally {
      loading.value = false
    }
  }

  const createAddress = async (
    form: any,
    options?: { successMessage?: string },
  ) => {
    if (!storeSlug.value) throw new Error('Store Slug not found')
    loading.value = true
    try {
      const { data, error } = await api<{ data: Address }>(API_ROUTES.addresses.store(storeSlug.value), {
        method: 'POST',
        body: form,
      })
      if (error) throw error
      if (data) {
        await fetchAddresses()
        if (options?.successMessage) {
          showSuccessToast(options.successMessage)
        }
        return data
      }
    } finally {
      loading.value = false
    }
  }

  const updateAddress = async (
    addressId: number,
    form: any,
    options?: { successMessage?: string },
  ) => {
    if (!storeSlug.value) throw new Error('Store Slug not found')
    loading.value = true
    try {
      const { data, error } = await api<{ data: Address }>(API_ROUTES.addresses.update(storeSlug.value, addressId.toString()), {
        method: 'PUT',
        body: form,
      })
      if (error) throw error
      if (data) {
        await fetchAddresses()
        if (options?.successMessage) {
          showSuccessToast(options.successMessage)
        }
        return data
      }
    } finally {
      loading.value = false
    }
  }

  const deleteAddress = async (
    addressId: number,
    options?: { successMessage?: string },
  ) => {
    if (!storeSlug.value) throw new Error('Store Slug not found')
    loading.value = true
    try {
      const { data, error } = await api(API_ROUTES.addresses.destroy(storeSlug.value, addressId.toString()), {
        method: 'DELETE',
      })
      if (error) throw error
      if (data) {
        await fetchAddresses()
        if (options?.successMessage) {
          showSuccessToast(options.successMessage)
        }
        return data
      }
    } finally {
      loading.value = false
    }
  }

  const setDefaultAddress = async (
    addressId: number,
    options?: { successMessage?: string },
  ) => {
    if (!storeSlug.value) throw new Error('Store Slug not found')
    loading.value = true
    try {
      const { data, error } = await api(API_ROUTES.addresses.setDefault(storeSlug.value, addressId.toString()), {
        method: 'PATCH',
      })
      if (error) throw error
      if (data) {
        await fetchAddresses()
        if (options?.successMessage) {
          showSuccessToast(options.successMessage)
        }
        return data
      }
    } finally {
      loading.value = false
    }
  }

  const setDefaultShipping = async (
    addressId: number,
    options?: { successMessage?: string },
  ) => {
    if (!storeSlug.value) throw new Error('Store Slug not found')
    loading.value = true
    try {
      const { data, error } = await api(API_ROUTES.addresses.setDefaultShipping(storeSlug.value, addressId.toString()), {
        method: 'POST',
      })
      if (error) throw error
      if (data) {
        await fetchAddresses()
        if (options?.successMessage) {
          showSuccessToast(options.successMessage)
        }
        return data
      }
    } finally {
      loading.value = false
    }
  }

  const setDefaultBilling = async (
    addressId: number,
    options?: { successMessage?: string },
  ) => {
    if (!storeSlug.value) throw new Error('Store Slug not found')
    loading.value = true
    try {
      const { data, error } = await api(API_ROUTES.addresses.setDefaultBilling(storeSlug.value, addressId.toString()), {
        method: 'POST',
      })
      if (error) throw error
      if (data) {
        await fetchAddresses()
        if (options?.successMessage) {
          showSuccessToast(options.successMessage)
        }
        return data
      }
    } finally {
      loading.value = false
    }
  }

  const validateAddress = async (
    form: any,
  ) => {
    if (!storeSlug.value) throw new Error('Store Slug not found')
    const { data, error } = await api<{ data: AddressValidationResponse }>(API_ROUTES.addresses.validate(storeSlug.value), {
      method: 'POST',
      body: form,
    })
    if (error) throw error
    return data?.data
  }

  const getAllowedCountries = async () => {
    if (!storeSlug.value) throw new Error('Store Slug not found')
    loading.value = true
    try {
      const { data, error } = await api<{ data: { allowed_countries: string[] } }>(
        API_ROUTES.addresses.allowedCountries(storeSlug.value)
      )
      if (error) throw error
      return data?.data.allowed_countries || []
    } finally {
      loading.value = false
    }
  }

  const getAddressSettings = async () => {
    if (!storeSlug.value) throw new Error('Store Slug not found')
    loading.value = true
    try {
      const { data, error } = await api<{ data: StoreAddressSettings }>(
        API_ROUTES.addresses.settings(storeSlug.value)
      )
      if (error) throw error
      return data?.data
    } finally {
      loading.value = false
    }
  }

  return {
    addresses,
    loading,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    setDefaultShipping,
    setDefaultBilling,
    validateAddress,
    getAllowedCountries,
    getAddressSettings,
  }
}
