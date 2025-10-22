import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { Header } from '../components/layout/Header'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const { user } = useAuth()
  const { subscription, loading, getSubscriptionPlan, isActive, isTrialing } = useSubscription()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">Here's what's happening with your bakery business.</p>
        </div>

        {/* Subscription Status */}
        {subscription && (
          <div className="mb-8">
            {isActive() && (
              <Alert type="success" title="Active Subscription">
                You're currently on the <strong>{getSubscriptionPlan()}</strong> plan.
              </Alert>
            )}
            {isTrialing() && (
              <Alert type="info" title="Trial Period">
                You're currently in your free trial period on the <strong>{getSubscriptionPlan()}</strong> plan.
              </Alert>
            )}
            {!isActive() && !isTrialing() && (
              <Alert type="warning" title="Subscription Required">
                Your subscription is not active. <Link to="/pricing" className="font-medium underline">Upgrade now</Link> to continue using BakeStatements.
              </Alert>
            )}
          </div>
        )}

        {!subscription && (
          <div className="mb-8">
            <Alert type="info" title="Get Started">
              Welcome to BakeStatements! <Link to="/pricing" className="font-medium underline">Choose a plan</Link> to start managing your bakery business.
            </Alert>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Expenses</h3>
            <p className="text-gray-600 mb-4">Record your business expenses for ATO compliance</p>
            <Button variant="outline" className="w-full">
              Add Expense
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Invoice</h3>
            <p className="text-gray-600 mb-4">Generate professional invoices for your clients</p>
            <Button variant="outline" className="w-full">
              New Invoice
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recipe Costing</h3>
            <p className="text-gray-600 mb-4">Calculate the true cost of your recipes</p>
            <Button variant="outline" className="w-full">
              Cost Recipe
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-500 text-center py-8">
              No recent activity. Start by adding an expense or creating an invoice!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}