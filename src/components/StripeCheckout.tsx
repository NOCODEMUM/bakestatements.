import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { STRIPE_PRICES } from '../lib/stripe'
import { Crown, Check, Loader2 } from 'lucide-react'

interface StripeCheckoutProps {
  onClose?: () => void
  compact?: boolean
}

export default function StripeCheckout({ onClose, compact = false }: StripeCheckoutProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, mode: string = 'subscription') => {
    if (!user) {
      setError('You must be signed in to subscribe')
      return
    }
    
    setLoading(priceId)
    setError(null)
    
    try {
      console.log('Starting subscription process for:', { priceId, mode })
      
      const { data: session } = await supabase.auth.getSession()
      
      if (!session.session) {
        throw new Error('No active session found')
      }

      console.log('Calling create-checkout function...')

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: priceId,
          mode: mode
        },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      })

      if (error) {
        console.error('Supabase function error:', error)
        throw new Error(`Checkout error: ${error.message}`)
      }

      console.log('Checkout response:', data)

      if (!data || !data.url) {
        throw new Error('No checkout URL returned from server')
      }

      console.log('Redirecting to Stripe checkout:', data.url)
      window.location.href = data.url
    } catch (error: any) {
      console.error('Subscription error:', error)
      setError(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$19',
      period: '/month',
      priceId: STRIPE_PRICES.monthly,
      mode: 'subscription',
      color: 'amber',
      description: 'Perfect for getting started'
    },
    {
      id: 'annual',
      name: 'Annual',
      price: '$180',
      period: '/year',
      priceId: STRIPE_PRICES.annual,
      mode: 'subscription',
      color: 'emerald',
      description: 'Save $48 compared to monthly!',
      popular: true
    },
    {
      id: 'lifetime',
      name: "Founder's Lifetime",
      price: '$299',
      period: ' once',
      priceId: STRIPE_PRICES.lifetime,
      mode: 'payment',
      color: 'purple',
      description: 'Limited time - First 100 users only'
    }
  ]

  const features = [
    'Unlimited orders & recipes',
    'ATO-compliant expense tracking', 
    'Professional invoicing',
    'Recipe costing calculator',
    'Customer enquiry forms',
    'CSV/PDF exports',
    'Email support'
  ]

  if (compact) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg p-4 ${
              plan.popular 
                ? 'border-2 border-emerald-400 bg-emerald-50 relative' 
                : `border-${plan.color}-200 bg-${plan.color}-50`
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                BEST VALUE
              </div>
            )}
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">{plan.name}</h3>
              <div className="text-right">
                <span className={`text-2xl font-bold text-${plan.color}-600`}>{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
            
            <button 
              onClick={() => handleSubscribe(plan.priceId, plan.mode)}
              disabled={loading === plan.priceId}
              className={`w-full bg-${plan.color}-600 text-white py-2 px-4 rounded-lg hover:bg-${plan.color}-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2`}
            >
              {loading === plan.priceId ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Choose {plan.name}</span>
              )}
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
              plan.popular ? 'border-2 border-emerald-500 relative scale-105' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
              <div className={`text-4xl font-bold text-${plan.color}-600 mb-2`}>
                {plan.price}<span className="text-lg text-gray-500">{plan.period}</span>
              </div>
              <p className={`text-sm text-${plan.color}-600 font-semibold`}>{plan.description}</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleSubscribe(plan.priceId, plan.mode)}
              disabled={loading === plan.priceId}
              className={`w-full bg-${plan.color}-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-${plan.color}-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2`}
            >
              {loading === plan.priceId ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Choose {plan.name}</span>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold">
          <Check className="w-5 h-5" />
          <span>30-day money-back guarantee</span>
        </div>
      </div>
    </div>
  )
}