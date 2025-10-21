import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider } from './contexts/ThemeContext'
import Auth from './components/Auth'
import Layout from './components/Layout'
import PaywallModal from './components/PaywallModal'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Pricing } from './pages/Pricing';
import { Success } from './pages/Success';
import LandingPage from './pages/LandingPage'
import AboutUs from './pages/AboutUs'
import PrivacyTerms from './pages/PrivacyTerms'
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

        {/* Pricing Page - accessible to everyone */}
        <Route path="/pricing" element={<Pricing />} />

        {/* Enquiry Form - accessible to everyone */}
        <Route path="/enquiry" element={<EnquiryForm />} />

        {/* Baker Landing Pages - accessible to everyone */}
        <Route path="/baker/:slug" element={<BakerLandingPage />} />

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
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/success" element={<Success />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
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