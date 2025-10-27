import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ChefHat, ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('error')
  const [emailSent, setEmailSent] = useState(false)

  const { resetPasswordForEmail } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await resetPasswordForEmail(email)
      if (error) throw error

      setEmailSent(true)
      setMessage('Password reset link sent! Check your email (including spam folder).')
      setMessageType('success')
    } catch (error: any) {
      setMessage(error.message || 'Error sending reset email. Please try again.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Link to="/auth" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Sign In</span>
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
              <Mail className="w-8 h-8 text-amber-600" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Forgot Your Password?
            </h1>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 focus:ring-4 focus:ring-amber-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Check Your Email</h2>
                <p className="text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Don't see the email? Check your spam folder or try again.
                </p>
              </div>
              <button
                onClick={() => {
                  setEmailSent(false)
                  setEmail('')
                  setMessage('')
                }}
                className="text-amber-600 hover:text-amber-700 font-medium text-sm"
              >
                Try a different email
              </button>
            </div>
          )}

          {/* Messages */}
          {message && (
            <div className={`mt-4 p-4 rounded-lg text-sm border ${messageType === 'success'
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
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Remember your password?{' '}
              <Link to="/auth" className="text-amber-600 hover:text-amber-700 font-medium">
                Sign In
              </Link>
            </p>
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
