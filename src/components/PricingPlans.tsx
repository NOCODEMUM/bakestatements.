import React, { useState } from 'react';
import { Check, Zap, Crown, Infinity } from 'lucide-react';
import { STRIPE_PRODUCTS, formatPrice } from '../stripe-config';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const PricingPlans: React.FC = () => {
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      alert('Please sign in to subscribe');
      return;
    }

    setLoadingPlan(priceId);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const getIcon = (name: string) => {
    if (name.includes('Monthly')) return <Zap className="h-8 w-8" />;
    if (name.includes('Annual')) return <Crown className="h-8 w-8" />;
    return <Infinity className="h-8 w-8" />;
  };

  const getFeatures = (name: string) => {
    const baseFeatures = [
      'Expense tracking with ATO categories',
      'Professional invoice generation',
      'Recipe costing calculator',
      'Financial summary reports',
      'ABN integration',
    ];

    if (name.includes('Annual') || name.includes('Lifetime')) {
      return [
        ...baseFeatures,
        'Priority email support',
        'Advanced reporting features',
        'Export to CSV/PDF'
      ];
    }

    if (name.includes('Lifetime')) {
      return [
        ...baseFeatures,
        'Priority email support',
        'Advanced reporting features',
        'Export to CSV/PDF',
        'Future feature updates included',
        'One-time payment'
      ];
    }

    return baseFeatures;
  };

  const getPopularPlan = () => {
    return STRIPE_PRODUCTS.find(p => p.name.includes('Annual'));
  };

  const popular = getPopularPlan();

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your 7-day free trial, then choose the plan that works best for your bakery
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {STRIPE_PRODUCTS.map((product) => {
            const isPopular = product.id === popular?.id;
            const features = getFeatures(product.name);
            const isLoading = loadingPlan === product.priceId;

            return (
              <div
                key={product.id}
                className={`relative bg-white rounded-2xl shadow-lg ${
                  isPopular ? 'ring-2 ring-pink-200 scale-105' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-pink-200 text-pink-800 text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className={`mr-3 ${
                      product.name.includes('Monthly') ? 'text-blue-600' :
                      product.name.includes('Annual') ? 'text-pink-600' :
                      'text-purple-600'
                    }`}>
                      {getIcon(product.name)}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {product.name}
                    </h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      {product.interval && (
                        <span className="text-gray-500 ml-2">
                          /{product.interval}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{product.description}</p>
                  </div>

                  <ul className="mb-8 space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(product.priceId)}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                      isPopular
                        ? 'bg-pink-600 hover:bg-pink-700 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Get Started'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
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