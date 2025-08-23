import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider } from './contexts/ThemeContext'
import Auth from './components/Auth'
import LandingPage from './pages/LandingPage'
import PrivacyTerms from './pages/PrivacyTerms'
import EnquiryForm from './pages/EnquiryForm'
import AboutUs from './pages/AboutUs'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import MainApp from './pages/MainApp' // New component for authenticated users


function AppContent() {
  const { user, loading } = useAuth()

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
        
        {/* Password Reset Flow - accessible to everyone */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Auth Page - for non-authenticated users */}
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" replace />} />
        
        {/* Main Application for Authenticated Users */}
        {/* All authenticated routes will be handled within MainApp */}
        <Route
          path="/*"
          element={
          user ? (
            <MainApp />
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