import React from 'react';
import { PricingCard } from '../components/pricing/PricingCard';
import { stripeProducts } from '../stripe-config';

export function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🐨</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your BakeStatements Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get the tools you need to manage your bakery business with confidence
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-8 max-w-md mx-auto">
          {stripeProducts.map((product, index) => (
            <PricingCard
              key={product.priceId}
              product={product}
              featured={index === 0}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Questions? Contact us at{' '}
            <a href="mailto:support@bakestatements.com" className="text-pink-600 hover:text-pink-700">
              support@bakestatements.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}