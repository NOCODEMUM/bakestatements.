import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { StripeProduct } from '../../stripe-config';
import { createCheckoutSession } from '../../services/stripe';

interface PricingCardProps {
  product: StripeProduct;
  featured?: boolean;
}

export function PricingCard({ product, featured = false }: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const { url } = await createCheckoutSession({
        priceId: product.priceId,
        mode: product.mode,
      });
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // You could add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg p-8 ${featured ? 'ring-2 ring-pink-500 scale-105' : ''}`}>
      {featured && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">{product.currencySymbol}{product.price}</span>
          {product.mode === 'subscription' && <span className="text-gray-600 ml-2">/month</span>}
        </div>
        <p className="text-gray-600">{product.description}</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center">
          <Check className="w-5 h-5 text-green-500 mr-3" />
          <span className="text-gray-700">Expense Tracker</span>
        </div>
        <div className="flex items-center">
          <Check className="w-5 h-5 text-green-500 mr-3" />
          <span className="text-gray-700">Invoice Generator</span>
        </div>
        <div className="flex items-center">
          <Check className="w-5 h-5 text-green-500 mr-3" />
          <span className="text-gray-700">Recipe Costing Tool</span>
        </div>
        <div className="flex items-center">
          <Check className="w-5 h-5 text-green-500 mr-3" />
          <span className="text-gray-700">Financial Summary for ATO</span>
        </div>
      </div>

      <button
        onClick={handlePurchase}
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
          featured
            ? 'bg-pink-600 text-white hover:bg-pink-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Processing...' : product.mode === 'subscription' ? 'Start Subscription' : 'Purchase Now'}
      </button>
    </div>
  );
}