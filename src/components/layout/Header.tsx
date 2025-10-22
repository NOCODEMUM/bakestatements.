import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../hooks/useSubscription'
import { Button } from '../ui/Button'

export function Header() {
  const { user, signOut } = useAuth()
  const { getSubscriptionPlan } = useSubscription()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/bakestatements-logo.png" 
                alt="BakeStatements" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gray-900">BakeStatements</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link to="/pricing" className="text-gray-700 hover:text-gray-900">
                  Pricing
                </Link>
                {getSubscriptionPlan() && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {getSubscriptionPlan()}
                  </span>
                )}
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/pricing" className="text-gray-700 hover:text-gray-900">
                  Pricing
                </Link>
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}