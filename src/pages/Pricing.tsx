import React from 'react'
import StripeCheckout from '../components/StripeCheckout'
import { ChefHat } from 'lucide-react'

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <a href="/landing" className="flex items-center space-x-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
              </div>
              <span className="text-lg md:text-xl font-bold text-teal-600">BakeStatements</span>
            </a>
            
            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <a href="/landing" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">
                Back to Home
              </a>
              <a 
                href="/auth" 
                className="bg-amber-500 text-white px-4 py-2 md:px-6 md:py-2 rounded-full font-bold hover:bg-amber-600 transition-colors shadow-lg"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-8 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
              Simple Pricing for Growing Bakers
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Start with our 7-day free trial, then choose the plan that fits your baking journey. 
              All plans include every feature you need to succeed.
            </p>
          </div>
          
          <StripeCheckout />
          
          {/* FAQ Section */}
          <div className="mt-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600 text-sm">
                  Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Is there a money-back guarantee?</h3>
                <p className="text-gray-600 text-sm">
                  We offer a 30-day money-back guarantee on all plans. If you're not satisfied, we'll refund your payment.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600 text-sm">
                  We accept all major credit cards (Visa, Mastercard, American Express) and bank transfers through Stripe.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Is my data secure?</h3>
                <p className="text-gray-600 text-sm">
                  Absolutely. We use industry-standard encryption and host your data securely with Supabase on Australian servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-amber-100 p-2 rounded-lg">
              <ChefHat className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-lg font-bold text-gray-800">BakeStatements by PIX3L</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 PIX3L. Made with ❤️ in Sydney, Australia.
          </p>
        </div>
      </footer>
    </div>
  )
}