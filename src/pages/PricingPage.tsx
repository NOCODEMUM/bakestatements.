import React from 'react';
import { PricingCard } from '../components/pricing/PricingCard';
import { stripeProducts } from '../stripe-config';
import { Header } from '../components/layout/Header';

export function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, transparent pricing for home bakers and micro bakeries. 
            Start your 7-day free trial today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stripeProducts.map((product, index) => (
            <PricingCard
              key={product.id}
              product={product}
              isPopular={index === 1} // Make the annual plan popular
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            All plans include a 7-day free trial. No credit card required.
          </p>
          <p className="text-sm text-gray-500">
            Questions? Contact us at support@bakestatements.com
          </p>
        </div>
      </div>
    </div>
  );
}