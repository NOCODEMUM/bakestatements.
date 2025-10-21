import React, { useEffect, useState } from 'react'
import { getUserSubscription } from '../../lib/stripe'
import { getProductByPriceId } from '../../stripe-config'

interface SubscriptionData {
  subscription_status: string
  price_id: string | null
}

export const SubscriptionStatus: React.FC = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getUserSubscription()
        setSubscription(data)
      } catch (error) {
        console.error('Error fetching subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800">No Active Plan</h3>
        <p className="text-sm text-yellow-700 mt-1">
          You don't have an active subscription or purchase.
        </p>
      </div>
    )
  }

  const product = subscription.price_id ? getProductByPriceId(subscription.price_id) : null
  const planName = product?.name || 'Unknown Plan'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'trialing':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'past_due':
      case 'unpaid':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'canceled':
        return 'bg-gray-50 border-gray-200 text-gray-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor(subscription.subscription_status)}`}>
      <h3 className="text-sm font-medium">Current Plan</h3>
      <p className="text-sm mt-1">
        {planName} - {subscription.subscription_status.replace('_', ' ')}
      </p>
    </div>
  )
}