import React from 'react'
import { Link } from 'react-router-dom'
import { Calculator, FileText, DollarSign, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="mb-8">
            <img 
              src="/20250820_0042_Koala Logo Design_remix_01k31cc4t3epsb1sqf7npt8hjb.png" 
              alt="BakeStatements Koala Mascot" 
              className="h-32 w-32 mx-auto mb-6"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Financial Co-Pilot for
            <span className="text-pink-600"> Home Baking</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Simplify bookkeeping, compliance, and branding so you can spend less time worrying about paperwork and more time creating delicious treats.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                Start Your 7-Day Free Trial
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Run Your Bakery
          </h2>
          <p className="text-lg text-gray-600">
            Professional tools designed specifically for home bakers and micro bakeries
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expense Tracker</h3>
            <p className="text-gray-600">Simple input form with categories mapped to ATO claims</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Generator</h3>
            <p className="text-gray-600">Auto-brand with your ABN, logo, and client details</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recipe Costing</h3>
            <p className="text-gray-600">Input ingredients & costs to see per-unit pricing</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ATO Reports</h3>
            <p className="text-gray-600">One-click report export with grouped categories</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Simplify Your Bakery Business?
          </h2>
          <p className="text-xl mb-8 text-pink-100">
            Join thousands of home bakers who trust BakeStatements for their financial management
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
              Start Your Free Trial Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}