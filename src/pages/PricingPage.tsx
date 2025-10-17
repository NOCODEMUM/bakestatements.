import React from 'react';
import { stripeProducts } from '../stripe-config';
import { PricingCard } from '../components/pricing/PricingCard';

export function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <img 
              src="/20250820_0042_Koala Logo Design_remix_01k31cc4t3epsb1sqf7npt8hjb.png" 
              alt="BakeStatements Koala" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Sweet Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your bakery business. All plans include our core features to help you manage your finances with ease.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stripeProducts.map((product, index) => (
            <PricingCard
              key={product.priceId}
              product={product}
              featured={index === 0}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Questions about our pricing? We're here to help!
          </p>
          <a
            href="mailto:support@bakestatements.com"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}