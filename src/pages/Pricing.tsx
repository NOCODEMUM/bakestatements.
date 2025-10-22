import React from 'react'
import { Header } from '../components/layout/Header'
import { PricingCard } from '../components/pricing/PricingCard'
import { stripeProducts } from '../stripe-config'

export function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with our 7-day free trial, then choose the plan that works best for your bakery business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stripeProducts.map((product, index) => (
            <PricingCard
              key={product.priceId}
              product={product}
              featured={index === 1} // Make the annual plan featured
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            All plans include expense tracking, invoice generation, recipe costing, and ATO reporting.
          </p>
        </div>
      </div>
    </div>
  )
}