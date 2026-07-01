/**
 * Checkout Store - Manages enhanced checkout flow state
 * 
 * Handles multi-step checkout process with:
 * - Shipping address selection
 * - Shipping method selection  
 * - Payment processing
 * - Order completion
 */

import { defineStore } from 'pinia'
import { DEFAULT_STORE_ADDRESS_SETTINGS, type StoreAddressSettings } from '~~/types/address'

export interface CheckoutAddress {
  id?: number
  name?: string
  first_name: string
  last_name: string
  company?: string
  address_line_1: string
  address_line_2?: string
  city: string
  state?: string
  postal_code: string
  country: string
  phone?: string
  email?: string
  is_default_shipping?: boolean
  is_default_billing?: boolean
}

export interface ShippingMethod {
  id: number
  name: string
  code: string
  description?: string
  price: number
  formatted_price: string
  delivery_estimate: string
  estimated_delivery_days?: number
  zone_name?: string
}

export interface CheckoutCart {
  items: Array<{
    id: number
    product_variant_id: number
    product_name: string
    sku: string
    price: number
    quantity: number
    subtotal: number
    image_url?: string
  }>
  subtotal: number
  items_count: number
}

export interface CheckoutSession {
  cart: CheckoutCart | null
  addresses: CheckoutAddress[]
  allowed_countries: string[]
  address_settings: StoreAddressSettings
  store: {
    id: number
    name: string
    currency: string
  } | null
  
  // Selected data
  shipping_address: CheckoutAddress | null
  billing_address: CheckoutAddress | null
  shipping_method: ShippingMethod | null
  available_shipping_methods: ShippingMethod[]
  
  // Payment
  payment_intent_id: string | null
  client_secret: string | null
  order_id: number | null
  order_number: string | null
  
  // UI State
  current_step: 'shipping' | 'shipping-method' | 'payment' | 'review'
  loading: boolean
  error: string | null
}

export const useCheckoutStore = defineStore('checkout', {
  state: (): CheckoutSession => ({
    cart: null,
    addresses: [],
    allowed_countries: [],
    address_settings: { ...DEFAULT_STORE_ADDRESS_SETTINGS },
    store: null,
    
    shipping_address: null,
    billing_address: null,
    shipping_method: null,
    available_shipping_methods: [],
    
    payment_intent_id: null,
    client_secret: null,
    order_id: null,
    order_number: null,
    
    current_step: 'shipping',
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * Check if shipping address is selected
     */
    hasShippingAddress: (state) => !!state.shipping_address,

    /**
     * Check if shipping method is selected
     */
    hasShippingMethod: (state) => !!state.shipping_method,

    /**
     * Check if ready for payment
     */
    isReadyForPayment: (state) => {
      return !!(state.shipping_address && state.shipping_method && state.cart)
    },

    /**
     * Calculate total including shipping
     */
    total: (state) => {
      const subtotal = state.cart?.subtotal || 0
      const shippingCost = state.shipping_method?.price || 0
      return subtotal + shippingCost
    },

    /**
     * Get formatted total
     */
    formattedTotal: (state) => {
      const currency = state.store?.currency || 'USD'
      const total = (state.cart?.subtotal || 0) + (state.shipping_method?.price || 0)
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(total)
    },

    /**
     * Get default shipping address if exists
     */
    defaultShippingAddress: (state) => {
      return state.addresses.find(addr => addr.is_default_shipping) || null
    },

    /**
     * Get default billing address if exists
     */
    defaultBillingAddress: (state) => {
      return state.addresses.find(addr => addr.is_default_billing) || null
    },

    /**
     * Check if checkout is initialized
     */
    isInitialized: (state) => !!state.cart,
  },

  actions: {
    /**
     * Initialize checkout session with data from backend
     */
    initializeSession(data: any) {
      this.cart = data.cart
      this.addresses = data.addresses || []
      this.address_settings = {
        ...DEFAULT_STORE_ADDRESS_SETTINGS,
        ...(data.address_settings || {}),
        allowed_countries: data.address_settings?.allowed_countries || data.allowed_countries || [],
      }
      this.allowed_countries = this.address_settings.allowed_countries
      this.store = data.store

      // Auto-select default addresses if available
      if (!this.shipping_address && this.defaultShippingAddress) {
        this.shipping_address = this.defaultShippingAddress
      }
      if (!this.billing_address && this.defaultBillingAddress) {
        this.billing_address = this.defaultBillingAddress
      }
    },

    /**
     * Set shipping address
     */
    setShippingAddress(address: CheckoutAddress) {
      this.shipping_address = address
      // Also use as billing address if not set
      if (!this.billing_address) {
        this.billing_address = address
      }
      // Reset shipping method when address changes
      this.shipping_method = null
      this.available_shipping_methods = []
    },

    /**
     * Set billing address
     */
    setBillingAddress(address: CheckoutAddress) {
      this.billing_address = address
    },

    /**
     * Use shipping address as billing address
     */
    useSameAddressForBilling() {
      if (this.shipping_address) {
        this.billing_address = { ...this.shipping_address }
      }
    },

    /**
     * Set available shipping methods
     */
    setAvailableShippingMethods(methods: ShippingMethod[]) {
      this.available_shipping_methods = methods
      // Auto-select first method if only one available
      const firstMethod = methods[0] ?? null
      if (methods.length === 1 && firstMethod) {
        this.shipping_method = firstMethod
      }
    },

    /**
     * Select shipping method
     */
    selectShippingMethod(method: ShippingMethod) {
      this.shipping_method = method
    },

    /**
     * Set payment intent data
     */
    setPaymentIntent(data: {
      client_secret: string
      payment_intent_id: string
      order_id: number
      order_number: string
    }) {
      this.client_secret = data.client_secret
      this.payment_intent_id = data.payment_intent_id
      this.order_id = data.order_id
      this.order_number = data.order_number
    },

    /**
     * Set current step
     */
    setStep(step: CheckoutSession['current_step']) {
      this.current_step = step
    },

    /**
     * Go to next step
     */
    nextStep() {
      const steps: CheckoutSession['current_step'][] = ['shipping', 'shipping-method', 'payment', 'review']
      const currentIndex = steps.indexOf(this.current_step)
      const nextStep = steps[currentIndex + 1]
      if (nextStep) {
        this.current_step = nextStep
      }
    },

    /**
     * Go to previous step
     */
    previousStep() {
      const steps: CheckoutSession['current_step'][] = ['shipping', 'shipping-method', 'payment', 'review']
      const currentIndex = steps.indexOf(this.current_step)
      const previousStep = steps[currentIndex - 1]
      if (previousStep) {
        this.current_step = previousStep
      }
    },

    /**
     * Set loading state
     */
    setLoading(loading: boolean) {
      this.loading = loading
    },

    /**
     * Set error
     */
    setError(error: string | null) {
      this.error = error
    },

    /**
     * Reset checkout state
     */
    reset() {
      this.$reset()
    },

    /**
     * Add a new address to the addresses list
     */
    addAddress(address: CheckoutAddress) {
      this.addresses = [...this.addresses, address]
    },

    /**
     * Update an existing address in the list
     */
    updateAddress(address: CheckoutAddress) {
      this.addresses = this.addresses.map(addr => 
        addr.id === address.id ? address : addr
      )
    },

    /**
     * Complete checkout - reset and redirect
     */
    complete() {
      const orderNumber = this.order_number
      this.$reset()
      return orderNumber
    },
  },
})
