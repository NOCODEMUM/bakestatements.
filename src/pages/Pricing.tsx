import React from 'react'
import { ProductCard } from '../components/stripe/ProductCard'
import { stripeProducts } from '../stripe-config'

export const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Get started with BakeStatements and simplify your bakery finances
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {stripeProducts.map((product) => (
            <ProductCard key={product.priceId} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}