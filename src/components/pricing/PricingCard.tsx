import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { StripeProduct } from '../../stripe-config';
import { supabase } from '../../lib/supabase';

interface PricingCardProps {
  product: StripeProduct;
  isPopular?: boolean;
}

export function PricingCard({ product, isPopular = false }: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
          mode: product.mode,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Expense tracking with ATO categories',
    'Professional invoice generation',
    'Recipe costing calculator',
    'Financial reports for tax time',
    'Equipment inventory management',
    'Customer database',
    'Email support'
  ];

  return (
    <div className={`relative rounded-2xl p-8 ${
      isPopular 
        ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-2xl scale-105' 
        : 'bg-white border border-gray-200 shadow-lg'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-gray-900'}`}>
          {product.name.replace('BakeStatements - ', '')}
        </h3>
        <p className={`text-sm mb-4 ${isPopular ? 'text-orange-100' : 'text-gray-600'}`}>
          {product.description}
        </p>
        <div className="flex items-baseline justify-center">
          <span className={`text-4xl font-bold ${isPopular ? 'text-white' : 'text-gray-900'}`}>
            A${product.price}
          </span>
          {product.mode === 'subscription' && (
            <span className={`ml-2 text-lg ${isPopular ? 'text-orange-100' : 'text-gray-600'}`}>
              /{product.name.includes('MONTHLY') ? 'month' : 'year'}
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className={`h-5 w-5 mr-3 ${isPopular ? 'text-orange-200' : 'text-green-500'}`} />
            <span className={`text-sm ${isPopular ? 'text-white' : 'text-gray-700'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          isPopular
            ? 'bg-white text-orange-600 hover:bg-orange-50'
            : 'bg-orange-600 text-white hover:bg-orange-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Processing...' : 'Get Started'}
      </button>
    </div>
  );
}