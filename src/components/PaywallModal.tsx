import { X, Crown, Check } from 'lucide-react'
import { stripePromise } from '../lib/stripe'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, mode: string = 'subscription') => {
    if (!user) return
    
    setLoading(priceId)
    
    try {
      console.log('Starting subscription process for:', { priceId, mode })
      
      const { data: session } = await supabase.auth.getSession()
      
      if (!session.session) {
        console.error('No active session found')
        alert('Please sign in to continue')
        return
      }

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
        throw error
      }

      console.log('Checkout response:', data)

      const stripe = await stripePromise
      if (stripe && data.url) {
        console.log('Redirecting to Stripe checkout:', data.url)
        window.location.href = data.url
      } else {
        throw new Error('Failed to get checkout URL')
      }
    } catch (error) {
      console.error('Error:', error)
      alert(`Something went wrong: ${error.message}. Please try again.`)
    } finally {
      setLoading(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-bold text-gray-800">Upgrade Required</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">
            Your free trial has ended. Upgrade to continue managing your bakery with BakeStatements.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">Monthly Plan</h3>
              <span className="text-2xl font-bold text-amber-500">$19</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">AUD per month</p>
            <ul className="space-y-2 text-sm">
              {[
                'Unlimited orders & recipes',
                'ATO-compliant expense tracking',
                'Professional invoicing',
                'CSV/PDF exports',
                'Email support'
              ].map((feature) => (
                <li key={feature} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSubscribe('price_1RyA4CHruLrtRCwiXi8uqRWn', 'subscription')}
              disabled={loading === 'price_1RyA4CHruLrtRCwiXi8uqRWn'}
              className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors mt-4 font-medium disabled:opacity-50"
            >
              {loading === 'price_1RyA4CHruLrtRCwiXi8uqRWn' ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Choose Monthly'
              )}
            </button>
          </div>

          <div className="border-2 border-emerald-400 rounded-lg p-4 bg-emerald-50 relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              BEST VALUE
            </div>
            <div className="flex items-center justify-between mb-2 mt-2">
              <h3 className="font-bold text-gray-800">Annual Plan</h3>
              <div className="text-right">
                <span className="text-2xl font-bold text-emerald-600">$180</span>
                <p className="text-xs text-gray-500 line-through">$228</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">AUD per year (Save $48!)</p>
            <button 
              onClick={() => handleSubscribe('price_1RyA4CHruLrtRCwiZJlqpEt1', 'subscription')}
              disabled={loading === 'price_1RyA4CHruLrtRCwiZJlqpEt1'}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading === 'price_1RyA4CHruLrtRCwiZJlqpEt1' ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Choose Annual'
              )}
            </button>
          </div>

          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">Founder's Lifetime</h3>
              <div className="text-right">
                <span className="text-2xl font-bold text-purple-500">$299</span>
                <p className="text-xs text-gray-500 line-through">$499</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">One-time payment • First 50 users only</p>
            <button 
              onClick={() => handleSubscribe('price_1RyA4CHruLrtRCwi7inxZ3l2', 'payment')}
              disabled={loading === 'price_1RyA4CHruLrtRCwi7inxZ3l2'}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors font-medium disabled:opacity-50"
            >
              {loading === 'price_1RyA4CHruLrtRCwi7inxZ3l2' ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Get Lifetime Access'
              )}
            </button>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Choose your plan to continue using BakeStatements:
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            All plans include 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  )
}