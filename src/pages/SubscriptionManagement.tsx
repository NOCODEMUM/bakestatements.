import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Crown, AlertCircle, CheckCircle, CreditCard, Calendar, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { STRIPE_PAYMENT_LINKS, redirectToStripePayment } from '../lib/stripe'

export default function SubscriptionManagement() {
  const navigate = useNavigate()
  const { user, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const isLifetime = user?.subscription_status === 'lifetime'
  const hasActiveSubscription = user?.subscription_status === 'active'
  const isPastDue = user?.subscription_status === 'past_due'
  const isCancelled = user?.subscription_status === 'cancelled'

  const getStatusBadge = () => {
    if (isLifetime) {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
          <Crown className="w-4 h-4 mr-2" />
          Lifetime Member
        </span>
      )
    }
    if (hasActiveSubscription) {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-2" />
          Active Subscription
        </span>
      )
    }
    if (isPastDue) {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-4 h-4 mr-2" />
          Payment Issue
        </span>
      )
    }
    if (isCancelled) {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
          Cancelled
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
        Free Trial
      </span>
    )
  }

  const handleCancelSubscription = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'cancelled',
          subscription_end_date: new Date().toISOString()
        })
        .eq('id', user?.id)

      if (error) throw error

      if (refreshProfile) {
        await refreshProfile()
      }

      setShowCancelConfirm(false)
      alert('Your subscription has been cancelled. You will retain access until the end of your billing period.')
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      alert('Failed to cancel subscription. Please contact support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-teal-500 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
            <p className="text-amber-50">Manage your BakeStatements subscription</p>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Current Status</h2>
                <p className="text-gray-600">Your account subscription details</p>
              </div>
              {getStatusBadge()}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CreditCard className="w-6 h-6 text-amber-600" />
                  <h3 className="font-semibold text-gray-800">Plan Details</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Current Plan</p>
                    <p className="font-semibold text-gray-900">
                      {isLifetime && 'Founder\'s Lifetime Access'}
                      {user?.subscription_tier === 'annual' && 'Annual Plan'}
                      {user?.subscription_tier === 'monthly' && 'Monthly Plan'}
                      {!user?.subscription_tier && !isLifetime && '7-Day Free Trial'}
                    </p>
                  </div>
                  {user?.subscription_tier && (
                    <div>
                      <p className="text-sm text-gray-600">Billing Amount</p>
                      <p className="font-semibold text-gray-900">
                        {user.subscription_tier === 'annual' && '$180 AUD / year'}
                        {user.subscription_tier === 'monthly' && '$19 AUD / month'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-6 h-6 text-teal-600" />
                  <h3 className="font-semibold text-gray-800">Account Timeline</h3>
                </div>
                <div className="space-y-2">
                  {user?.trial_end_date && !user?.subscription_tier && (
                    <div>
                      <p className="text-sm text-gray-600">Trial Ends</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(user.trial_end_date).toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  {user?.subscription_end_date && isCancelled && (
                    <div>
                      <p className="text-sm text-gray-600">Access Until</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(user.subscription_end_date).toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-semibold text-gray-900">
                      {user?.created_at && new Date(user.created_at).toLocaleDateString('en-AU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isLifetime && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Crown className="w-6 h-6 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-900 mb-2">Lifetime Access</h3>
                    <p className="text-purple-800">
                      You have lifetime access to BakeStatements! Thank you for being a founding member.
                      You'll never need to pay again and will receive all future updates and features.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isPastDue && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Payment Issue</h3>
                    <p className="text-yellow-800 mb-4">
                      There was an issue processing your payment. Please update your payment method to continue using BakeStatements.
                    </p>
                    <button
                      onClick={() => navigate('/pricing')}
                      className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                    >
                      Update Payment Method
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!user?.subscription_tier && !isLifetime && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-2">Free Trial Active</h3>
                      <p className="text-blue-800 mb-4">
                        You're currently enjoying your 7-day free trial. Choose a plan below to continue accessing all features after your trial ends.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Choose Your Plan</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-amber-500 transition-colors">
                      <div className="text-center mb-3">
                        <h4 className="font-semibold text-gray-800 mb-1">Monthly</h4>
                        <div className="text-3xl font-bold text-amber-600 mb-1">$19</div>
                        <p className="text-sm text-gray-600">per month</p>
                      </div>
                      <button
                        onClick={() => redirectToStripePayment(STRIPE_PAYMENT_LINKS.monthly)}
                        disabled={!STRIPE_PAYMENT_LINKS.monthly}
                        className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {STRIPE_PAYMENT_LINKS.monthly ? 'Subscribe Monthly' : 'Coming Soon'}
                      </button>
                    </div>

                    <div className="border-2 border-teal-500 rounded-lg p-4 hover:border-teal-600 transition-colors relative">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        BEST VALUE
                      </div>
                      <div className="text-center mb-3 mt-2">
                        <h4 className="font-semibold text-gray-800 mb-1">Annual</h4>
                        <div className="text-3xl font-bold text-teal-600 mb-1">$180</div>
                        <p className="text-sm text-gray-600">per year</p>
                        <p className="text-xs text-pink-600 font-semibold">Save $48!</p>
                      </div>
                      <button
                        onClick={() => redirectToStripePayment(STRIPE_PAYMENT_LINKS.annual)}
                        disabled={!STRIPE_PAYMENT_LINKS.annual}
                        className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {STRIPE_PAYMENT_LINKS.annual ? 'Subscribe Annual' : 'Coming Soon'}
                      </button>
                    </div>

                    <div className="border border-pink-200 rounded-lg p-4 hover:border-pink-500 transition-colors bg-gradient-to-br from-pink-50 to-purple-50">
                      <div className="text-center mb-3">
                        <h4 className="font-semibold text-gray-800 mb-1 flex items-center justify-center">
                          <Crown className="w-4 h-4 mr-1 text-pink-600" />
                          Lifetime
                        </h4>
                        <div className="text-3xl font-bold text-pink-600 mb-1">$299</div>
                        <p className="text-sm text-gray-600">one-time</p>
                        <p className="text-xs text-purple-600 font-semibold">Limited offer!</p>
                      </div>
                      <button
                        onClick={() => redirectToStripePayment(STRIPE_PAYMENT_LINKS.lifetime)}
                        disabled={!STRIPE_PAYMENT_LINKS.lifetime}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {STRIPE_PAYMENT_LINKS.lifetime ? 'Get Lifetime Access' : 'Coming Soon'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {hasActiveSubscription && !isLifetime && (
              <div className="border-t border-gray-200 pt-8">
                <h3 className="font-semibold text-gray-800 mb-4">Subscription Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => navigate('/pricing')}
                    className="w-full bg-gradient-to-r from-amber-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-teal-600 transition-colors font-semibold"
                  >
                    Upgrade Your Plan
                  </button>

                  {!showCancelConfirm ? (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="w-full bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel Subscription
                    </button>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h4 className="font-semibold text-red-900 mb-2">Are you sure?</h4>
                      <p className="text-red-800 text-sm mb-4">
                        If you cancel, you'll retain access until the end of your current billing period.
                        After that, you won't be able to manage orders, track expenses, or access your data.
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleCancelSubscription}
                          disabled={loading}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                        >
                          {loading ? 'Cancelling...' : 'Yes, Cancel Subscription'}
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm(false)}
                          disabled={loading}
                          className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Keep Subscription
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="border-t border-gray-200 pt-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-2 text-center">Subscription Cancelled</h3>
                  <p className="text-gray-600 mb-6 text-center">
                    We're sorry to see you go! You can reactivate your subscription anytime by choosing a plan below.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-amber-500 transition-colors bg-white">
                      <div className="text-center mb-3">
                        <h4 className="font-semibold text-gray-800 mb-1">Monthly</h4>
                        <div className="text-3xl font-bold text-amber-600 mb-1">$19</div>
                        <p className="text-sm text-gray-600">per month</p>
                      </div>
                      <button
                        onClick={() => redirectToStripePayment(STRIPE_PAYMENT_LINKS.monthly)}
                        disabled={!STRIPE_PAYMENT_LINKS.monthly}
                        className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {STRIPE_PAYMENT_LINKS.monthly ? 'Reactivate Monthly' : 'Coming Soon'}
                      </button>
                    </div>

                    <div className="border-2 border-teal-500 rounded-lg p-4 hover:border-teal-600 transition-colors bg-white relative">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        BEST VALUE
                      </div>
                      <div className="text-center mb-3 mt-2">
                        <h4 className="font-semibold text-gray-800 mb-1">Annual</h4>
                        <div className="text-3xl font-bold text-teal-600 mb-1">$180</div>
                        <p className="text-sm text-gray-600">per year</p>
                        <p className="text-xs text-pink-600 font-semibold">Save $48!</p>
                      </div>
                      <button
                        onClick={() => redirectToStripePayment(STRIPE_PAYMENT_LINKS.annual)}
                        disabled={!STRIPE_PAYMENT_LINKS.annual}
                        className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {STRIPE_PAYMENT_LINKS.annual ? 'Reactivate Annual' : 'Coming Soon'}
                      </button>
                    </div>

                    <div className="border border-pink-200 rounded-lg p-4 hover:border-pink-500 transition-colors bg-gradient-to-br from-pink-50 to-purple-50">
                      <div className="text-center mb-3">
                        <h4 className="font-semibold text-gray-800 mb-1 flex items-center justify-center">
                          <Crown className="w-4 h-4 mr-1 text-pink-600" />
                          Lifetime
                        </h4>
                        <div className="text-3xl font-bold text-pink-600 mb-1">$299</div>
                        <p className="text-sm text-gray-600">one-time</p>
                        <p className="text-xs text-purple-600 font-semibold">Limited offer!</p>
                      </div>
                      <button
                        onClick={() => redirectToStripePayment(STRIPE_PAYMENT_LINKS.lifetime)}
                        disabled={!STRIPE_PAYMENT_LINKS.lifetime}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {STRIPE_PAYMENT_LINKS.lifetime ? 'Get Lifetime Access' : 'Coming Soon'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-8">
              <h3 className="font-semibold text-gray-800 mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Have questions about your subscription or billing? Our support team is here to help.
              </p>
              <a
                href="mailto:hello@pix3l.com.au"
                className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
              >
                Contact Support
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
