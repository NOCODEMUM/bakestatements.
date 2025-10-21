import React, { useState } from 'react';
import { stripeProducts } from '../../stripe-config';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { Check } from 'lucide-react';

export const SubscriptionPlans: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user) return;

    setLoading(priceId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to start checkout process');
    } finally {
      setLoading(null);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const getFeatures = (productName: string) => {
    const baseFeatures = [
      'Expense tracking with ATO categories',
      'Professional invoice generation',
      'Recipe costing calculator',
      'Financial reports for tax time',
      'Equipment inventory management',
    ];

    if (productName.includes('LIFELONG')) {
      return [
        ...baseFeatures,
        'Lifetime access - no recurring fees',
        'All future updates included',
        'Priority customer support',
      ];
    }

    if (productName.includes('ANNUAL')) {
      return [
        ...baseFeatures,
        'Save 17% vs monthly billing',
        'Annual billing cycle',
        'Email support',
      ];
    }

    return [
      ...baseFeatures,
      'Monthly billing',
      'Cancel anytime',
      'Email support',
    ];
  };

  const getPlanType = (productName: string) => {
    if (productName.includes('LIFELONG')) return 'Most Popular';
    if (productName.includes('ANNUAL')) return 'Best Value';
    return 'Flexible';
  };

  const getBillingPeriod = (productName: string, mode: string) => {
    if (mode === 'payment') return 'one-time';
    if (productName.includes('ANNUAL')) return 'per year';
    return 'per month';
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your BakeStatements Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, transparent pricing for home bakers and micro bakeries. 
            Start your 7-day free trial today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stripeProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                product.name.includes('LIFELONG') ? 'ring-2 ring-pink-500 transform scale-105' : ''
              }`}
            >
              {product.name.includes('LIFELONG') && (
                <div className="bg-pink-500 text-white text-center py-2 text-sm font-medium">
                  {getPlanType(product.name)}
                </div>
              )}
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {product.name.replace('BakeStatements - ', '')}
                  </h3>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price, product.currency)}
                    <span className="text-lg font-normal text-gray-600">
                      /{getBillingPeriod(product.name, product.mode)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {getFeatures(product.name).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(product.priceId, product.mode)}
                  disabled={loading === product.priceId || !user}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    product.name.includes('LIFELONG')
                      ? 'bg-pink-500 text-white hover:bg-pink-600'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === product.priceId ? (
                    'Processing...'
                  ) : !user ? (
                    'Sign in to Subscribe'
                  ) : product.mode === 'payment' ? (
                    'Buy Now'
                  ) : (
                    'Start Free Trial'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include a 7-day free trial. No credit card required to start.
          </p>
        </div>
      </div>
    </div>
  );
};