import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import PaywallModal from './components/PaywallModal'
import LandingPage from './pages/LandingPage'
import AboutUs from './pages/AboutUs'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { DashboardPage } from './pages/DashboardPage'
import { PricingPage } from './pages/PricingPage'
import { SuccessPage } from './pages/SuccessPage'

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
        <Route path="/" element={<Navigate to="/pricing" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
      </Routes>
      
      {user && (
        <PaywallModal 
          isOpen={isTrialExpired || showPaywall} 
          onClose={() => setShowPaywall(false)} 
        />
      )}
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