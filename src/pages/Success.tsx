import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/ui/Button'

export function Success() {
  useEffect(() => {
    // You might want to refresh subscription data here
    // or trigger a webhook to update the user's subscription status
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your subscription is now active and you can start using all BakeStatements features.
          </p>
          
          <div className="space-y-4">
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
            
            <div className="text-sm text-gray-500">
              <p>You should receive a confirmation email shortly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}