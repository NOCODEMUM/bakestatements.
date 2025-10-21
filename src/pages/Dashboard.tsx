import React from 'react'
import { SubscriptionStatus } from '../components/stripe/SubscriptionStatus'
import { useAuth } from '../hooks/useAuth'
import { signOut } from '../lib/auth'
import { PlusCircle, DollarSign, FileText, ChefHat, CreditCard } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/bakestatements-logo.png"
                alt="BakeStatements"
              />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                BakeStatements
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <SubscriptionStatus />
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Welcome to BakeStatements! 🍞
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your financial co-pilot for home baking and micro bakeries in Australia.
                    We're here to simplify your bookkeeping, compliance, and branding so you can 
                    focus on what you love most - creating delicious baked goods!
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Getting Started</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Track your baking expenses with ATO-compliant categories</li>
                      <li>• Generate professional invoices with your ABN</li>
                      <li>• Calculate recipe costs and pricing</li>
                      <li>• Export financial summaries for tax time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <SubscriptionStatus />
            </div>
          </div>
        </div>

        <Link
          to="/pricing"
          className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group border-2 border-pink-200"
        >
          <div className="flex items-center mb-4">
            <CreditCard className="h-8 w-8 text-pink-600 group-hover:text-pink-700 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
          </div>
          <p className="text-gray-600">
            Manage your subscription plan and billing details.
          </p>
        </Link>
      </div>
    </div>
  )
}