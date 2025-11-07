import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ChefHat } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        if (session) {
          navigate('/', { replace: true })
        } else {
          navigate('/auth', { replace: true })
        }
      } catch (err: any) {
        console.error('Auth callback error:', err)
        setError(err.message || 'Authentication failed')
        setTimeout(() => {
          navigate('/auth', { replace: true })
        }, 3000)
      }
    }

    handleAuthCallback()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/', { replace: true })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <img
          src="/20250821_1326_Baking Koala_remix_01k35afawhfm8tcpx1kf95gj8h.png"
          alt="BakeStatements Koala"
          className="w-24 h-24 mx-auto mb-6"
        />

        {error ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-gray-800">Authentication Error</h1>
            <p className="text-red-600">{error}</p>
            <p className="text-sm text-gray-600">Redirecting to sign in...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <h1 className="text-2xl font-semibold text-gray-800">Verifying your account...</h1>
            <p className="text-gray-600">Please wait while we sign you in</p>
          </div>
        )}
      </div>

      <div className="mt-12 flex items-center space-x-2 text-sm text-gray-600">
        <ChefHat className="w-5 h-5 text-gray-500" />
        <span>BakeStatements</span>
      </div>
    </div>
  )
}
