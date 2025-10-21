import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ChefHat, Lock, Eye, EyeOff } from 'lucide-react'
import { api } from '../lib/api'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/[A-Za-z]/.test(password)) {
      return 'Password must include letters'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must include numbers'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (!token) {
      setMessage('Invalid reset link. Please request a new password reset.')
      setLoading(false)
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setMessage(passwordError)
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      await api.auth.resetPassword(token, password)
      navigate('/auth?message=password_updated')
    } catch (error: any) {
      if (error.message.includes('expired') || error.message.includes('invalid')) {
        setMessage('Link expired, request a new one')
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                  placeholder="Enter new password"
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
              <p className="text-xs text-gray-500 mt-2">
                At least 8 characters with letters and numbers
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                  placeholder="Confirm new password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 focus:ring-4 focus:ring-amber-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg text-sm ${
              message.includes('Link expired')
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message}
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
