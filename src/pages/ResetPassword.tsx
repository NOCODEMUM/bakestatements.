import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ChefHat, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

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
      navigate('/auth?message=password_updated')
    } catch (error: any) {
      setMessage(error.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Link to="/auth" className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors">
          Back to Sign In
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/landing" className="text-sm text-gray-600 hover:text-teal-600 font-medium transition-colors">
            Home
          </Link>
          <Link to="/landing" className="flex items-center space-x-2">
            <ChefHat className="w-6 h-6 text-amber-500" />
            <span className="font-semibold text-gray-800">BakeStatements</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Reset Your Password
            </h1>
            <p className="text-gray-600">
              Enter your new password below. Make sure it's strong and secure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  <div className={`flex items-center space-x-2 text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-xs ${/[a-zA-Z]/.test(formData.password) && /\d/.test(formData.password) ? 'text-green-600' : 'text-gray-500'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${/[a-zA-Z]/.test(formData.password) && /\d/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
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
                <div className={`flex items-center space-x-2 text-xs mt-2 ${passwordsMatch ? 'text-green-600' : 'text-red-600'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${passwordsMatch ? 'bg-green-500' : 'bg-red-500'
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
            <div className={`mt-6 p-4 rounded-lg text-sm border ${messageType === 'success'
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
                  {message.includes('Link expired') && (
                    <div className="mt-3">
                      <Link
                        to="/forgot-password"
                        className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Request New Reset Link
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link to="/auth" className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
          <ChefHat className="w-4 h-4" />
          <span>BakeStatements by PIX3L</span>
        </div>
        <p className="text-xs text-gray-500">
          © 2025 BakeStatements by PIX3L. Made with ❤️ in Sydney, Australia. 🇦🇺
        </p>
      </div>
    </div>
  )
}
