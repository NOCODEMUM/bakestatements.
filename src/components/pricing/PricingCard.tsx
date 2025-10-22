import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { StripeProduct } from '../../stripe-config'
import { supabase } from '../../lib/supabase'

interface PricingCardProps {
  product: StripeProduct
  featured?: boolean
}

export function PricingCard({ product, featured = false }: PricingCardProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        window.location.href = '/login'
        return
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      })

      const data = await response.json()

      if (data.error) {
        console.error('Checkout error:', data.error)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`rounded-lg border-2 p-6 ${featured ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
      {featured && (
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-2 text-sm text-gray-600">{product.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">
            {product.currencySymbol}{product.price}
          </span>
          {product.mode === 'subscription' && (
            <span className="ml-1 text-sm text-gray-600">
              /{product.name.includes('MONTHLY') ? 'month' : 'year'}
            </span>
          )}
        </div>
      </div>

      <Button
        onClick={handleCheckout}
        loading={loading}
        variant={featured ? 'primary' : 'outline'}
        className="w-full"
      >
        {product.mode === 'payment' ? 'Buy Now' : 'Subscribe'}
      </Button>
    </div>
  )
}