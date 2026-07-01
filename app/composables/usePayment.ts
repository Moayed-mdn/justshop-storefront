import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

/**
 * Composable for Stripe payment processing
 * Handles Stripe Elements creation and payment confirmation
 */
export const usePayment = () => {
  const config = useRuntimeConfig()
  const stripePublishableKey = config.public.stripePublishableKey as string
  
  /**
   * Get or initialize Stripe instance
   */
  const getStripe = async (): Promise<Stripe | null> => {
    if (!stripePromise) {
      if (!stripePublishableKey) {
        console.error('Stripe publishable key not configured')
        return null
      }
      stripePromise = loadStripe(stripePublishableKey)
    }
    return await stripePromise
  }

  /**
   * Create Stripe Elements for payment form
   * @param clientSecret - PaymentIntent client secret from backend
   */
  const createElements = async (clientSecret: string): Promise<StripeElements | null> => {
    const stripe = await getStripe()
    if (!stripe) {
      console.error('Stripe not initialized')
      return null
    }
    
    return stripe.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0066cc',
          colorBackground: '#ffffff',
          colorText: '#1a1a1a',
          colorDanger: '#df1b41',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          borderRadius: '8px',
          spacingUnit: '4px',
        },
        rules: {
          '.Input': {
            border: '1px solid #e0e0e0',
            boxShadow: 'none',
          },
          '.Input:focus': {
            border: '1px solid #0066cc',
            boxShadow: '0 0 0 2px rgba(0, 102, 204, 0.1)',
          },
          '.Label': {
            fontWeight: '500',
            marginBottom: '8px',
          },
        },
      },
    })
  }

  /**
   * Confirm payment with Stripe
   * @param clientSecret - PaymentIntent client secret
   * @param returnUrl - URL to redirect after payment
   */
  const confirmPayment = async (
    clientSecret: string,
    returnUrl: string
  ): Promise<{ error?: any; paymentIntent?: any }> => {
    const stripe = await getStripe()
    if (!stripe) {
      return { error: { message: 'Stripe not initialized' } }
    }

    return await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        return_url: returnUrl,
      },
    })
  }

  /**
   * Retrieve PaymentIntent details
   * @param clientSecret - PaymentIntent client secret
   */
  const retrievePaymentIntent = async (clientSecret: string) => {
    const stripe = await getStripe()
    if (!stripe) {
      return { error: { message: 'Stripe not initialized' } }
    }

    return await stripe.retrievePaymentIntent(clientSecret)
  }

  return {
    getStripe,
    createElements,
    confirmPayment,
    retrievePaymentIntent,
  }
}
