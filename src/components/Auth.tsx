import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ChefHat, Eye, EyeOff } from 'lucide-react'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signUp, signIn } = useAuth()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const urlMessage = searchParams.get('message')
    if (urlMessage === 'password_updated') {
      setMessage('Password updated successfully! You can now sign in with your new password.')
      setIsSuccess(true)
      setIsSignUp(false)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setIsSuccess(false)

    try {
      if (isSignUp) {
        await signUp(email, password)
        setMessage('Account created successfully! You can now sign in.')
        setIsSuccess(true)
        setIsSignUp(false)
      } else {
        await signIn(email, password)
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      if (error.message.includes('User already registered') || error.message.includes('already exists')) {
        setMessage('Email already registered')
      } else if (error.message.includes('Invalid login credentials') || error.message.includes('credentials')) {
        setMessage('Email or password didn\'t match')
      } else if (error.message.includes('Email not confirmed')) {
        setMessage('Please check your email to confirm your account')
      } else {
        setMessage(error.message || 'An error occurred. Please try again.')
      }
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
            <img
              src="/20250821_1326_Baking Koala_remix_01k35afawhfm8tcpx1kf95gj8h.png"
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