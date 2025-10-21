import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { createCheckoutSession } from '../../lib/stripe'
import type { StripeProduct } from '../../stripe-config'

interface ProductCardProps {
  product: StripeProduct
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const { url } = await createCheckoutSession({
        price_id: product.priceId,
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/pricing`,
        mode: product.mode
      })
      
      if (url) {
        window.location.href = url
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      // You could show an error message here
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="mb-6">
        <span className="text-3xl font-bold text-gray-900">
          A${product.price.toFixed(2)}
        </span>
        <span className="text-gray-600 ml-2">
          {product.mode === 'subscription' ? '/month' : 'one-time'}
        </span>
      </div>
      <Button 
        onClick={handlePurchase} 
        loading={loading}
        className="w-full"
      >
        {product.mode === 'subscription' ? 'Subscribe Now' : 'Purchase Now'}
      </Button>
    </div>
  )
}