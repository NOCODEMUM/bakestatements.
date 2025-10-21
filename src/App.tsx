import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { PricingPage } from './pages/PricingPage';
import { SuccessPage } from './pages/SuccessPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Home Page Component
const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <img 
            src="/bakestatements-logo.png" 
            alt="BakeStatements" 
            className="h-20 mx-auto mb-8"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to BakeStatements
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The financial co-pilot for home bakers and micro bakeries in Australia. 
            Simplify your bookkeeping, compliance, and branding.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <a
                href="/dashboard"
                className="bg-pink-500 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-pink-600 transition-colors"
              >
                Go to Dashboard
              </a>
            ) : (
              <>
                <a
                  href="/signup"
                  className="bg-pink-500 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-pink-600 transition-colors"
                >
                  Start Free Trial
                </a>
                <a
                  href="/pricing"
                  className="bg-white text-pink-500 border border-pink-500 px-8 py-3 rounded-md text-lg font-medium hover:bg-pink-50 transition-colors"
                >
                  View Pricing
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;