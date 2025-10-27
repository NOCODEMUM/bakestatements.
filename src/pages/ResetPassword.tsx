import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChefHat, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('error')
  
  const { updateUserPassword } = useAuth()

  // Check if we have the required tokens from the URL
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      setMessage('Invalid or missing reset link. Please request a new password reset.')
      setMessageType('error')
    }
  }, [accessToken, refreshToken])

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
    
    if (!accessToken || !refreshToken) {
      setMessage('Link expired, request a new one')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Validate password
      if (!isPasswordValid(formData.password)) {
        throw new Error('Password must be at least 8 characters and include both letters and numbers')
      }

      // Check passwords match
      if (!passwordsMatch) {
        throw new Error('Passwords do not match')
      }

      const { error } = await updateUserPassword(formData.password, accessToken, refreshToken)
      if (error) {
        if (error.message?.includes('expired') || error.message?.includes('invalid')) {
          throw new Error('Link expired, request a new one')
        }
        throw error
      }
      
      // Success - redirect to login with success message
      navigate('/auth?message=Password updated successfully&type=success')
    } catch (error: any) {
      setMessage(error.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
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
        <a href="/forgot-password" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Icon and Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ChefHat className="w-8 h-8 text-amber-600" />
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Set New Password
            </h1>
            <p className="text-gray-600 text-sm">
              Choose a strong password for your BakeStatements account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                  placeholder="Enter your new password"
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
              
              {/* Password Requirements */}
              {formData.password && (
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                  placeholder="Confirm your new password"
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

            <button
              type="submit"
              disabled={loading || !isPasswordValid(formData.password) || !passwordsMatch || !accessToken || !refreshToken}
              className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 focus:ring-4 focus:ring-amber-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          {/* Messages */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg text-sm border ${
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
                <p>{message}</p>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Need help?{' '}
              <a href="/forgot-password" className="text-amber-600 hover:text-amber-700 font-medium">
                Try again
              </a>
              {' or '}
              <a href="/auth" className="text-amber-600 hover:text-amber-700 font-medium">
                Back to Sign In
              </a>
            </p>
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