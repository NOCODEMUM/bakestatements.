import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ChefHat, Eye, EyeOff, Mail, Clock } from 'lucide-react'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmationBanner, setShowConfirmationBanner] = useState(false)
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendMessage, setResendMessage] = useState('')
  const { user, signUp, signIn, resendConfirmationEmail } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    const urlMessage = searchParams.get('message')
    if (urlMessage === 'password_updated') {
      setMessage('Password updated successfully! You can now sign in with your new password.')
      setIsSuccess(true)
      setIsSignUp(false)
    }

    const storedEmail = sessionStorage.getItem('pendingConfirmationEmail')
    if (storedEmail) {
      setPendingConfirmationEmail(storedEmail)
      setShowConfirmationBanner(true)
      setIsSignUp(false)
    }
  }, [searchParams])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendCooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setIsSuccess(false)
    setResendMessage('')

    try {
      if (isSignUp) {
        const result = await signUp(email, password)
        if (result.needsConfirmation) {
          setPendingConfirmationEmail(email)
          sessionStorage.setItem('pendingConfirmationEmail', email)
          setShowConfirmationBanner(true)
          setIsSignUp(false)
          setPassword('')
        } else {
          setMessage('Account created successfully! You can now sign in.')
          setIsSuccess(true)
          setIsSignUp(false)
        }
      } else {
        await signIn(email, password)
        sessionStorage.removeItem('pendingConfirmationEmail')
        setShowConfirmationBanner(false)
        setPendingConfirmationEmail('')
      }
    } catch (error: any) {
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        setMessage('Email already registered')
      } else if (error.message.includes('Invalid') || error.message.includes('credentials')) {
        setMessage('Email or password didn\'t match')
      } else if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
        setMessage('Please confirm your email address first. Check your inbox for the confirmation link.')
        if (!showConfirmationBanner && email) {
          setPendingConfirmationEmail(email)
          setShowConfirmationBanner(true)
        }
      } else {
        setMessage(error.message || 'An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (resendCooldown > 0 || !pendingConfirmationEmail) return

    setResendMessage('')
    setLoading(true)

    try {
      await resendConfirmationEmail(pendingConfirmationEmail)
      setResendMessage('Confirmation email sent! Check your inbox.')
      setResendCooldown(60)
    } catch (error: any) {
      setResendMessage(error.message || 'Failed to resend email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Link to="/landing" className="flex items-center space-x-2">
          <ChefHat className="w-6 h-6 text-amber-600" />
          <span className="text-lg font-semibold text-gray-800">BakeStatements</span>
        </Link>
        <Link
          to="/landing"
          className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Koala Logo */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-amber-500 rounded-full flex items-center justify-center text-5xl">
              🧁
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to BakeStatements
            </h1>
            <p className="text-gray-600 text-sm">
              Professional bakery management for Australian bakers
            </p>
          </div>

          {/* Confirmation Banner */}
          {showConfirmationBanner && pendingConfirmationEmail && (
            <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Check your email to get started!
                  </h3>
                  <p className="text-sm text-blue-800 mb-1">
                    We've sent a confirmation email to <strong>{pendingConfirmationEmail}</strong>
                  </p>
                  <p className="text-sm text-blue-700 mb-4">
                    Click the link in the email to activate your account. Don't forget to check your spam folder!
                  </p>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleResendConfirmation}
                      disabled={resendCooldown > 0 || loading}
                      className="text-sm font-medium text-blue-700 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {resendCooldown > 0 ? (
                        <>
                          <Clock className="w-4 h-4 mr-1" />
                          Resend available in {resendCooldown}s
                        </>
                      ) : (
                        'Resend confirmation email'
                      )}
                    </button>
                  </div>
                  {resendMessage && (
                    <p className={`text-sm mt-2 ${
                      resendMessage.includes('sent') ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {resendMessage}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmationBanner(false)
                    sessionStorage.removeItem('pendingConfirmationEmail')
                    setPendingConfirmationEmail('')
                  }}
                  className="ml-2 text-blue-400 hover:text-blue-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

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
             {loading ? 'Loading...' : (isSignUp ? 'Start Free Trial' : 'Login')}
            </button>
          </form>

          {/* Trial Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-50 text-green-700 border border-green-200">
              <span className="mr-2">🎉</span>
              <strong>7-day free trial</strong> - No credit card required
            </div>
          </div>

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-sm ${
              isSuccess || message.includes('Success') || message.includes('updated successfully') || message.includes('created successfully')
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message}
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