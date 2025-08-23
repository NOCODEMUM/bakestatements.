import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider } from './contexts/ThemeContext'
import Auth from './components/Auth'
import Layout from './components/Layout'
import PaywallModal from './components/PaywallModal'
import LandingPage from './pages/LandingPage'
import PrivacyTerms from './pages/PrivacyTerms'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Calendar from './pages/Calendar'
import Recipes from './pages/Recipes'
import Invoices from './pages/Invoices'
import Expenses from './pages/Expenses'
import Enquiries from './pages/Enquiries'
import EnquiryForm from './pages/EnquiryForm'
import AboutUs from './pages/AboutUs'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ComingSoon from './pages/ComingSoon'
import { useState } from 'react'

function AppContent() {
  const { user, loading, isTrialExpired } = useAuth()
  const [showPaywall, setShowPaywall] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }


  return (
    <Router>
      <Routes>
        {/* Landing Page - accessible to everyone */}
        <Route path="/landing" element={<LandingPage />} />
        
        {/* About Us Page - accessible to everyone */}
        <Route path="/about-us" element={<AboutUs />} />
        
        {/* Privacy & Terms Page - accessible to everyone */}
        <Route path="/privacy-terms" element={<PrivacyTerms />} />
        
        {/* Enquiry Form - accessible to everyone */}
        <Route path="/enquiry" element={<EnquiryForm />} />
        
        {/* Public Invoice View - accessible to everyone */}
        <Route path="/invoice/*" element={<ComingSoon />} />
        <Route path="/invoice/:public_token" element={<PublicInvoiceView />} />
        
        {/* Pricing Page - accessible to everyone */}
        <Route path="/pricing" element={<ComingSoon />} />
        
        {/* Coming Soon for removed features */}
        <Route path="/invoices" element={<ComingSoon />} />
        <Route path="/payment-settings" element={<ComingSoon />} />
        
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
                <Route path="/invoices" element={<ComingSoon />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/enquiries" element={<Enquiries />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/payment-settings" element={<ComingSoon />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/landing" replace />
          )
        } />
      </Routes>
      
    </Router>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}