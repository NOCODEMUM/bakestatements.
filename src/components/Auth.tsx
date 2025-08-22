import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ChefHat, Eye, EyeOff, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const { signUp, signIn } = useAuth()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Check for success messages from URL parameters
    const urlMessage = searchParams.get('message')
    if (urlMessage === 'password_updated') {
      setMessage('Password updated successfully! You can now sign in with your new password.')
      setIsSuccess(true)
      setIsSignUp(false) // Switch to sign in mode
    } else if (urlMessage === 'email_verified') {
      setMessage('Email verified successfully! You can now sign in to your account.')
      setIsSuccess(true)
      setIsSignUp(false) // Switch to sign in mode
    }
  }, [searchParams])

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Please enter your email address first')
      return
    }

    setResendLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?message=email_verified`
        }
      })

      if (error) throw error

      setMessage('Verification email sent! Check your email and click the link to verify your account.')
      setIsSuccess(true)
      setShowResendVerification(false)
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setResendLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setIsSuccess(false)
    setShowResendVerification(false)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          options: {
            emailRedirectTo: `${window.location.origin}/auth?message=email_verified`
          }
        })

        if (error) {
          if (error.message.includes('already registered')) {
            setMessage('Email already registered')
          } else {
            setMessage(error.message)
          }
        } else {
          setMessage('Success! Check your email for the confirmation link.')
          setIsSuccess(true)
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          if (error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed')) {
            setMessage('Please check your email and click the confirmation link before signing in.')
            setShowResendVerification(true)
          } else if (error.message?.includes('Invalid login credentials')) {
            setMessage('Email or password didn\'t match')
          } else {
            setMessage(error.message)
          }
        }
      }
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <ChefHat className="w-6 h-6 text-gray-700" />
          <span className="text-lg font-semibold text-gray-800">BakeStatements</span>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">?</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Koala Logo */}
          <div className="text-center mb-8">
            <img 
              src="/ChatGPT Image Aug 19, 2025, 11_27_18 AM copy copy copy copy copy copy copy copy copy copy copy.png"
              alt="BakeStatements Koala Logo"
              className="w-24 h-24 mx-auto mb-6"
            />
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to BakeStatements
            </h1>
            <p className="text-gray-600 text-sm">
              Professional bakery management for Australian bakers
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link - only show in sign-in mode */}
            {!isSignUp && (
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Start Free Trial'}
            </button>
          </form>

          {/* Trial Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-50 text-green-700 border border-green-200">
              <span className="mr-2">🎉</span>
              <strong>7-day free trial</strong> - No credit card required
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg text-sm ${
              isSuccess || message.includes('Success') || message.includes('updated successfully') || message.includes('verified successfully')
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message}
              
              {/* Resend Verification Button */}
              {showResendVerification && (
                <div className="mt-3">
                  <button
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {resendLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Resend Verification</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Toggle Auth Mode */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setMessage('')
                setIsSuccess(false)
                setShowResendVerification(false)
                setPassword('')
              }}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Start free trial'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 space-y-4">
        {/* Terms Text */}
        <div className="text-center text-xs text-gray-500">
          By continuing, you agree to our{' '}
          <Link to="/privacy-terms" className="text-gray-700 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy-terms" className="text-gray-700 hover:underline">Privacy Policy</Link>
        </div>
        
        {/* Footer Brand */}
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ChefHat className="w-5 h-5 text-gray-500" />
            <span>BakeStatements</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <span>made in</span>
            <span className="text-base">🇦🇺</span>
          </div>
        </div>
      </div>
    </div>
  )
}