import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
  resetPasswordForEmail: (email: string) => Promise<any>
  updateUserPassword: (password: string, accessToken: string, refreshToken: string) => Promise<any>
  resendVerification: (email: string) => Promise<any>
  isTrialExpired: boolean
  hasActiveSubscription: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTrialExpired, setIsTrialExpired] = useState(false)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (session?.user) {
        checkTrialStatus(session.user.id)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (session?.user) {
          checkTrialStatus(session.user.id)
        } else {
          setIsTrialExpired(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkTrialStatus = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('trial_end_date, subscription_status')
      .eq('id', userId)
      .single()
    
    if (profile) {
      const trialEnd = new Date(profile.trial_end_date)
      const now = new Date()
      const trialExpired = now > trialEnd
      const activeSubscription = profile.subscription_status === 'active'
      
      setIsTrialExpired(trialExpired && !activeSubscription)
      setHasActiveSubscription(activeSubscription)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    
    // If sign up successful and user created, update profile with full name
    if (result.data.user && fullName) {
      try {
        await supabase
          .from('profiles')
          .update({ full_name: fullName })
          .eq('id', result.data.user.id)
      } catch (error) {
        console.error('Error updating profile with full name:', error)
      }
    }
    
    return result
  }

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return result
  }

  const signOut = async () => {
    const result = await supabase.auth.signOut()
    return result
  }

  const resetPasswordForEmail = async (email: string) => {
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return result
  }

  const updateUserPassword = async (password: string, accessToken: string, refreshToken: string) => {
    // Set the session with the tokens from the reset link
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })
    
    if (sessionError) throw sessionError
    
    // Update the password
    const result = await supabase.auth.updateUser({
      password: password
    })
    
    // Sign out after password update to force fresh login
    await supabase.auth.signOut()
    
    return result
  }

  const resendVerification = async (email: string) => {
    const result = await supabase.auth.resend({
      type: 'signup',
      email: email
    })
    return result
  }
  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      resetPasswordForEmail,
      updateUserPassword,
      resendVerification,
      isTrialExpired,
      hasActiveSubscription
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}