import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resendingVerification, setResendingVerification] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    rememberMe: false
  })
  
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('error')
  const [showResendVerification, setShowResendVerification] = useState(false)
  
  const { signUp, signIn, resetPasswordForEmail, resendVerification } = useAuth()

  // Password validation
  const isPasswordValid = (password: string) => {
    const hasMinLength = password.length >= 8
    const hasLetters = /[a-zA-Z]/.test(password)
    const hasNumbers = /\d/.test(password)
    return hasMinLength && hasLetters && hasNumbers
  }

  const passwordsMatch = formData.password === formData.confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setShowResendVerification(false)

    try {
      if (isSignUp) {
        // Validate password
        if (!isPasswordValid(formData.password)) {
          throw new Error('Password must be at least 8 characters and include both letters and numbers')
        }

        // Check passwords match
        if (!passwordsMatch) {
          throw new Error('Passwords do not match')
        }

        // Check terms agreement
        if (!formData.agreeToTerms) {
          throw new Error('You must agree to the Terms & Privacy Policy')
        }

        const { error } = await signUp(formData.email, formData.password, formData.fullName)
        if (error) {
          if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
            throw new Error('Email already registered')
          }
          throw error
        }
        
        setMessage('Success! Check your email for the verification link.')
        setMessageType('success')
      } else {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          if (error.message?.includes('Invalid') || error.message?.includes('invalid')) {
            throw new Error('Email or password didn\'t match')
          }
          if (error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed')) {
            setMessage('Email not verified. Please check your email and click the verification link.')
            setMessageType('error')
            setShowResendVerification(true)
            return
          }
          throw error
        }
      }
    } catch (error: any) {
      setMessage(error.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setResendingVerification(true)
    try {
      const { error } = await resendVerification(formData.email)
      if (error) throw error
      
      setMessage('Verification email sent! Check your inbox.')
      setMessageType('success')
      setShowResendVerification(false)
    } catch (error: any) {
      setMessage(error.message)
      setMessageType('error')
    } finally {
      setResendingVerification(false)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      rememberMe: false
    })
    setMessage('')
    setShowResendVerification(false)
  }

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <img 
            src="/bakestatements-logo.png" 
            alt="BakeStatements Logo" 
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold text-gray-800">BakeStatements</span>
        </div>
        <a href="/landing" className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
          Back to Home
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Koala Mascot */}
          <div className="text-center mb-8">
            <div className="inline-block mb-6">
              <img 
                src="/bakestatements-logo.png" 
                alt="BakeStatements Koala Mascot" 
                className="w-32 h-32 mx-auto mb-4 rounded-2xl shadow-lg object-cover"
              />
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600 text-sm">
              {isSignUp 
                ? 'Start your 7-day free trial today' 
                : 'Sign in to your BakeStatements account'
              }
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name - Sign Up Only */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
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
              
              {/* Password Requirements - Sign Up Only */}
              {isSignUp && formData.password && (
                <div className="mt-2 space-y-1">
                  <div className={`flex items-center space-x-2 text-xs ${
                    formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-xs ${
                    /[a-zA-Z]/.test(formData.password) && /\d/.test(formData.password) ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      /[a-zA-Z]/.test(formData.password) && /\d/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span>Include letters and numbers</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password - Sign Up Only */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className={`flex items-center space-x-2 text-xs mt-2 ${
                    passwordsMatch ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      passwordsMatch ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                  </div>
                )}
              </div>
            )}

            {/* Terms & Privacy Checkbox - Sign Up Only */}
            {isSignUp && (
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="/privacy-terms" target="_blank" className="text-amber-600 hover:text-amber-700 font-medium">
                    Terms & Privacy Policy
                  </a>
                </label>
              </div>
            )}

            {/* Remember Me - Sign In Only */}
            {!isSignUp && (
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-700">
                  Remember me (7 days)
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (isSignUp && (!isPasswordValid(formData.password) || !passwordsMatch || !formData.agreeToTerms))}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Start Free Trial' : 'Sign In')}
            </button>
          </form>

          {/* Forgot Password Link - Sign In Only */}
          {!isSignUp && (
            <div className="mt-4 text-center">
              <a href="/forgot-password" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                Forgot your password?
              </a>
            </div>
          )}

          {/* Trial Badge */}
          {isSignUp && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700 border border-green-200">
                <span className="mr-1">🎉</span>
                <strong>7-day free trial</strong> - No credit card required
              </div>
            </div>
          )}

          {/* Messages */}
          {message && (
            <div className={`mt-4 p-4 rounded-lg text-sm border ${
              messageType === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-start space-x-2">
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p>{message}</p>
                  {showResendVerification && (
                    <button
                      onClick={handleResendVerification}
                      disabled={resendingVerification}
                      className="mt-2 text-sm text-amber-600 hover:text-amber-700 font-medium underline disabled:opacity-50"
                    >
                      {resendingVerification ? 'Sending...' : 'Resend verification email'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Toggle Auth Mode */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Start free trial'}
            </button>
          </div>

          {/* Terms */}
          <div className="mt-8 text-center text-xs text-gray-500">
            {!isSignUp && (
              <>
                By continuing, you agree to our{' '}
                <a href="/privacy-terms" className="text-gray-700 hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="/privacy-terms" className="text-gray-700 hover:underline">Privacy Policy</a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <img 
              src="/bakestatements-logo.png" 
              alt="BakeStatements Logo" 
              className="w-6 h-6 rounded-full object-cover"
            />
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