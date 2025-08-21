import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const { signUp, signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) throw error
        setMessage('Success! Check your email for the confirmation link.')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
      }
    } catch (error: any) {
      if (error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed')) {
        setMessage('Please check your email and click the confirmation link before signing in. Check your spam folder if you don\'t see the email.')
      } else {
        setMessage(error.message)
      }
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Start Free Trial' : 'Sign In')}
            </button>
          </form>

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
            <div className={`mt-4 p-4 rounded-lg text-sm ${
              message.includes('Success') 
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
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Start free trial'}
            </button>
          </div>

          {/* Terms */}
          <div className="mt-8 text-center text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-gray-700 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-gray-700 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6">
        <div className="flex items-center justify-between max-w-sm mx-auto">
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