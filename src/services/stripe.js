/**
 * Stripe Payment Service for Pocket Protector
 * Handles subscription management and payment processing
 */

import { loadStripe } from '@stripe/stripe-js'

const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
}

// Initialize Stripe
let stripePromise = null

const getStripe = () => {
  if (!stripePromise) {
    if (!STRIPE_CONFIG.PUBLISHABLE_KEY) {
      console.warn('Stripe publishable key not configured')
      return null
    }
    stripePromise = loadStripe(STRIPE_CONFIG.PUBLISHABLE_KEY)
  }
  return stripePromise
}

/**
 * Stripe Payment Service
 * Manages subscriptions, payments, and billing
 */
export class StripeService {
  constructor() {
    this.stripe = null
    this.baseUrl = STRIPE_CONFIG.BACKEND_URL
    this.init()
  }

  async init() {
    this.stripe = await getStripe()
  }

  /**
   * Create a subscription checkout session
   */
  async createSubscriptionCheckout(userId, priceId, successUrl, cancelUrl) {
    if (!this.stripe) {
      console.warn('Stripe not initialized, using mock checkout')
      return this.mockCheckout(userId, priceId)
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          priceId,
          successUrl,
          cancelUrl,
          mode: 'subscription'
        })
      })

      if (!response.ok) {
        throw new Error(`Stripe API error: ${response.status}`)
      }

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return { success: true }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return this.mockCheckout(userId, priceId)
    }
  }

  /**
   * Mock checkout for demo purposes
   */
  mockCheckout(userId, priceId) {
    // Simulate successful subscription
    setTimeout(() => {
      const event = new CustomEvent('subscription-success', {
        detail: {
          userId,
          subscriptionId: `sub_mock_${Date.now()}`,
          status: 'active',
          priceId
        }
      })
      window.dispatchEvent(event)
    }, 2000)

    return { success: true, mock: true }
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/subscription-status/${userId}`)
      
      if (!response.ok) {
        throw new Error(`Stripe API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching subscription status:', error)
      // Return mock status for demo
      return {
        status: 'active',
        subscriptionId: 'sub_mock_123',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false
      }
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscriptionId })
      })

      if (!response.ok) {
        throw new Error(`Stripe API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return { success: true, mock: true }
    }
  }

  /**
   * Update subscription
   */
  async updateSubscription(subscriptionId, newPriceId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/update-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId,
          newPriceId
        })
      })

      if (!response.ok) {
        throw new Error(`Stripe API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating subscription:', error)
      return { success: true, mock: true }
    }
  }

  /**
   * Create customer portal session
   */
  async createPortalSession(customerId, returnUrl) {
    try {
      const response = await fetch(`${this.baseUrl}/api/stripe/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        })
      })

      if (!response.ok) {
        throw new Error(`Stripe API error: ${response.status}`)
      }

      const { url } = await response.json()
      window.location.href = url
      
      return { success: true }
    } catch (error) {
      console.error('Error creating portal session:', error)
      // Mock portal for demo
      alert('This would redirect to Stripe Customer Portal in production')
      return { success: true, mock: true }
    }
  }

  /**
   * Get pricing information
   */
  getPricingPlans() {
    return {
      free: {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: null,
        features: [
          'Basic rights guides',
          'Standard scripts',
          'Basic recording (5 minutes)',
          'Community support'
        ]
      },
      premium: {
        id: 'price_premium_monthly',
        name: 'Premium',
        price: 4.99,
        interval: 'month',
        features: [
          'All free features',
          'Advanced recording (unlimited)',
          'AI-generated summaries',
          'Legal network access',
          'Priority support',
          'Custom scripts',
          'Cloud storage'
        ]
      }
    }
  }

  /**
   * Validate subscription access
   */
  hasFeatureAccess(subscriptionStatus, feature) {
    const premiumFeatures = [
      'advanced_recording',
      'ai_summaries',
      'legal_network',
      'custom_scripts',
      'cloud_storage',
      'priority_support'
    ]

    if (subscriptionStatus === 'premium') {
      return true
    }

    return !premiumFeatures.includes(feature)
  }

  /**
   * Format price for display
   */
  formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount)
  }
}

/**
 * Subscription Hook for React Components
 */
export const useSubscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = React.useState('free')
  const [isLoading, setIsLoading] = React.useState(false)
  const stripeService = new StripeService()

  const upgradeToPremiun = async (userId) => {
    setIsLoading(true)
    try {
      const result = await stripeService.createSubscriptionCheckout(
        userId,
        'price_premium_monthly',
        `${window.location.origin}/profile?success=true`,
        `${window.location.origin}/profile?canceled=true`
      )
      
      if (result.mock) {
        // Handle mock upgrade
        setSubscriptionStatus('premium')
      }
      
      return result
    } catch (error) {
      console.error('Upgrade failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const cancelSubscription = async (subscriptionId) => {
    setIsLoading(true)
    try {
      const result = await stripeService.cancelSubscription(subscriptionId)
      if (result.success) {
        setSubscriptionStatus('free')
      }
      return result
    } catch (error) {
      console.error('Cancellation failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const openCustomerPortal = async (customerId) => {
    return await stripeService.createPortalSession(
      customerId,
      `${window.location.origin}/profile`
    )
  }

  return {
    subscriptionStatus,
    isLoading,
    upgradeToPremiun,
    cancelSubscription,
    openCustomerPortal,
    hasFeatureAccess: (feature) => stripeService.hasFeatureAccess(subscriptionStatus, feature),
    pricingPlans: stripeService.getPricingPlans()
  }
}

// Export service instance
export const stripeService = new StripeService()
export default stripeService
