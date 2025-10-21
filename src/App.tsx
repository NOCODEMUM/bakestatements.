import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider } from './contexts/ThemeContext'
import Auth from './components/Auth'
import Layout from './components/Layout'
import PaywallModal from './components/PaywallModal'
import LandingPage from './pages/LandingPage'
import AboutUs from './pages/AboutUs'
import PrivacyTerms from './pages/PrivacyTerms'
import Pricing from './pages/Pricing'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Calendar from './pages/Calendar'
import Recipes from './pages/Recipes'
import Invoices from './pages/Invoices'
import Expenses from './pages/Expenses'
import Equipment from './pages/Equipment'
import Settings from './pages/Settings'
import Enquiries from './pages/Enquiries'
import EnquiryForm from './pages/EnquiryForm'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import MyLandingPage from './pages/MyLandingPage'
import BakerLandingPage from './pages/BakerLandingPage'
import SubscriptionManagement from './pages/SubscriptionManagement'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

function AppContent() {
  const { user, loading, isTrialExpired, refreshProfile } = useAuth()
  const [showPaywall, setShowPaywall] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const sessionId = searchParams.get('session_id')
    const cancelled = searchParams.get('cancelled')

    if (cancelled === 'true') {
      console.log('Payment cancelled by user')
      return
    }

    if (sessionId && user) {
      handlePaymentSuccess(sessionId)
    }
  }, [location.search, user])

  const handlePaymentSuccess = async (sessionId: string) => {
    try {
      setShowSuccess(true)

      await new Promise(resolve => setTimeout(resolve, 2000))

      if (refreshProfile) {
        await refreshProfile()
      }

      window.history.replaceState({}, '', '/')

      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error handling payment success:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }


  return (
    <>
      <Routes>
        {/* Landing Page - accessible to everyone */}
        <Route path="/landing" element={<LandingPage />} />

        {/* About Us Page - accessible to everyone */}
        <Route path="/about-us" element={<AboutUs />} />

        {/* Privacy & Terms Page - accessible to everyone */}
        <Route path="/privacy-terms" element={<PrivacyTerms />} />

        {/* Pricing Page - accessible to everyone */}
        <Route path="/pricing" element={<Pricing />} />

        {/* Enquiry Form - accessible to everyone */}
        <Route path="/enquiry" element={<EnquiryForm />} />

        {/* Baker Landing Pages - accessible to everyone */}
        <Route path="/baker/:slug" element={<BakerLandingPage />} />

        {/* Subscription Management - accessible to everyone (Stripe cancel redirect) */}
        <Route path="/account/subscription" element={<SubscriptionManagement />} />

        {/* Password Reset Flow - accessible to everyone */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Auth Page - for non-authenticated users */}
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" replace />} />
        
        {/* Protected Routes - for authenticated users */}
        <Route path="/*" element={
          user ? (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/equipment" element={<Equipment />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/enquiries" element={<Enquiries />} />
                <Route path="/my-landing-page" element={<MyLandingPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/landing" replace />
          )
        } />
      </Routes>
      
      {user && (
        <PaywallModal
          isOpen={isTrialExpired || showPaywall}
          onClose={() => setShowPaywall(false)}
        />
      )}

      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold">Payment Successful!</p>
              <p className="text-sm">Your subscription is now active.</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}