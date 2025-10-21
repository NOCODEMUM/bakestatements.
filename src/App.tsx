import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider } from './contexts/ThemeContext'
import Auth from './components/Auth'
import Layout from './components/Layout'
import PaywallModal from './components/PaywallModal'
import LandingPage from './pages/LandingPage'
import AboutUs from './pages/AboutUs'
import PrivacyTerms from './pages/PrivacyTerms'
import { Pricing } from './pages/Pricing'
import EnquiryForm from './pages/EnquiryForm'
import BakerLandingPage from './pages/BakerLandingPage'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { Dashboard } from './pages/Dashboard'
import Orders from './pages/Orders'
import Calendar from './pages/Calendar'
import Recipes from './pages/Recipes'
import Equipment from './pages/Equipment'
import Invoices from './pages/Invoices'
import Expenses from './pages/Expenses'
import Enquiries from './pages/Enquiries'
import MyLandingPage from './pages/MyLandingPage'
import Settings from './pages/Settings'
import { Success } from './pages/Success'

function AppContent() {
  const { user, isTrialExpired, showPaywall, setShowPaywall } = useAuth()

  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-terms" element={<PrivacyTerms />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/enquiry" element={<EnquiryForm />} />
        <Route path="/baker/:slug" element={<BakerLandingPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/success" element={<Success />} />

        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" replace />} />

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
